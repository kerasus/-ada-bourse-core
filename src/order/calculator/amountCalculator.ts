import Big from 'big.js'
import type { WageType } from '../../types'
import { calculateWages, getSellWage, getBuyWage } from './wageCalculator'

export function getBaseTradeValue (quantity: number, price: number): number {
  if (!quantity || !price) {
    return 0
  }
  return new Big(quantity).times(price).toNumber()
}

export function getCountSell (wages: WageType[], price: number, wholePrice: number): number {
  if (!wholePrice || !price) {
    return 0
  }
  const tradeValue = new Big(wholePrice).div(price).toNumber()
  const sellWage = calculateWages(wages, 'sell', tradeValue)
  const basePrice = new Big(wholePrice).minus(sellWage).toNumber()
  const res = Math.floor(basePrice / price)

  if (isNaN(res) || res === Infinity) {
    return 0
  }
  return res
}

export function getCountBuy (wages: WageType[], price: number, wholePrice: number): number {
  if (!wholePrice || !price) {
    return 0
  }
  const buyWage = calculateWages(wages, 'buy', price)
  const basePrice = new Big(wholePrice).minus(buyWage).toNumber()
  const res = Math.floor(basePrice / price)

  if (isNaN(res) || res === Infinity) {
    return 0
  }
  return res
}

export function getBuyTradeValue (wages: WageType[], quantity: number, price: number): number {
  if (!quantity || !price) {
    return 0
  }
  return new Big(getBaseTradeValue(quantity, price)).plus(getBuyWage(wages, quantity, price)).toNumber()
}

export function getSellTradeValue (wages: WageType[], quantity: number, price: number): number {
  if (!quantity || !price) {
    return 0
  }
  return new Big(getBaseTradeValue(quantity, price)).plus(getSellWage(wages, quantity, price)).toNumber()
}