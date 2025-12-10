export enum InstrumentStatus {
  Disabled = 0x00,
  ActiveRead = 0x01,
  PreActive = 0x02,
  ActiveOrder = 0x03,
  Inactive = 0x04,
  ActiveTrading = 0x05,
  IG = 0x06,
  Active = 0x07,
}

export class InstrumentOrderQueueItem {
  amount: number = 0
  count: number = 0
  price: number = 0.0
}

export class InstrumentOrderQueue {
  buy: InstrumentOrderQueueItem = new InstrumentOrderQueueItem()
  sell: InstrumentOrderQueueItem = new InstrumentOrderQueueItem()
}

export class Instrument {
  [x: string]: any;
  id: number
  type: number
  instrumentId: number
  instrumentCode: string
  code: string
  name: string
  fullName: string
  sector: number
  categoryName: string
  baseVol: number
  tradeVal: number
  settlementDelay: number
  maxAllowedPrice: number
  minAllowedPrice: number
  namedPrice: number
  buyPrice: number
  sellPrice: number
  shares: number
  company: number
  companyName: string
  maxQuantityPerOrder: number
  minQuantityPerOrder: number
  issuePrice: number
  firstTradeDate: string
  lastTradeDate: string
  expirationDate: string
  lastModification: string
  status: number
  market: number
  flow: number
  quantityRate: number
  priceRate: number

  constructor () {
    this.id = 0
    this.type = 1
    this.instrumentId = 0
    this.instrumentCode = this.instrumentId.toString()
    this.baseVol = 0
    this.categoryName = ''
    this.code = ''
    this.company = 0
    this.companyName = ''
    this.expirationDate = ''
    this.firstTradeDate = ''
    this.fullName = ''
    this.issuePrice = 0
    this.lastModification = ''
    this.lastTradeDate = ''
    this.maxAllowedPrice = 0
    this.maxQuantityPerOrder = 0
    this.minQuantityPerOrder = 0
    this.minAllowedPrice = 0
    this.name = ''
    this.namedPrice = 0
    this.buyPrice = 0
    this.sellPrice = 0
    this.sector = 0
    this.settlementDelay = 0
    this.tradeVal = 0
    this.shares = 0
    this.status = 0
    this.market = 1
    this.flow = 1
    this.quantityRate = 1
    this.priceRate = 1
  }
}

export interface DailyPrice {
  id: number;
  instrumentCode: string;
  instrumentId: number;
  dateTime: string;
  opening: number;
  closing: number;
  highest: number;
  lowest: number;
  last: number;
  priceChange: number;
  yesterdayPrice: number;
}

export interface MarketHistory {
  id: number;
  instrumentId: number;
  instrumentCode: string;
  dateTime: string;
  totalShares: number;
  totalTrades: number;
  totalTradesValue: number;
}

export class Wealth {
  id: number
  instrumentId: number
  amount: number
  constructor () {
    this.id = 0
    this.instrumentId = this.id
    this.amount = 0
  }
}

export type InstrumentCachePriceInput = {
  dateTime: string;
  last: number;
  opening: number;
  closing: number;
  highest: number;
  lowest: number;
  yesterdayPrice: number;
}

export type InstrumentCacheMarketInput = {
  totalShares: number;
  totalTrades: number;
  totalTradesValue: number;
}
