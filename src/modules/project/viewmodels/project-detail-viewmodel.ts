import { appProvider } from '@/app-providers'
import { VotingPool } from '@/models/VotingModel'
import { observable, computed, action, IReactionDisposer, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { clone, flatMap, get, isEmpty, set } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { PoolStore } from '@/stores/pool-store'
import { imageHelper } from '@/helpers/image-helper'

export class ProjectDetailViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable poolStore?: PoolStore
  @observable missions = [
    {
      image: 'sao-hoa.png',
      status: 'ended',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      status: 'running',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      status: 'ended',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      status: 'ended',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
  ]
  @observable loading = false

  // Cancel dialog
  @observable cancelDialog = false
  @observable cancelling = false

  // Withdraw dialog
  @observable withdrawDialog = false

  @observable poolInfo: any = {}

  constructor(unicodeName: string) {
    this.fetchProjectDetail(unicodeName)

    this._disposers = [
      reaction(
        () => walletStore.account,
        () => {
          //
        }
      ),
    ]
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  @asyncAction *fetchProjectDetail(query: string) {
    try {
      this.loading = true
      const res = yield appProvider.api.voting.find(
        { unicodeName: query, ownerAddress: appProvider.authStore.username },
        { _limit: 1 }
      )
      if (isEmpty(res)) {
        appProvider.router.push(RoutePaths.not_found)
      }
      this.poolStore = new PoolStore(get(res, '[0]'))
    } catch (error) {
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

  @observable dataTemp: VotingPool = {
    id: '',
    projectName: '',
    ownerAddress: '',
    data: {
      shortDescription: '',
      projectCover: '',
      projectLogo: '',
      fields: [],
      socialLinks: {},
    },
  }

  @action setDataTemp() {
    this.dataTemp.id = clone(this.poolStore?.id)
    this.dataTemp.projectName = clone(this.poolStore?.projectName)
    this.dataTemp.ownerAddress = clone(this.poolStore?.ownerAddress)
    this.dataTemp.data!.projectLogo = clone(this.poolStore!.projectLogo)
    this.dataTemp.data!.projectCover = this.poolStore?.poolData.data?.projectCover
    this.dataTemp.data!.fields = clone(this.poolStore?.fields)
    this.dataTemp.data!.socialLinks = clone(this.poolStore?.socialLinks)
  }

  @action.bound changeData(path: string, value: any) {
    set(this.dataTemp, path, value)
  }

  @asyncAction *save() {
    const media = new FormData()

    let cover = false
    let logo = false

    if (typeof this.dataTemp.data!.projectLogo !== 'string') {
      media.append('files', this.dataTemp.data!.projectLogo!)
      logo = true
    }

    if (typeof this.dataTemp.data!.projectCover !== 'string') {
      media.append('files', this.dataTemp.data!.projectCover!)
      cover = true
      console.log('append success')
    }

    // upload
    let images

    if (media.getAll('files').length) {
      images = yield apiService.uploadFile(media)
      // update projectLogo and projectCover
      if (logo && cover) {
        console.log('all')

        this.dataTemp.data!.projectLogo = getApiFileUrl(images[0])
        this.dataTemp.data!.projectCover = getApiFileUrl(images[1])
      } else {
        if (logo) {
          console.log('logo')

          this.dataTemp.data!.projectLogo = getApiFileUrl(images[0])
        } else {
          console.log('cover')

          console.log(getApiFileUrl(images[0]))
          this.dataTemp.data!.projectCover = getApiFileUrl(images[0])
        }
      }
    }

    const pool = yield apiService.updateVotingPoolInfo(this.dataTemp)
    this.poolStore!.poolData = pool
  }
}
