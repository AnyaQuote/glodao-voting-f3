import { FixedNumber } from '@ethersproject/bignumber'

export class PoolInfo {
  owner?: string
  requiredAmount?: FixedNumber
  optionalAmount?: FixedNumber
  requiredErc20?: string
  optionalErc20?: string
  poolType?: string
  votedYesPercent?: FixedNumber
  votedYesWeight?: FixedNumber
  votedNoPercent?: FixedNumber
  votedNoWeight?: FixedNumber
  createdAt?: string
  completed?: boolean
  cancelled?: boolean
  paused?: boolean
  approvedUsers?: Array<string>
  rejectedUsers?: Array<string>
}

export interface IVotingContract {
  address: string
  poolInfo?: PoolInfo
  init(): Promise<void>
  injectProvider(): void
  getPoolInfo(id): Promise<any>
  vote(id, result, account): Promise<any>
  getPoolType(): Promise<any>
  cancelPool(id, account): Promise<any>
  getUserStakeBalance(account): Promise<any>
  getPoolUserInfos(id, account)
}
