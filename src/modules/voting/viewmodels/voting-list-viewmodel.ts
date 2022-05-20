import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { VotingPools } from '@/models/VotingModel'
import { apiService } from '@/services/api-service'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class VotingListViewModel {
  @observable voteList: VotingPools[] = [];

  @asyncAction *fetchVotingPools() {
    try {
      const res = yield apiService.voting.find()
      this.voteList = res
    } catch (error) {
      snackController.commonError(error)
    }
  }

  @computed get approvedList() {
    return this.voteList.filter((item) => item.status === 'approved')
  }

  @computed get votingList() {
    return this.voteList.filter((item) => item.status === 'voting')
  }

  @computed get endedList() {
    return this.voteList.filter((item) => item.status === 'rejected' || item.status === 'approved')
  }
}
