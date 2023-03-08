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
  optionalTokenAddress?: string
  optionalRewardAmount?: string | number
  optionalTokenName?: string
  optionalTokenLogo?: string
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
  version?: string
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

export class ProjectInfo {
  projectName?: string
  shortDescription?: string
  projectCover?: any
  projectLogo?: any
  fields?: any[]
  socialLinks?: any
  tokenBasePrice?: string
  priorityRatio?: string
  tokenName?: string
  rewardAmount?: string
  tokenAddress?: string
  maxParticipants?: string
  maxPriorityParticipants?: string

  optionalTokenName?: string
  optionalRewardAmount?: string
  optionalTokenAddress?: string
  optionalTokenLogo?: File

  votingStart?: string
  votingEnd?: string

  startDate?: string
  endDate?: string
  totalMissions?: string
}

export enum RewardDistributionType {
  BUSD = 'busd',
  TOKEN = 'token',
}
