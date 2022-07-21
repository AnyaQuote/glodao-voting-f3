import { FixedNumber } from '@ethersproject/bignumber'

export interface TokenPriceModel {
  name: string
  symbol: string
  price: FixedNumber
  price_BNB: string
}
