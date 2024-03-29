import { VotingPool } from './VotingModel'

export interface IatData {
  code?: string
  context?: string
  required?: boolean
}

export interface Data {
  twitter?: Task[]
  telegram?: Task[]
  quiz?: { type: string; quizId: string }[]
  iat?: IatData[]
}

export interface MetaData {
  shortDescription?: string
  decimals?: number
  projectLogo?: string
  tokenLogo?: string
  coverImage?: string
  caption?: string
  rewardToken?: string
  socialLinks?: any
  tokenContractAddress?: string
  website?: string
  screenshots?: string[]
  appStoreUrl?: string
  googlePlayUrl?: string
  webUrl?: string
  taskDescription?: string
}

export interface Mission {
  id?: string
  ownerAddress?: string
  poolId?: string
  name?: string
  status?: string
  chainId?: string
  startTime?: string
  endTime?: string
  maxParticipants?: number
  totalParticipants?: number
  maxPriorityParticipants?: number
  completedParticipants?: number
  tokenBasePrice?: string
  rewardAmount?: string
  priorityRewardAmount?: string
  data?: Data
  metadata?: MetaData
  type?: MissionType
  missionIndex?: number
  votingPool?: VotingPool
  // Id only
  projectOwner?: string
  //
  optionalTokens?: OptionalTokenItem[]
  priorityRatio?: number
  transactions?: any
}

export interface InAppTrialInfo {
  screenShots?: File[] | null
  tasks?: InAppTrialTask[]
  missionReward?: string
  maxParticipants?: string
  startDate?: string
  endDate?: string
  appTitle?: string
  appLogo?: File | null
  appStoreLink?: string
  chPlayLink?: string
  webAppLink?: string
  appDescription?: string
  taskDescription?: string
  tokenBasePrice?: string
}

export interface InAppTrialTask {
  context?: string
  code?: string
}

export type IatInfoProp =
  | 'screenShots'
  | 'tasks'
  | 'missionReward'
  | 'maxParticipants'
  | 'startDate'
  | 'endDate'
  | 'appTitle'
  | 'appLogo'
  | 'appStoreLink'
  | 'chPlayLink'
  | 'webAppLink'
  | 'appDescription'
  | 'taskDescription'
  | 'tokenBasePrice'
  | 'missionDates'

export enum MissionType {
  LEARN = 'learn',
  SOCIAL = 'bounty',
  APP_TRIAL = 'iat',
  MIX = 'mix',
}

export interface DisplayIatData extends IatData {
  apiURL?: string
  step?: number
}

export interface OptionalTokenItem {
  rewardToken?: string
  tokenBasePrice?: string
  tokenLogo?: string
  rewardAmount?: number | string
  priorityRewardAmount?: number | string
  tokenContractAddress?: string | number
  decimal?: string | number
}
export enum SocialType {
  TELEGRAM = 'telegram',
  TWITTER = 'twitter',
  DISCORD = 'discord',
  FACEBOOK = 'facebook',
  CUSTOM = 'custom',
}

export enum SocialTaskType {
  FOLLOW = 'follow',
  JOIN_SERVER = 'join-server',
  COMMENT = 'comment',
  QUOTE = 'quote',
  CUSTOM = 'custom',
  LIKE = 'like',
  RETWEET = 'retweet',
}

export enum SocialTaskComponent {
  JOIN_TELEGRAM = 'telegram-join-task',
  CHAT_TELEGRAM = 'telegram-chat-task',
  FOLLOW_TWITTER = 'twitter-follow-task',
  QUOTE_TWITTER = 'twitter-quote-task',
  COMMENT_TWITTER = 'twitter-comment-task',
  LIKE_TWITTER = 'twitter-like-task',
  JOIN_DISCORD = 'discord-join-task',
  FOLLOW_FACEBOOK = 'facebook-follow-task',
  CUSTOM_TASK = 'custom-task',
  RETWEET_TWITTER = 'twitter-retweet-task',
}

export interface TaskConfig {
  key?: number
  component?: SocialTaskComponent
  setting?: Task
}

export interface Task {
  id?: number
  type?: SocialTaskType
  name?: string
  content?: string
  description?: string
  page?: string
  required?: boolean
  requiredContent?: string
  link?: string
  isLinkRequired?: boolean
  hashtag?: string
  embedLink?: string
  guildId?: string
}
