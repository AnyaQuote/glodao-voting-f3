export interface Metadata {
  shortDescription?: string
  fields?: string[]
  projectCover?: string
  projectLogo?: string
  socialLinks?: any
  poolType?: string
  decimals?: number
}

export interface VotingPool {
  id?: string
  projectName?: string
  tokenAddress?: string
  tokenName?: string
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
  rewardAmount?: string
  votingStart?: string
  votingEnd?: string
  data?: Metadata
}

export interface Voter {
  voted?: string
  address?: string
}
