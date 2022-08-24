import {
  COMMENT_TASK_TYPE_DEFAULT_CONFIG,
  CUSTOM_TASK_TYPE_DEFAULT_CONFIG,
  DISCORD_JOIN_TASK_TYPE_DEFAULT_CONFIG,
  ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND,
  ERROR_MSG_SOCIAL_SETTING_TYPE_NOT_FOUND,
  FOLLOW_TASK_TYPE_DEFAULT_CONFIG,
  LIKE_TASK_TYPE_DEFAULT_CONFIG,
  QUOTE_TASK_TYPE_DEFAULT_CONFIG,
} from '@/constants'
import { SocialTaskComponent, SocialTaskType, SocialType, TaskConfig } from '@/models/MissionModel'
import { isEmpty } from 'lodash'
import { config } from 'vue/types/umd'

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
        return {
          setting: FOLLOW_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.JOIN_TELEGRAM,
          key,
        }
      case SocialTaskType.COMMENT:
        return {
          setting: COMMENT_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.CHAT_TELEGRAM,
          key,
        }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else if (social === SocialType.TWITTER) {
    switch (type) {
      case SocialTaskType.FOLLOW:
        return {
          setting: FOLLOW_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.FOLLOW_TWITTER,
          key,
        }
      case SocialTaskType.LIKE:
        return {
          setting: LIKE_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.LIKE_TWITTER,
          key,
        }
      case SocialTaskType.COMMENT:
        return {
          setting: COMMENT_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.COMMENT_TWITTER,
          key,
        }
      case SocialTaskType.QUOTE:
        return {
          setting: QUOTE_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.QUOTE_TWITTER,
          key,
        }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else if (social === SocialType.DISCORD) {
    switch (type) {
      case SocialTaskType.JOIN_SERVER:
        return {
          setting: DISCORD_JOIN_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.JOIN_DISCORD,
          key,
        }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else if (social === SocialType.FACEBOOK) {
    switch (type) {
      case SocialTaskType.FOLLOW:
        return {
          setting: FOLLOW_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.FOLLOW_FACEBOOK,
          key,
        }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else if (social === SocialType.CUSTOM) {
    switch (type) {
      case SocialTaskType.CUSTOM:
        return {
          setting: CUSTOM_TASK_TYPE_DEFAULT_CONFIG,
          component: SocialTaskComponent.CUSTOM_TASK,
          key,
        }
      default:
        throw Error(ERROR_MSG_SOCIAL_SETTING_DATA_NOT_FOUND)
    }
  } else {
    throw Error(ERROR_MSG_SOCIAL_SETTING_TYPE_NOT_FOUND)
  }
}

export const extractTaskSettings = (configs: TaskConfig[]) => {
  return configs.map((c) => ({ ...c.setting }))
}
