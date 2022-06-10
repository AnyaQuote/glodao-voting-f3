import { FixedNumber } from '@ethersproject/bignumber'
export const Zero = FixedNumber.from('0')
export const HUNDRED = FixedNumber.from('100')
export const ETHER_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const URL_ENDPOINT = process.env.VUE_APP_API_STRAPI_ENDPOINT

export const TIME_OUT_SETTING = 10000
export const SUCCESS_STATUS = 'success'

export const ERROR_MSG_TIMEOUT = 'Process took too long. Please try again.'
export const ERROR_MSG_LOGIN_TIMEOUT = 'Login took too long to response. Please try again.'
export const ERROR_MSG_LOGIN_TO_CONTINUE = 'Please sign in to continue to this page.'
