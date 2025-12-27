import Big from 'big.js'
import type { WageType } from '../../types'
import { getBaseTradeValue, getCountBuy, getCountSell } from './amountCalculator'

export function getBuyWage (wages: WageType[], quantity: number, price: number): number {
  if (!quantity || !price) {
    return 0
  }
  return calculateWages(wages, 'buy', getBaseTradeValue(quantity, price))
}

export function getSellWage (wages: WageType[], quantity: number, price: number): number {
  if (!quantity || !price) {
    return 0
  }
  return calculateWages(wages, 'sell', getBaseTradeValue(quantity, price))
}

export function getWageCalculateBuy (wages: WageType[], price: number, wholePrice: number): number {
  if (!wholePrice || !price) {
    return 0
  }
  const buyWage = calculateWages(wages, 'buy', price)
  const res = new Big(buyWage).times(getCountBuy(wages, price, wholePrice)).toNumber()
  if (isNaN(res)) { return 0 }
  return res
}

export function getWageCalculateSell (wages: WageType[], price: number, wholePrice: number): number {
  if (!wholePrice || !price) {
    return 0
  }
  const sellWage = calculateWages(wages, 'sell', price)
  const res = new Big(sellWage).times(getCountSell(wages, price, wholePrice)).toNumber()
  if (isNaN(res)) { return 0 }
  return res
}

export function calculateWages (wages: WageType[], orderSide: 'buy' | 'sell', value: number): number {
  let result = new Big(0)
  wages.forEach((wage) => {
    result = result.plus(calculateWage(
      orderSide === 'sell' ? wage.sellMin : wage.buyMin,
      orderSide === 'sell' ? wage.sellMax : wage.buyMax,
      orderSide === 'sell' ? wage.sellPercentage : wage.buyPercentage,
      value,
    ))
  })
  return Math.round(result.toNumber())
}

export function calculateWage (min: number, max: number, percentage: number, value: number): number {
  const calcValue = new Big(value).times(percentage).toNumber()
  if (typeof min !== 'undefined' && min !== null && calcValue < min) {
    return min
  }
  if (typeof max !== 'undefined' && max !== null && calcValue > max) {
    return max
  }
  return calcValue
}
