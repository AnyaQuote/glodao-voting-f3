import { FixedNumber } from '@ethersproject/bignumber'

export class PoolInfo {
  owner?: string
  requiredAmount?: FixedNumber
  optionalAmount?: FixedNumber
  requiredErc20?: string
  optionalErc20?: string
  poolType?: string
  votedWeight?: FixedNumber
  votedPercent?: FixedNumber
  createdAt?: string
  completed?: boolean
  cancelled?: boolean
  paused?: boolean
}

export interface IVotingContract {
  address: string
  poolInfo?: PoolInfo
  init(): Promise<void>
  injectProvider(): void
  getPoolInfo(id): Promise<any>
  vote(id, account): Promise<any>
  getPoolType(): Promise<any>
  cancelPool(id, account): Promise<any>
  getUserStakeBalance(account): Promise<any>
}
