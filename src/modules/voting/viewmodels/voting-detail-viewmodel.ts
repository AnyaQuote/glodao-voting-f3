import { appProvider } from '@/app-providers'
import { VotingPool } from '@/models/VotingModel'
import { observable, computed, IReactionDisposer, when, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get, isEmpty } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject, timer } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { apiService } from '@/services/api-service'
import { PoolStore } from '@/stores/pool-store'
import { Zero } from '@/constants'
import { takeUntil } from 'rxjs/operators'
import { bnHelper } from '@/helpers/bignumber-helper'

export class VotingDetailViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable voting = false
  @observable voted = false

  @observable votingList: VotingPool[] = []
  @observable stakeFee = Zero
  @observable userStakeBalance = Zero
  @observable dataLoading = false
  @observable votedUsers = []

  @observable poolStore?: PoolStore

  constructor(unicodeName: string) {
    this.loadData(unicodeName)
    this._disposers.push(
      reaction(
        () => walletStore.account,
        () => {
          this.loadData(unicodeName)
        }
      )
    )
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  @asyncAction *fetchPoolDetail(unicodeName) {
    const [poolStore, votingList] = yield Promise.all([
      appProvider.api.voting.find({ unicodeName }, { _limit: 1 }),
      appProvider.api.voting.find({ status: 'voting' }, { _limit: -1 }),
    ])
    if (isEmpty(poolStore)) {
      appProvider.router.push(RoutePaths.not_found)
    }
    this.votingList = votingList
    this.poolStore = new PoolStore(get(poolStore, '[0]'))
  }

  @asyncAction *loadData(unicodeName) {
    this.dataLoading = true
    try {
      yield this.fetchPoolDetail(unicodeName)

      this.getStakeFee()
      this.checkUserVotedPool()
      this.getUserStakedBalance()
      this.getVotedUsers()

      timer(0, 10000)
        .pipe(takeUntil(this._unsubcrible))
        .subscribe(async () => {
          this.poolStore?.fetchPoolInfo()
        })
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.dataLoading = false
    }
  }

  @asyncAction *getStakeFee() {
    const poolType = yield this.poolStore?.contract?.getPoolType()
    this.stakeFee = poolType.stakeFee
  }

  @asyncAction *checkUserVotedPool() {
    if (walletStore.account && this.poolStore?.contract) {
      const voted = yield this.poolStore.contract!.checkUserVotedPool(walletStore.account, this.poolStore.poolId)
      this.voted = voted
    }
  }

  @asyncAction *getUserStakedBalance() {
    if (walletStore.account) {
      const userStakeBalance = yield this.poolStore?.contract!.getUserStakeBalance(walletStore.account)
      this.userStakeBalance = userStakeBalance
    }
  }

  @asyncAction *getVotedUsers() {
    const users = yield this.poolStore?.contract?.getVotedUsers(this.poolStore.poolId)
    this.votedUsers = users
  }

  async vote() {
    const { completed } = await this.poolStore?.contract!.vote(this.poolStore!.poolId, walletStore.account)
    this.voted = true
    this.getVotedUsers()
    this.poolStore?.fetchPoolInfo()

    if (completed) {
      try {
        // api update status to approved
        await apiService.updateStatusToApproved({ id: this.poolStore!.id, poolId: this.poolStore!.poolId })
      } catch (error) {
        console.error(error)
      }
    }
  }

  @computed get socialLinks() {
    const arrs = get(this.poolStore, 'data.socialLinks', [])
    return Object.keys(arrs)
      .filter((x) => x !== 'website')
      .map((key) => ({
        icon: key,
        link: get(this.poolStore, `data.socialLinks[${key}]`, ''),
      }))
  }

  @computed get stakeBalanceInsufficient() {
    return bnHelper.lt(this.userStakeBalance, this.stakeFee)
  }
}
