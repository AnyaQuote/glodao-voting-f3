export interface Metadata {
  shortDescription?: string
  fields?: string[]
  projectCover?: string
  projectLogo?: string
  tokenContract?: string
  additionLink?: string
  chainID?: string
  socialLinks?: any
  poolType?: string
}

export interface VotingPools {
  id?: string
  projectName?: string
  tokenAddress?: string
  ownerAddress?: string
  poolId?: string
  status?: string
  type?: string
  startDate?: string
  endDate?: string
  unicodeName?: string
  data?: Metadata
}

export interface Mission {
  name?: string
  image?: string
  totalReward?: string
  priorityReward?: string
  start?: string
  end?: string
}
