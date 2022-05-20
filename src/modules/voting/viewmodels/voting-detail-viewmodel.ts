import { appProvider } from '@/app-providers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { VotingPools } from '@/models/VotingModel'
import { observable, action, reaction, IReactionDisposer, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get, isEmpty } from 'lodash-es'
import { snackController } from '@/components/snack-bar/snack-bar-controller'

export class VotingDetailViewModel {
  @observable unicode = ''
  @observable poolDetail?: VotingPools
  @observable votingList?: VotingPools[] = []

  _disposers: IReactionDisposer

  constructor() {
    this._disposers = reaction(
      () => this.unicode,
      () => {
        this.fetchAll()
      }
    )
  }

  @action getUnicode(value: string) {
    this.unicode = value
  }

  /**
   * Fetch all data for pool detail and related voting pools
   * Go back to last page if api failed
   */
  @asyncAction *fetchAll() {
    try {
      loadingController.increaseRequest()
      const res = yield Promise.all([
        appProvider.api.voting.find({ unicode: this.unicode }),
        appProvider.api.voting.find({ status: 'voting' }),
      ])
      this.poolDetail = get(res, '[0][0]')
      this.votingList = get(res, '[1]')
    } catch (error) {
      snackController.commonError(error)
      appProvider.router.go(-1)
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @computed get projectLogo() {
    return this.poolDetail?.data.projectLogo
  }

  @computed get projectCover() {
    return this.poolDetail?.data.projectCover
  }

  @computed get endDate() {
    return this.poolDetail?.endDate
  }

  @computed get projectName() {
    return this.poolDetail?.projectName
  }

  @computed get fields() {
    return get(this.poolDetail, 'data.fields', [])
  }

  @computed get type() {
    return this.poolDetail?.type
  }

  @computed get shortDescription() {
    return this.poolDetail?.data.shortDescription
  }

  @computed get socialLinks() {
    const arrs = get(this.poolDetail, 'data.socialLinks', [])
    return Object.keys(arrs)
      .filter((x) => x !== 'website')
      .map((key) => ({
        icon: key,
        link: this.poolDetail?.data.socialLinks[key],
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
