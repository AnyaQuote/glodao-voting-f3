import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { BN } from '@project-serum/anchor'
import moment from 'moment'

class BigNumberHelper {
  /**
   * Greater than
   */
  gt(first: FixedNumber, second: FixedNumber) {
    const diff = first.subUnsafe(second)
    return !diff.isZero() && !diff.isNegative()
  }

  gte(first, second) {
    const diff = first.subUnsafe(second)
    return !diff.isNegative()
  }

  /**
   * Less than
   */
  lt(first: FixedNumber, second: FixedNumber) {
    return first.subUnsafe(second).isNegative()
  }

  lte(first, second) {
    const diff = first.subUnsafe(second)
    return diff.isZero() || diff.isNegative()
  }

  getDecimals(decimals = 18) {
    return FixedNumber.from(BigNumber.from('10').pow(decimals).toString())
  }

  fromDecimals(amount, decimals: any = 18) {
    return FixedNumber.from(`${amount}`).divUnsafe(this.getDecimals(+decimals))
  }

  toDecimalString(fx: FixedNumber | string, decimals: any = 18) {
    fx = FixedNumber.from(fx.toString())
    const num = fx.mulUnsafe(this.getDecimals(+decimals))
    // xxx.0 => take xxx
    return num.toString().split('.')[0]
  }

  getSolDecimals(decimals = 9) {
    return this.getDecimals(decimals)
  }

  fromSolDecimals(amount, decimals = 9) {
    return this.fromDecimals(amount || '0', decimals)
  }

  toSolDecimal(fx: FixedNumber | string, decimals = 9) {
    return new BN(this.toDecimalString(fx, decimals))
  }

  toDate(num: BN | string | FixedNumber) {
    const parsedNum = +num.toString()
    // if (num instanceof BN) parsedNum = num.toNumber()
    // else if (num instanceof FixedNumber) parsedNum = num.toUnsafeFloat()
    // else if (typeof num === 'string') parsedNum = +num
    // else {
    //   console.log(num, num instanceof BN)
    // }
    return new Date(parsedNum * 1000)
  }

  toMoment(num: BN | string | FixedNumber) {
    return moment(this.toDate(num))
  }

  // toSolBN(num) {
  //   return new BN(`${num}`)
  // }
}

export const bigNumberHelper = new BigNumberHelper()
export const bnHelper = bigNumberHelper
