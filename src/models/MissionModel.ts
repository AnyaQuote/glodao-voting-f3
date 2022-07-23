import { VotingPool } from './VotingModel'

export interface Task {
  type?: string
  content?: string
  page?: string
  required?: boolean
  link?: string
  hashtag?: string
  embedLink?: string
}

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
  appDescription?: string
}

export interface InAppTrialTask {
  context?: string
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
  | 'appDescription'

export enum MissionType {
  LEARN = 'learn',
  SOCIAL = 'bounty',
  APP_TRIAL = 'iat',
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
