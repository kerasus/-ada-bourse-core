import type { InstrumentCache } from './instrumentCache.js'
import {AccountsTypeKeys} from "./index";

export interface TradeType {
  id: number | null
  orderId: number | null
  tradeDate: string | null
  quantity: number | null
  instrumentId: number | null
  instrument?: InstrumentCache
  price: number | null
  side: number | null
  flags: number | null
}

export interface UserInstrumentType {
  id: number
  isin: string | null
  instrumentId: number | null
  instrument?: InstrumentCache
  companyName: string | null
  tempAmount: number | null
  amount: number | null
  lastCommit: string | null
  price: number | null
  lastPrice: number | null
  trades?: TradeType[]
}

export class UserInstrumentClass implements UserInstrumentType {
  id: number
  isin: string | null
  instrumentId: number | null
  instrument?: InstrumentCache
  companyName: string | null
  tempAmount: number | null
  amount: number | null
  lastCommit: string | null
  price: number | null
  lastPrice: number | null
  trades?: TradeType[]
  constructor (data?: UserInstrumentType | null) {
    this.id = data?.id ?? 0
    this.isin = data?.isin ?? ''
    this.instrumentId = data?.instrumentId ?? 0
    this.instrument = data?.instrument ?? undefined
    this.companyName = data?.companyName ?? ''
    this.tempAmount = data?.tempAmount ?? 0
    this.amount = data?.amount ?? 0
    this.lastCommit = data?.lastCommit ?? new Date().toISOString()
    this.price = data?.price ?? 0
    this.lastPrice = data?.lastPrice ?? 0
    this.trades = data?.trades ?? []
  }
}

export interface CustomerAccountBalanceType {
  id: number
  type: AccountsTypeKeys
  balance: number
}
