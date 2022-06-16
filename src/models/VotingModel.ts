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

export class Voter {
  voted?: string
  address?: string
  time?: string

  constructor(address: string, voted: string, time: string) {
    this.address = address
    this.voted = voted
    this.time = time
  }
}
