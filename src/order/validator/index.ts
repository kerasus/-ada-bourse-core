import {
    AccountsTypeKeys,
    InstrumentCache,
    OrderSideKeys,
    OrderType,
    type OrderValidateResultType,
    type CheckRestrictionParamType,
    type RestrictionType,
    type UserInstrumentType,
    type CustomerAccountBalanceType,
    OrderRequestTypeKeys,
    WageType
} from "../../types";
import {getBuyTradeValue} from '../calculator'
import {parseOrderFlags} from '../normalizer'
import {executeLuaScriptInWorker} from "../../workers";


export function checkInstrumentLimits (
    order: OrderType,
    orderInstrument: InstrumentCache
): OrderValidateResultType {
    const instrument = orderInstrument

    let status = true
    const messages = []
    if (!instrument) {
        status = false
        messages.push('error.orderValidate.instrument.notFound')
    }
    if ((instrument.status & 3) != 3) {
        status = false
        messages.push('error.orderValidate.instrument.status.ACTIVE_ORDER')
    }
    const enteredPrice = order.enteredPrice
    if (enteredPrice === null || enteredPrice === undefined || isNaN(enteredPrice) || enteredPrice <= 0) {
        status = false
        messages.push('error.orderValidate.order.enteredPrice')
        return {
            status,
            messages
        }
    }
    const quantity = order.quantity
    if (quantity === null || quantity === undefined || isNaN(quantity) || quantity <= 0) {
        status = false
        messages.push('error.orderValidate.order.quantity')
        return {
            status,
            messages
        }
    }
    if (instrument.minAllowedPrice && enteredPrice < instrument.minAllowedPrice) {
        status = false
        messages.push('error.orderValidate.instrument.minAllowedPrice')
    }
    if (instrument.maxAllowedPrice && enteredPrice > instrument.maxAllowedPrice) {
        status = false
        messages.push('error.orderValidate.instrument.maxAllowedPrice')
    }
    if (instrument.minQuantityPerOrder && quantity < instrument.minQuantityPerOrder) {
        status = false
        messages.push('error.orderValidate.instrument.minQuantityPerOrder')
    }
    if (instrument.maxQuantityPerOrder && quantity > instrument.maxQuantityPerOrder) {
        status = false
        messages.push('error.orderValidate.instrument.maxQuantityPerOrder')
    }
    if (instrument.quantityRate && quantity % instrument.quantityRate!= 0) {
        status = false
        messages.push('error.orderValidate.instrument.quantityRate')
    }
    if (instrument.priceRate && enteredPrice % instrument.priceRate!= 0) {
        status = false
        messages.push('error.orderValidate.instrument.priceRate')
    }
    return {
        status,
        messages
    }
}

export function checkBuyingPower (
    order: OrderType,
    wages: WageType[],
    customerAccountBalances: Array<CustomerAccountBalanceType>
): OrderValidateResultType {
    if (order.side === OrderSideKeys.SELL) {
        return {status: true, messages: []}
    }


    const enteredPrice = order.enteredPrice
    if (enteredPrice === null || enteredPrice === undefined || isNaN(enteredPrice) || enteredPrice <= 0) {
        return {status: false, messages: ['error.buyingPower.order.enteredPrice']}
    }
    const quantity = order.quantity
    if (quantity === null || quantity === undefined || isNaN(quantity) || quantity <= 0) {
        return {status: false, messages: ['error.buyingPower.order.quantity']}
    }

    let tradeValue = 0
    if (order.side === OrderSideKeys.BUY) {
        tradeValue = getBuyTradeValue(wages, quantity, enteredPrice)
    }
    const getAccountBalance = (accountType: AccountsTypeKeys) => customerAccountBalances.find((account) => account.type === accountType)?.balance ?? 0
    const customerWalletBalance = getAccountBalance(AccountsTypeKeys.WALLET)
    const customerCreditBalance = getAccountBalance(AccountsTypeKeys.CREDIT)

    return {
        status: tradeValue <= customerWalletBalance + customerCreditBalance,
        messages: [
            'error.orderValidate.buyingPower'
        ]
    }
}

export function checkWealth (
    order: OrderType,
    orderInstrument: InstrumentCache,
    userInstrument: UserInstrumentType | null | undefined
): OrderValidateResultType {
    try {
        if (order.side === OrderSideKeys.BUY) {
            return { status: true, messages: [] }
        }

        const quantity = order.quantity
        if (quantity === null || quantity === undefined || isNaN(quantity) || quantity <= 0) {
            return {status: false, messages: ['error.wealth.order.quantity']}
        }

        let instrument: InstrumentCache | null = orderInstrument

        if (!instrument) {
            return { status: false, messages: ['error.orderValidate.wealth.instrumentNotFound'] }
        }

        if (!userInstrument || !userInstrument.amount) {
            return { status: false, messages: ['error.orderValidate.wealth.noHoldings'] }
        }

        if (userInstrument.amount < quantity) {
            return { status: false, messages: ['error.orderValidate.wealth.insufficientHoldings'] }
        }

        return { status: true, messages: [] }
    } catch {
        return {
            status: false,
            messages: ['error.orderValidate.wealth.apiError']
        }
    }
}

export async function checkRestrictions (
    restrictions: RestrictionType[],
    params: CheckRestrictionParamType,
    orderInstrument: InstrumentCache
): Promise<OrderValidateResultType> {
    const restrictionCount = restrictions.length
    const newParams = JSON.parse(JSON.stringify(params))
    newParams.instrument = orderInstrument
    if (!newParams.instrument) {
        return { status: false, messages: ['error.orderValidate.restrictions.instrumentNotFound'] }
    }

    for (let i = 0; i < restrictionCount; i++) {
        const restriction = restrictions[i]
        const errorMessage = restriction.errorMessage || ''
        const luaCode = restriction.script
        if (!luaCode) {
            return { status: false, messages: ['error.orderValidate.restrictions.missingScript'] }
        }

        let result = null
        try {
            result = await executeLuaScriptInWorker(luaCode, newParams)
        } catch (e) {
            console.error(e)
            return { status: false, messages: ['error.orderValidate.restrictions.luaExecutionError'] }
        }

        if (result === 'true') {
            continue
        }

        if (result === 'false') {
            return { status: false, messages: ['error.orderValidate.restrictions.notAllowed', errorMessage] }
        }

        return { status: false, messages: ['error.orderValidate.restrictions.invalidScriptResult'] }
    }

    return { status: true, messages: [] }
}

export async function validateOrder (
    restrictions: RestrictionType[],
    params: CheckRestrictionParamType,
    wages: WageType[],
    orderInstrument: InstrumentCache,
    userInstrument: UserInstrumentType | undefined
): Promise<OrderValidateResultType> {
    const order = params.order

    if (params.orderRequestType === OrderRequestTypeKeys.DRAFT) {
        return {
            status: true,
            messages: []
        }
    }

    if (!order.flagStates) {
        order.flagStates = parseOrderFlags(order)
    }

    if (params.orderRequestType === OrderRequestTypeKeys.CANCEL && order.flagStates?.draft) {
        return {
            status: true,
            messages: []
        }
    }

    const instrumentLimitsResult = checkInstrumentLimits(order, orderInstrument)
    if (!instrumentLimitsResult.status) {
        return {
            status: false,
            messages: instrumentLimitsResult.messages
        }
    }

    const buyingPowerResult = checkBuyingPower(order, wages, params.customerAccountBalances)
    if (!buyingPowerResult.status) {
        return {
            status: false,
            messages: buyingPowerResult.messages
        }
    }

    const wealthResult = checkWealth(order, orderInstrument, userInstrument)
    if (!wealthResult.status) {
        return {
            status: false,
            messages: wealthResult.messages
        }
    }

    const restrictionsResult = await checkRestrictions(restrictions, params, orderInstrument)
    if (!restrictionsResult.status) {
        return {
            status: false,
            messages: restrictionsResult.messages
        }
    }

    return {
        status: true,
        messages: []
    }
}