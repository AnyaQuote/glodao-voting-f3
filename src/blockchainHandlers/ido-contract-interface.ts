import { FixedNumber } from '@ethersproject/bignumber'

export class PoolInfo {
  owner?: string
  amount?: FixedNumber
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
  checkUserVotedPool(account, poolId)
  getVotedUsers(poolId)
}
