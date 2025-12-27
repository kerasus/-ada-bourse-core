import type { InstrumentCache } from './instrumentCache'
import type { OrderType } from './index'
import { ValidationType, OrderSideKeys } from './index'

export class DistributionItem {
  amount: number = 0
  count: number = 0
}

export class Distribution {
  buy: DistributionItem = new DistributionItem()
  sell: DistributionItem = new DistributionItem()
}

export class ClientDistribution {
  legal: Distribution = new Distribution()
  real: Distribution = new Distribution()
}

export class OrderItem {
  amount: number = 0
  count: number = 0
  price: number = 0.0
}

export class OrderQueueItem {
  buy: OrderItem = new OrderItem()
  sell: OrderItem = new OrderItem()
}

export enum OrderTypes {
    Limit = 1,
    MarketOnOpening = 2,
    Market = 3,
    Stop = 4,
    MarketToLimit = 5,
}

export class OrderClass implements OrderType {
  id: number
  instrumentId: number
  customerId: number
  instrument?: InstrumentCache | null
  creationDate: string
  quantity: number
  remainingQuantity: number
  minQuantity: number
  discloseQuantity: number
  enteredPrice: number
  triggerPrice: number
  side: OrderSideKeys
  orderType: OrderTypes
  validityType: ValidationType
  validityDate: string
  flags: number
  termsAndConditions: boolean

  orderDivision?: boolean
  validatePercent?: number
  accountType?: number

  constructor (data?: OrderType | null) {
    this.id = data?.id ?? 0
    this.instrumentId = data?.instrumentId ?? 0
    this.minQuantity = data?.minQuantity ?? 0
    this.orderType = data?.orderType ?? OrderTypes.Market
    this.quantity = data?.quantity ?? 0
    this.remainingQuantity = data?.remainingQuantity ?? 0
    this.discloseQuantity = data?.discloseQuantity ?? 0
    this.enteredPrice = data?.enteredPrice ?? 0
    this.triggerPrice = data?.triggerPrice ?? 0
    this.customerId = data?.customerId ?? 0
    this.side = data?.side ?? OrderSideKeys.BUY
    this.validityType = data?.validityType ?? ValidationType.Day
    this.validityDate = data?.validityDate ?? ''
    this.creationDate = data?.creationDate ?? ''
    this.termsAndConditions = true
    this.flags = data?.flags ?? 0
    this.instrument = data?.instrument ?? null

    this.orderDivision = data?.orderDivision ?? false
    this.validatePercent = data?.validatePercent ?? 0
    this.accountType = data?.accountType ?? 0
  }
}