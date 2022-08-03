import { SocialTaskComponent, SocialTaskType } from '@/models/MissionModel'
import { FixedNumber } from '@ethersproject/bignumber'
export const Zero = FixedNumber.from('0')
export const HUNDRED = FixedNumber.from('100')
export const PRIORITY_AMOUNT_RATIO = FixedNumber.from('0.3')
export const ETHER_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const PAGE_ITEM_LIMIT = 6

export const NULL = null
export const EMPTY_STRING = ''
export const EMPTY_ARRAY = []
export const EMPTY_OBJECT = {}
export const ZERO_NUM = 0

export const INPUT_MODE = 'input'
export const OUTPUT_MODE = 'output'
export const MAX_SCREENSHOT_ACCEPTED = 5
export const MAX_IMAGE_FILE_SIZE = 5000000
export const TIME_OUT_SETTING = 10000
export const SUCCESS_STATUS = 'success'
export const WALLET_ATTACHED_SUCCESSFUL = 'attached'
export const WALLET_CONNECTED_SUCCESSFUL = 'connected'
export const TOTAL_IN_APP_TRIAL_STEP = 3
export const MAX_IN_APP_TRIAL_TASKS = 5
export const PROMPT_FORM_ON_LEAVE_DIALOG_CONTENT =
  'All your changes will be lost. Are you sure you want to exit the page?'
export const PROMPT_FORM_ON_LEAVE_DIALOG_TITLE = 'Warning'
export const PROMPT_FORM_ON_LEAVE_DIALOG_DONE_TEXT = 'Confirm'
export const ALLOW_PASS_THROUGH = 'true'

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
export const ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND = 'Social setting not found'
export const ERROR_MSG_SOCIAL_SETTING_TYPE_NOT_FOUND = 'Social setting type is undefined'
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

export const FOLLOW_TASK_TYPE_DEFAULT_CONFIG = {
  type: SocialTaskType.FOLLOW,
  link: EMPTY_STRING,
  page: EMPTY_STRING,
  required: true,
}

export const COMMENT_TASK_TYPE_DEFAULT_CONFIG = {
  type: SocialTaskType.COMMENT,
  page: EMPTY_STRING,
  content: EMPTY_STRING,
  embedLink: EMPTY_STRING,
  link: EMPTY_STRING,
  required: true,
}

export const QUOTE_TASK_TYPE_DEFAULT_CONFIG = {
  type: SocialTaskType.QUOTE,
  content: EMPTY_STRING,
  page: EMPTY_STRING,
  hashtag: EMPTY_ARRAY,
  link: EMPTY_STRING,
  embedLink: EMPTY_STRING,
  required: true,
}

export const CUSTOM_TASK_TYPE_DEFAULT_CONFIG = {
  type: SocialTaskType.CUSTOM,
  requiredContent: EMPTY_STRING,
  description: EMPTY_STRING,
  link: EMPTY_STRING,
  name: EMPTY_STRING,
  icon: 'website',
  isLinkRequired: false,
}
