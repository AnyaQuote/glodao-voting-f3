import { blockchainHandler } from '@/blockchainHandlers'
import { IVotingContract } from '@/blockchainHandlers/ido-contract-interface'
import { Zero } from '@/constants'
import { promiseHelper } from '@/helpers/promise-helper'
import { Voter, VotingPool } from '@/models/VotingModel'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { random } from 'lodash-es'
import { action, autorun, computed, IReactionDisposer, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'
import { Subject, timer } from 'rxjs'
import { takeUntil, takeWhile } from 'rxjs/operators'

export class PoolStore {
  @observable poolData: VotingPool
  @observable participants = 0
  @observable requiredAmount = Zero
  @observable optionalAmount = Zero
  @observable votedYesPercent = Zero
  @observable votedYesWeight = Zero
  @observable votedNoPercent = Zero
  @observable votedNoWeight = Zero
  @observable completed = false
  @observable cancelled = false
  @observable approvedUsers?: Array<string>
  @observable rejectedUsers?: Array<string>

  contract?: IVotingContract

  private _diposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  constructor(pool: VotingPool) {
    this.poolData = pool
    try {
      this.contract = blockchainHandler.votingContractFactory()
      this.contract?.init()
      this.loadData()
    } catch (error) {
      console.error(error)
    }

    this._diposers = [
      autorun(async () => {
        if (
          walletStore.walletConnected
          //   &&
          //   walletStore.chainType === this.poolData.chain &&
          //   walletStore.chainId === this.poolData.chainId
        ) {
          this.contract?.injectProvider()
        }
      }),
    ]

    timer(60000, 60000).subscribe(async () => {
      await promiseHelper.delay(random(30) * 1000) // prevent cors
      this.fetchPoolInfo()
    })
  }

  @asyncAction *fetchPoolInfo() {
    const contract = this.contract
    try {
      if (contract) {
        yield contract.getPoolInfo(this.poolData.poolId)
        this.syncState()
      }
    } catch (error) {
      console.error(error)
    }
  }

  @asyncAction *loadData() {
    yield this.fetchPoolInfo()
    this.syncState()
  }

  toUnixTime(time: string) {
    return moment(time).format('X')
  }

  @action.bound syncState() {
    const contract = this.contract
    if (contract) {
      const {
        owner,
        requiredAmount,
        optionalAmount,
        poolType,
        votedYesPercent,
        votedYesWeight,
        votedNoPercent,
        votedNoWeight,
        completed,
        cancelled,
        approvedUsers,
        rejectedUsers,
      } = contract.poolInfo!
      this.votedYesPercent = votedYesPercent!
      this.votedYesWeight = votedYesWeight!
      this.votedNoPercent = votedNoPercent!
      this.votedNoWeight = votedNoWeight!
      this.completed = completed!
      this.cancelled = cancelled!
      this.requiredAmount = requiredAmount!
      this.optionalAmount = optionalAmount!
      this.approvedUsers = approvedUsers!
      this.rejectedUsers = rejectedUsers!
    }
  }

  @computed get onVoting() {
    const onVoting =
      this.poolData.status === 'voting' && moment().isBetween(moment(this.votingStart), moment(this.votingEnd))
    return onVoting
  }

  @computed get voteEnded() {
    const ended =
      this.status === 'rejected' ||
      this.status === 'approved' ||
      (this.status === 'voting' && this.votingEnd && moment().isAfter(moment(this.votingEnd)))

    return ended
  }

  @computed get id() {
    return this.poolData?.id
  }
  @computed get ownerAddress() {
    return this.poolData?.ownerAddress
  }
  @computed get poolId() {
    return this.poolData?.poolId
  }
  @computed get projectName() {
    return this.poolData?.projectName
  }
  @computed get unicodeName() {
    return this.poolData?.unicodeName
  }
  @computed get type() {
    return this.poolData.type
  }
  @computed get status() {
    return this.poolData.status
  }
  @computed get tokenAddress() {
    return this.poolData.tokenAddress
  }
  @computed get tokenName() {
    return this.poolData.tokenName
  }
  @computed get totalMission() {
    return this.poolData.totalMission
  }
  @computed get rewardPerMission() {
    try {
      return this.requiredAmount.divUnsafe(FixedNumber.from(this.totalMission))
    } catch (error) {
      return Zero
    }
  }
  @computed get startDate() {
    return this.poolData.startDate
  }
  @computed get endDate() {
    return this.poolData.endDate
  }
  @computed get projectLogo() {
    return this.poolData.data?.projectLogo
  }
  @computed get projectCover() {
    return this.poolData.data?.projectCover
  }
  @computed get shortDescription() {
    return this.poolData.data?.shortDescription
  }
  @computed get socialLinks() {
    return this.poolData.data?.socialLinks
  }
  @computed get fields() {
    return this.poolData.data?.fields
  }
  @computed get website() {
    return this.poolData.data?.socialLinks?.website
  }

  @computed get votingStart() {
    return this.poolData.votingStart
  }

  @computed get votingEnd() {
    return this.poolData.votingEnd
  }
  @computed get votedUsers(): Voter[] {
    return [
      ...(this.approvedUsers || []).map((address) => new Voter(address, 'yes')),
      ...(this.rejectedUsers || []).map((address) => new Voter(address, 'no')),
    ]
  }
}
