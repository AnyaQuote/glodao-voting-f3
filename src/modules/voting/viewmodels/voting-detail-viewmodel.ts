import { appProvider } from '@/app-providers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { observable, action } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class VotingDetailViewModel {
  @observable slug = ''
  @observable voteDetail

  constructor() {
    //
  }

  @action getUnicode(value: string) {
    this.slug = value
  }

  @asyncAction *fetchVoteDetail(codeName: string) {
    try {
      loadingController.increaseRequest()
      const res = yield appProvider.api.voting.findOne({
        unicode: this.slug,
      })
      this.voteDetail = res
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      loadingController.decreaseRequest()
    }
  }
}
