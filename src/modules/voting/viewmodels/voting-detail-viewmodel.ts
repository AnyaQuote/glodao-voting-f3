import { appProvider } from '@/app-providers'
import { Voter, VotingPool } from '@/models/VotingModel'
import { observable, computed, IReactionDisposer, action, reaction } from 'mobx'
import { actionAsync, asyncAction } from 'mobx-utils'
import { get, isEmpty } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject, timer } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { apiService } from '@/services/api-service'
import { PoolStore } from '@/stores/pool-store'
import { Zero } from '@/constants'
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

  @observable votedUserPagingList: Voter[] = []
  @observable votedUserPage = {
    limit: 6,
    current: 0,
    total: 0,
  }

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

  /**
   * Assign current page value and calculate total page if it is empty
   * Initalize userVotedPagingList from current page and votedUsers list
   * @param value Can be a number represents page index or command 'next | prev' to decrease or increase current page
   */
  @action.bound handleVotedUserPaging(value: number) {
    this.votedUserPage.current = value
    if (!this.votedUserPage.total) {
      this.votedUserPage.total = Math.ceil(this.votedUsers.length / this.votedUserPage.limit)
    }

    if (this.votedUsers.length) {
      this.votedUserPagingList = this.votedUsers.slice(
        (this.votedUserPage.current - 1) * this.votedUserPage.limit,
        this.votedUserPage.current * this.votedUserPage.limit
      )
    }
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
    return Object.entries(get(this.poolStore, 'socialLinks', [])).filter((item) => item[0] !== 'website')
  }

  @computed get stakeBalanceInsufficient() {
    return bnHelper.lt(this.userStakeBalance, this.stakeFee)
  }

  @computed get votedUsers(): Voter[] {
    const users = [
      ...(this.poolStore?.approvedUsers || []).map((address) => ({
        address: address,
        voted: 'yes',
      })),
      ...(this.poolStore?.rejectedUsers || []).map((address) => ({
        address: address,
        voted: 'no',
      })),
    ]
    return users
  }
}
