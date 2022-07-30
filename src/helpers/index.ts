import {
  COMMENT_TASK_TYPE_DEFAULT_CONFIG,
  CUSTOM_TASK_TYPE_DEFAULT_CONFIG,
  ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND,
  ERROR_MSG_SOCIAL_SETTING_TYPE_NOT_FOUND,
  FOLLOW_TASK_TYPE_DEFAULT_CONFIG,
  QUOTE_TASK_TYPE_DEFAULT_CONFIG,
} from '@/constants'
import { SocialTaskType, SocialType } from '@/models/MissionModel'
import { isEmpty } from 'lodash'

export const generateRandomString = (
  length = 6,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
) => {
  return Array.from(self.crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('')
}

export const formatFileSize = (bytes: number, decimalPoint = 2) => {
  if (bytes == 0) return '0 Bytes'
  const k = 1000
  const dm = decimalPoint
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const isNotEmpty = (value) => isEmpty(value)

export const getDefaultSettingConfig = (social: string, type: string, key: number) => {
  if (social === SocialType.TELEGRAM) {
    switch (type) {
      case SocialTaskType.FOLLOW:
        return { ...FOLLOW_TASK_TYPE_DEFAULT_CONFIG, key }
      case SocialTaskType.COMMENT:
        return { ...COMMENT_TASK_TYPE_DEFAULT_CONFIG, key }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else if (social === SocialType.TWITTER) {
    switch (type) {
      case SocialTaskType.FOLLOW:
        return { ...FOLLOW_TASK_TYPE_DEFAULT_CONFIG, key }
      case SocialTaskType.COMMENT:
        return { ...COMMENT_TASK_TYPE_DEFAULT_CONFIG, key }
      case SocialTaskType.QUOTE:
        return { ...QUOTE_TASK_TYPE_DEFAULT_CONFIG, key }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else if (social === SocialType.FACEBOOK) {
    switch (type) {
      case SocialTaskType.FOLLOW:
        return { ...FOLLOW_TASK_TYPE_DEFAULT_CONFIG, key }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else if (social === SocialType.CUSTOM) {
    switch (type) {
      case SocialTaskType.CUSTOM:
        return { ...CUSTOM_TASK_TYPE_DEFAULT_CONFIG, key }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else {
    throw Error(ERROR_MSG_SOCIAL_SETTING_TYPE_NOT_FOUND)
  }
}
