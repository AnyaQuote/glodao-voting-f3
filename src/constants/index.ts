import { FixedNumber } from '@ethersproject/bignumber'
export const Zero = FixedNumber.from('0')
export const HUNDRED = FixedNumber.from('100')
export const PRIORITY_AMOUNT_RATIO = FixedNumber.from('0.3')
export const ETHER_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const PAGE_ITEM_LIMIT = 6

export const URL_ENDPOINT = process.env.VUE_APP_API_STRAPI_ENDPOINT

export const NULL = null
export const EMPTY_STRING = ''
export const EMPTY_ARRAY = []
export const EMPTY_OBJECT = {}
export const ZERO_NUM = 0

export const MAX_SCREENSHOT_ACCEPTED = 5
export const MAX_IMAGE_FILE_SIZE = 1000000
export const TIME_OUT_SETTING = 10000
export const SUCCESS_STATUS = 'success'
export const WALLET_ATTACHED_SUCCESSFUL = 'attached'
export const WALLET_CONNECTED_SUCCESSFUL = 'connected'
export const TOTAL_IN_APP_TRIAL_STEP = 3
export const MAX_IN_APP_TRIAL_TASKS = 5

export const ERROR_MSG_TIMEOUT = 'Process took too long. Please try again.'
export const ERROR_MSG_LOGIN_TIMEOUT = 'Login took too long to response. Please try again.'
export const ERROR_MSG_LOGIN_TO_CONTINUE = 'Please sign in to continue to this page.'
export const ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD = 'Can not calculate average community reward'

export const ERROR_MSG_MISSING_ATTACHED_WALLET =
  'You have not attached any wallet yet. Please set your main wallet to continue.'
export const ERROR_MSG_DIFFERENT_WALLET_DETECTED =
  'Different wallet account detected. Please change back to your previous attached wallet account to continue.'
export const ERROR_MSG_NO_WALLET_CONNECTED = 'You have not connected any wallet. Please connect your wallet to continue'
export const MSG_RELOAD_AFTER_UPDATE_SUCCESS = 'Update successfully. Browser will reload soon...'
export const ERROR_MSG_FILE_EXCEED_MAX_SIZE = 'File is exceeded 1MB'
export const ERROR_MSG_FILE_IS_NOT_IMAGE = 'File is not image'
export const ERROR_MSG_FIELD_REQUIRED = 'This field is required'

export const SOCIAL_ICONS = {
  whitepaper: 'fas fa-file-alt',
  others: 'fas fa-link',
  website: 'fas fa-globe',
  reddit: 'fab fa-reddit',
  telegram: 'fab fa-telegram',
  discord: 'fab fa-discord',
  youtube: 'fab fa-youtube',
  github: 'fab fa-github',
  twitter: 'fab fa-twitter',
  facebook: 'fab fa-facebook',
}
