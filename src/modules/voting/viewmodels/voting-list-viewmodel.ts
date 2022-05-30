import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { apiService } from '@/services/api-service'
import { PoolStore } from '@/stores/pool-store'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class VotingListViewModel {
  @observable voteList: PoolStore[] = []
  @observable filterOption = 'bounty'

  @observable loading = false

  constructor() {
    this.fetchVotingPools()
  }

  @asyncAction *fetchVotingPools() {
    try {
      this.loading = true
      const res = yield apiService.voting.find({}, { _limit: -1 })
      this.voteList = res
      if (res && res.length) {
        this.voteList = res.map((pool: any) => {
          const poolStore = new PoolStore(pool)
          return poolStore
        })
      }
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.loading = false
    }
  }
  @computed get approvedList() {
    return this.voteList.filter((item) => item.status === 'approved')
  }

  @computed get filteredVotingList() {
    return this.votingList.filter((item) => item.type === this.filterOption)
  }

  @computed get votingList() {
    return this.voteList.filter((item) => item.onVoting)
  }

  @computed get endedList() {
    return this.voteList.filter((item) => item.voteEnded)
  }
}
