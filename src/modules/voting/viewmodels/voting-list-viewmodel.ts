import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { PAGE_ITEM_LIMIT } from '@/constants'
import { apiService } from '@/services/api-service'
import { PoolStore } from '@/stores/pool-store'
import { isEmpty } from 'lodash-es'
import { action, computed, IReactionDisposer, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class VotingListViewModel {
  @observable voteList: PoolStore[] = []
  @observable lastedEndedPools: PoolStore[] = []
  @observable filterOption = 'bounty'
  @observable endedFilterOption = 'bounty'

  @observable loading = false

  // ENDED LIST PAGING OBSERVABLES
  @observable showEndedList = false
  @observable isPaging = false
  @observable currentEndedPoolPage = 1
  @observable totalEndedPoolPage = 0
  @observable endedPoolPagingList: PoolStore[] = []
  // ==============================

  _disposer: IReactionDisposer[] = []
  constructor() {
    this.fetchVotingPools()
    this._disposer = [
      reaction(
        () => this.currentEndedPoolPage,
        () => this.fetchEndedVotingPools(),
        { fireImmediately: true }
      ),
      reaction(
        () => this.endedFilterOption,
        () => {
          this.changeEndedCurrentPage(1)
          this.fetchEndedVotingPools()
        }
      ),
    ]
  }

  destroy() {
    this._disposer.forEach((d) => d())
  }

  @asyncAction *fetchVotingPools() {
    try {
      this.loading = true
      const endedStatus = [{ status: 'approved' }, { status: 'rejected' }]
      const [voteList, lastestEndedList] = yield Promise.all([
        apiService.voting.find({ status: 'voting' }, { _limit: -1 }),
        apiService.voting.find({ _where: { _or: endedStatus } }, { _limit: 3, _sort: 'votingEnd:DESC' }),
      ])
      !isEmpty(voteList) && (this.voteList = voteList.map((pool: any) => new PoolStore(pool)))
      !isEmpty(lastestEndedList) && (this.lastedEndedPools = lastestEndedList.map((pool) => new PoolStore(pool)))
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.loading = false
    }
  }

  // ======================================= ENDED LIST PAGINATION ==========================================
  @asyncAction *fetchEndedVotingPools() {
    try {
      this.isPaging = true
      const endedStatus = [{ status: 'approved' }, { status: 'rejected' }]
      const pagingConfig = {
        _limit: PAGE_ITEM_LIMIT,
        _sort: 'votingEnd:DESC',
        _start: (this.currentEndedPoolPage - 1) * PAGE_ITEM_LIMIT,
      }
      const [pagingResult, totalItems] = yield Promise.all([
        // Get list by pagination
        apiService.voting.find({ _where: [{ type: this.endedFilterOption }, { _or: endedStatus }] }, pagingConfig),
        // Get total list item
        apiService.voting.count({
          _where: [{ type: this.endedFilterOption }, { _or: endedStatus }],
        }),
      ])
      // Map VotingPool through PoolStore to retrieve contract information
      this.endedPoolPagingList = pagingResult.map((item) => new PoolStore(item))
      this.totalEndedPoolPage = Math.floor(Math.round(totalItems / PAGE_ITEM_LIMIT))
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.isPaging = false
    }
  }

  @action.bound toggleEndedList() {
    this.showEndedList = true
  }

  @action.bound changeEndedCurrentPage(value: number) {
    this.currentEndedPoolPage = value
  }

  @action.bound changeEndedFilterOption(value: string) {
    this.endedFilterOption = value
  }
  // =========================================================================================================

  @computed get approvedList() {
    return this.voteList.filter((item) => item.status === 'approved')
  }

  @computed get filteredVotingList() {
    return this.votingList.filter((item) => item.type === this.filterOption)
  }

  @computed get votingList() {
    return this.voteList.filter((item) => item.onVoting)
  }
}
