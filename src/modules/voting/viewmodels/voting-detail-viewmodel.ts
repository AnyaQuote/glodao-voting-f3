import { appProvider } from '@/app-providers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { VotingPools } from '@/models/VotingModel'
import { observable, action, reaction, IReactionDisposer, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get, isEmpty } from 'lodash-es'
import { snackController } from '@/components/snack-bar/snack-bar-controller'

export class VotingDetailViewModel {
  @observable poolDetail?: VotingPools
  @observable votingList?: VotingPools[] = []

  constructor(unicodeName: string) {
    this.fetchAll(unicodeName)
  }

  /**
   * Fetch all data for pool detail and related voting pools
   * Go back to last page if api failed
   */
  @asyncAction *fetchAll(query: any) {
    try {
      const [poolDetail, votingList] = yield Promise.all([
        appProvider.api.voting.find({ unicode: query }, { _limit: 1 }),
        appProvider.api.voting.find({ status: 'voting' }, { _limit: -1 }),
      ])
      this.poolDetail = get(poolDetail, '[0]')
      this.votingList = votingList
    } catch (error) {
      snackController.commonError(error)
    } finally {
      //
    }
  }

  @computed get projectLogo() {
    return get(this.poolDetail, 'data.projectLogo', '')
  }

  @computed get projectCover() {
    return get(this.poolDetail, 'data.projectCover', '')
  }

  @computed get endDate() {
    return get(this.poolDetail, 'endDate', '')
  }

  @computed get projectName() {
    return get(this.poolDetail, 'projectName', '')
  }

  @computed get fields() {
    return get(this.poolDetail, 'data.fields', [])
  }

  @computed get type() {
    return get(this.poolDetail, 'type', '')
  }

  @computed get shortDescription() {
    return get(this.poolDetail, 'data.shortDescription', '')
  }

  @computed get socialLinks() {
    const arrs = get(this.poolDetail, 'data.socialLinks', [])
    return Object.keys(arrs)
      .filter((x) => x !== 'website')
      .map((key) => ({
        icon: key,
        link: get(this.poolDetail, `data.socialLinks[${key}]`, ''),
      }))
  }

  @computed get website() {
    return get(this.poolDetail, 'data.socialLinks.website', '')
  }

  @computed get walletAddress() {
    return appProvider.wallet.account
  }

  dispose() {
    this._disposers()
  }
}
