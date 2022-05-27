import { appProvider } from '@/app-providers'
import { VotingPool } from '@/models/VotingModel'
import { observable, computed, action, IReactionDisposer, reaction, toJS } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { clone, get, isEmpty, kebabCase, set } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { PoolStore } from '@/stores/pool-store'
import { Mission } from '@/models/MissionModel'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import moment from 'moment'

export class ProjectDetailViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable poolStore?: PoolStore
  @observable missions: Mission[] = []
  @observable loading = false

  // Cancel dialog
  @observable cancelDialog = false
  @observable cancelling = false

  // Withdraw dialog
  @observable withdrawDialog = false

  @observable poolInfo: any = {}

  constructor(unicodeName: string) {
    this._disposers = [
      reaction(
        () => walletStore.account,
        (account) => {
          if (!isEmpty(account)) {
            this.fetchProjectDetail({ unicodeName, ownerAddress: account })
          }
        },
        { fireImmediately: true }
      ),
    ]
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  @asyncAction *fetchProjectDetail(query: { unicodeName: string; ownerAddress: string }) {
    try {
      let res
      this.loading = true
      res = yield appProvider.api.voting.find(query, { _limit: 1 })
      if (isEmpty(res)) {
        appProvider.router.replace(RoutePaths.not_found)
      }
      const votingPool = get(res, '[0]')
      this.poolStore = new PoolStore(votingPool)

      if (votingPool.status === 'approved') {
        res = yield appProvider.api.tasks.find({ poolId: votingPool.id }, { _limit: -1 })
        this.missions = res || []
      }
    } catch (error) {
      console.log(error)
      appProvider.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @asyncAction *cancelAndWithdraw() {
    let cancelled = false
    const contract = this.poolStore?.contract
    if (!contract) {
      appProvider.snackbar.commonError('Contract not valid')
      return
    }

    this.cancelling = true
    try {
      yield contract.cancelPool(this.poolStore?.poolId, walletStore.account)
      contract.getPoolInfo(this.poolStore?.poolId)
      cancelled = true
    } catch (error) {
      appProvider.snackbar.commonError(error)
    }
    if (cancelled) {
      try {
        yield apiService.cancelVotingPool({
          id: this.poolStore!.id,
          poolId: this.poolStore!.poolId,
          ownerAddress: this.poolStore!.ownerAddress,
        })

        appProvider.snackbar.success('Cancel successfully')
        this.changeCancelDialog(false)
      } catch (error) {
        console.error(error)
      }
    }

    this.cancelling = false
  }

  @action.bound changeCancelDialog(val: boolean) {
    this.cancelDialog = val
  }

  @action.bound changeWithdrawDialog(val: boolean) {
    this.withdrawDialog = val
  }

  @computed get poolCancelled() {
    return this.poolStore?.cancelled
  }

  @computed get poolRejected() {
    return false
  }

  @computed get projectCover() {
    return get(this.poolStore?.poolData, 'data.projectCover', '')
  }

  /**
   * Update project
   */

  //Update pool project dialog
  @observable projectNameTemp: string | undefined = ''
  @observable shortDescriptionTemp: string | undefined = ''
  @observable fieldsTemp: string[] | undefined = []
  @observable socialLinksTemp = {}
  @observable projectCoverTemp: any = ''
  @observable projectLogoTemp: any = ''

  @observable saving = false

  @action setDefaultValue() {
    this.projectNameTemp = this.poolStore?.projectName
    this.shortDescriptionTemp = this.poolStore?.shortDescription
    this.fieldsTemp = this.poolStore?.fields
    this.socialLinksTemp = this.poolStore?.socialLinks
    this.projectCoverTemp = this.poolStore?.projectCover
    this.projectLogoTemp = this.poolStore?.projectLogo
  }

  @action.bound onProjectNameChange(value: string): void {
    this.projectNameTemp = value
  }

  @action.bound onShortDescriptionChange(value: string): void {
    this.shortDescriptionTemp = value
  }

  @action.bound onProjectLogoChange(value: File): void {
    this.projectLogoTemp = value
  }

  @action.bound onProjectCoverChange(value: File): void {
    this.projectCoverTemp = value
  }

  @action onFieldChange(value: string[]): void {
    this.fieldsTemp = value
  }

  @action.bound onSocialLinkChange(key: string, value: string): void {
    this.socialLinksTemp[key] = value
  }

  @asyncAction *save() {
    try {
      this.saving = true
      const media = new FormData()

      let cover = false
      let logo = false

      if (this.projectLogoTemp && typeof this.projectLogoTemp !== 'string') {
        media.append('files', this.projectLogoTemp)
        logo = true
      }

      if (this.projectCoverTemp && typeof this.projectCoverTemp !== 'string') {
        media.append('files', this.projectCoverTemp)
        cover = true
      }

      let images
      if (media.getAll('files').length) {
        images = yield apiService.uploadFile(media)
        if (logo && cover) {
          this.projectLogoTemp = getApiFileUrl(images[0])
          this.projectCoverTemp = getApiFileUrl(images[1])
        } else {
          if (logo) {
            this.projectLogoTemp = getApiFileUrl(images[0])
          } else {
            this.projectCoverTemp = getApiFileUrl(images[0])
          }
        }
      }

      const poolData = this.poolStore!.poolData!
      const projectName = this.projectNameTemp?.trim()
      let unicodeName = kebabCase(projectName)
      // check duplicate unicodeName
      const pools = yield apiService.voting.find({
        unicodeName,
        _limit: 1,
      })
      if (pools && pools.length > 0) {
        unicodeName = unicodeName + moment().unix().toString()
      }

      const model = {
        id: this.poolStore?.id,
        projectName,
        ownerAddress: this.poolStore!.ownerAddress,
        unicodeName,
        data: {
          ...poolData.data,
          shortDescription: this.shortDescriptionTemp,
          fields: this.fieldsTemp,
          socialLinks: this.socialLinksTemp,
          projectCover: this.projectCoverTemp,
          projectLogo: this.projectLogoTemp,
        },
      }

      const pool = yield apiService.updateVotingPoolInfo(model)
      this.poolStore!.poolData = pool
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.saving = false
    }
  }
}
