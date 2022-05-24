import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { VotingPool } from '@/models/VotingModel'
import { apiService } from '@/services/api-service'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class VotingListViewModel {
  @observable voteList: VotingPool[] = []
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
      this.loading = false
    } catch (error) {
      snackController.commonError(error)
    } finally {
      //
    }
  }
  @computed get approvedList() {
    return this.voteList.filter((item) => item.status === 'approved')
  }

  @computed get filteredVotingList() {
    return this.votingList.filter((item) => item.type === this.filterOption)
  }

  @computed get votingList() {
    return this.voteList.filter((item) => item.status === 'voting')
  }

  @computed get endedList() {
    return this.voteList.filter((item) => item.status === 'rejected' || item.status === 'approved')
  }
}
