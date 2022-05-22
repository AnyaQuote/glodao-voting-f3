export interface Metadata {
  shortDescription?: string
  fields?: string[]
  projectCover?: string
  projectLogo?: string
  tokenContract?: string
  additionLink?: string
  chainID?: string
  socialLinks?: any
}

export interface VotingPools {
  projectName?: string
  rewardAddress?: string
  ownerAddress?: string
  data?: Metadata
  projectId?: string
  status?: string
  type?: string
  startDate?: string
  endDate?: string
  unicode?: string
}

export interface Mission {
  name?: string
  image?: string
  totalReward?: string
  priorityReward?: string
  start?: string
  end?: string
}
