export interface Task {
  type?: string
  content?: string
  page?: string
  required?: boolean
  link?: string
  hashtag?: string
  embedLink?: string
}

export interface Data {
  twitter?: Task[]
  telegram?: Task[]
  quiz?: { type: string; quizId: string }[]
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
  website?: string
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
  type?: string
  missionIndex?: number
}
