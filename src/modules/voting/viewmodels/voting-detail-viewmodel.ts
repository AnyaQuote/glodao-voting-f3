import { appProvider } from '@/app-providers'
import { Voter, VotingPool } from '@/models/VotingModel'
import { observable, computed, IReactionDisposer, action, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get, isEmpty, sample, sampleSize } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject, timer } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { apiService } from '@/services/api-service'
import { PoolStore } from '@/stores/pool-store'
import { PAGE_ITEM_LIMIT, Zero } from '@/constants'
import { takeUntil } from 'rxjs/operators'
import { bnHelper } from '@/helpers/bignumber-helper'
import { snackController } from '@/components/snack-bar/snack-bar-controller'

export class VotingDetailViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable voting = false
  @observable voted = false

  @observable votingList: VotingPool[] = []
  @observable stakeFee = Zero
  @observable userStakeBalance = Zero
  @observable dataLoading = false

  @observable voteDialog = false

  @observable poolStore?: PoolStore

  @observable votedUserPage = 1

  constructor(unicodeName: string) {
    this.loadData(unicodeName)

    this._disposers = [
      reaction(
        () => walletStore.account,
        () => {
          this.loadData(unicodeName)
          if (walletStore.account) this.getPoolUserInfos()
        }
      ),
    ]
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
    this.poolStore = new PoolStore(poolStore[0])
    // Sample voting list without current pool detail
    this.votingList = sampleSize(
      votingList.filter((item) => item.id !== poolStore[0].id),
      4
    )
  }

  @asyncAction *loadData(unicodeName) {
    this.dataLoading = true
    try {
      yield this.fetchPoolDetail(unicodeName)

      this.getStakeFee()
      this.getUserStakedBalance()

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

  @asyncAction *getPoolUserInfos() {
    const { voted } = yield this.poolStore?.contract?.getPoolUserInfos(0, walletStore.account)
    this.voted = voted
  }

  @asyncAction *getStakeFee() {
    const poolType = yield this.poolStore?.contract?.getPoolType()
    this.stakeFee = poolType.stakeFee
  }

  @asyncAction *getUserStakedBalance() {
    if (walletStore.account) {
      const userStakeBalance = yield this.poolStore?.contract!.getUserStakeBalance(walletStore.account)
      this.userStakeBalance = userStakeBalance
    }
  }

  @asyncAction *vote(result) {
    this.voting = true
    try {
      const { completed } = yield this.poolStore?.contract!.vote(this.poolStore!.poolId, result, walletStore.account)
      this.voted = true
      this.poolStore?.fetchPoolInfo()

      if (completed) {
        // api update status to approved
        yield apiService.updateStatusToApproved({ id: this.poolStore!.id, poolId: this.poolStore!.poolId })
      }

      snackController.success('Vote successfully')
      this.voteDialog = false
    } catch (error) {
      console.error(error)
      snackController.commonError(error)
    } finally {
      this.voting = false
    }
  }

  @action.bound changeVoteDialog(val) {
    this.voteDialog = val
  }

  @computed get socialLinks() {
    return Object.entries(get(this.poolStore, 'socialLinks', []))
  }

  @computed get stakeBalanceInsufficient() {
    return bnHelper.lt(this.userStakeBalance, this.stakeFee)
  }

  // ===== USER VOTED PAGINATION START =====
  @action.bound changeVotedUserPage(value: number) {
    this.votedUserPage = value
  }

  @computed get votedUserTotalPage() {
    return Math.ceil((this.poolStore?.votedUsers || []).length / PAGE_ITEM_LIMIT)
  }

  @computed get votedUserPagingList(): Voter[] {
    return (this.poolStore?.votedUsers || []).slice(
      (this.votedUserPage - 1) * PAGE_ITEM_LIMIT,
      this.votedUserPage * PAGE_ITEM_LIMIT
    )
  }
  // ====== USER VOTED PAGINATION END ======
}
