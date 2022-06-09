import { FixedNumber } from '@ethersproject/bignumber'
export const Zero = FixedNumber.from('0')
export const HUNDRED = FixedNumber.from('100')
export const ETHER_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const URL_ENDPOINT = process.env.VUE_APP_API_STRAPI_ENDPOINT
