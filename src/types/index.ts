import type { InstrumentCache } from './instrumentCache.js'
import type { CustomerAccountBalanceType } from './user.js'

export * from './instrument'
export * from './instrumentCache'
export * from './notification'
export * from './order'
export * from './user'

export interface IndexFilterType {
    length: number
    offset: number
    withTotal?: boolean
}

export interface MainFlagStates {
    active: boolean
    suspended?: boolean
}

export enum ValidationType {
    Day = 1,
    GoodTillDate = 2,
    GoodTillCancel = 3,
    FillAndKill = 4,
    Session = 5,
    SlidingValidity = 6,
}

export enum OrderTypes {
    Limit = 1,
    MarketOnOpening = 2,
    Market = 3,
    Stop = 4,
    MarketToLimit = 5,
}

export interface ErrorType {
    id: number;
    orderId: number;
    errorCode: number;
    message: string;
}

export type OrderType = {
    id?: number | null
    instrumentId: number | null
    instrument?: InstrumentCache | null,
    customerId: number | null
    creationDate?: string | null
    quantity: number | null
    enteredPrice: number | null
    remainQuantity?: number | null
    remainingQuantity?: number | null
    side: OrderSideKeys | null
    customer?: CustomerType | null,
    tradeValue?: number | null,
    commission?: number | null,
    flags: number | null,
    flagStates?: {
        clientRequest: boolean
        draft: boolean
        created: boolean
        sent: boolean
        cancelled: boolean
        confirmed: boolean
        preOpening: boolean
        cancelRequest: boolean
        editRequest: boolean
        canEdit: boolean
        canDelete: boolean
    },

    isin?: string | null,
    minQuantity?: number | null,
    discloseQuantity: number | null,
    triggerPrice?: number | null,
    orderType?: OrderTypes;
    validityType?: ValidationType;
    validityDate?: string | null;
    termsAndConditions?: boolean;
    orderErrors?: Array<ErrorType>
    translatedFlag?: string
    orderDivision?: boolean;
    validatePercent?: number;
    accountType?: number;
}

export interface GetWagesFilterType extends IndexFilterType {
  instrumentId: string
}

export type FiltersForCreateRequestType = {
    type: string;
    value: Record<string, any>;
    excludes: number[] | null;
}

export enum OrderSideKeys {
    BUY = 1,
    SELL = 2,
    CROSS = 3,
}

export enum CustomerTypeKeys {
    REAL = 1,
    LEGAL = 2,
}

export enum ValidityTypeKeys {
    DAY = 1,
    GOOD_TILL_DATE = 2,
    GOOD_TILL_CANCEL = 4,
    FILL_AND_KILL = 8,
    SESSION = 16,
    SLIDING_VALIDITY = 32,
}

export enum OrderRequestTypeKeys {
    CREATE = 1,
    EDIT = 2,
    CANCEL = 4,
    DRAFT = 8,
}

export interface CustomerTypeStates {
    real: boolean
    legal: boolean
}

export interface OrderSideStates {
    buy: boolean
    sell: boolean
    cross: boolean
}

export interface ValidityTypeStates {
    day: boolean
    goodTillDate: boolean
    goodTillCancel: boolean
    fillAndKill: boolean
    session: boolean
    slidingValidity: boolean
}

export interface OrderRequestTypeStates {
    create: boolean
    edit: boolean
    cancel: boolean
    draft: boolean
}

export type RestrictionType = {
    id: number | null
    name: string | null
    file: File | string | null
    script: string | null
    filters: Array<FiltersForCreateRequestType> | null
    orderNumber: number | null
    errorMessage: string | null
    description: string | null
    flags: number | null
    flagStates?: MainFlagStates
}

export type CustomerType = {
    name: string | null
    id: number | null
    fullName: string | null
    countryId?: number | null
    provinceId?: number | null
    registrationPlace: number | null
    registrationDate: string | null
    idNumber: string | null
    tradingStationId: number | null
    brokerageBranchId?: number | null
    branchId?: number | null
    tradingCode: number | null
    customerType: number | null
    type?: number | null
    flag: number | null
    realCustomerFlag: number | null
    realCustomerFlagStates?: RealCustomerFlagStates
    customerFlag: number | null
    customerFlagStates?: MainFlagStates
    legalCustomerFlag: number | null
    mobileNumber?: string | null
    address?: string | null
    zipCode?: string | null
    legalCustomerFlagStates?: MainFlagStates
}

export interface RealCustomerFlagStates {
    alive: boolean
    married: boolean
}

export interface WageType {
    id: number;
    buyMax: number;
    buyMin: number;
    buyPercentage: number;
    sellMax: number;
    sellMin: number;
    sellPercentage: number;
}

export type AccountType = {
    id: number | null
    profileId?: string | null
    name: string | null
    balance: number | null
    totalDeposits?: number | null
    totalDebits?: number | null
    extraData: Record<string, any> | null,
    owner?: boolean | null
    branchId?: number | null
    accountType?: number | null
    default?: boolean | null
    iban?: string | null
    branch?: BankBranchType | null
    bank?: BankType | null
    flags?: number | null
}

export enum AccountsTypeKeys {
    WALLET = 0,
    BLOCKED = 1,
    CREDIT= 2,
    EXTERNAL = 3
}

export type BankBranchType = {
    id: number | null
    bankId: number | null
    cityId: number | null
    name: string | null
    code: string | null
    flagStates?: MainFlagStates
}

export type BankType = {
    id: number | null
    name: string | null
    idNumber: string | null
    flagStates?: MainFlagStates
}

export enum OrderFlags {
    ClientRequest = 0x00,
    Draft = 0x01,
    Created = 0x02,
    Sent = 0x04,
    Cancelled = 0x08,
    Confirmed = 0x10,
    PreOpening = 0x20,
    // Done = 0x40,
    CANCEL_REQUEST = 0x40, // -> 64
    EDIT_REQUEST = 0x80, // -> 128
    FAILED = 0x100 // -> 256
}

export interface OrderValidateResultType {
    status: boolean
    messages: string[]
}

export interface CheckRestrictionParamType {
    order: OrderType
    instrument: InstrumentCache
    // orderTradeValue: number
    bestBid: number
    bestAsk: number
    customer: {
        id: string
        customerType: string
    }
    customerAccountBalances: Array<CustomerAccountBalanceType>
    customerGroups: Array<string>
    currentTime: number // Epoch Time ms
    orderRequestType: OrderRequestTypeKeys
}