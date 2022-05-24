export interface Metadata {
  shortDescription?: string
  fields?: string[]
  projectCover?: string
  projectLogo?: string
  tokenContract?: string
  additionLink?: string
  socialLinks?: any
  poolType?: string
}

export interface VotingPool {
  id?: string
  projectName?: string
  tokenAddress?: string
  rewardTokenSymbol?: string
  totalMission?: string
  ownerAddress?: string
  poolId?: string
  status?: string
  type?: string
  startDate?: string
  endDate?: string
  unicodeName?: string
  chain?: string
  chainId?: string
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
