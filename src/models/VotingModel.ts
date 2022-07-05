import { ProjectOwner } from './ProjectOwnerModel'

export interface Metadata {
  shortDescription?: string
  fields?: string[]
  projectCover?: string
  projectLogo?: string
  socialLinks?: any
  poolType?: string
  decimals?: number
  optionalRewardTokenDecimals?: string | number
  optionalTokenAddress?: string | number
  optionalRewardAmount?: string | number
  optionalTokenName?: string | number
}

export interface VotingPool {
  id?: string
  projectName?: string
  tokenAddress?: string
  tokenName?: string
  totalMission?: string
  ownerAddress?: string
  poolId?: string
  status?: VotingPoolStatus
  type?: VotingPoolType
  startDate?: string
  endDate?: string
  unicodeName?: string
  chain?: string
  chainId?: string
  rewardAmount?: string
  votingStart?: string
  votingEnd?: string
  data?: Metadata
  projectOwner?: ProjectOwner
}

export class Voter {
  voted?: string
  address?: string
  time?: string

  constructor(address: string, voted: string, time = '--') {
    this.address = address
    this.voted = voted
    this.time = time
  }
}

export enum VotingPoolStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  VOTING = 'voting',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum VotingPoolType {
  BOUNTY = 'bounty',
  LAUNCHPAD = 'launchpad',
}
