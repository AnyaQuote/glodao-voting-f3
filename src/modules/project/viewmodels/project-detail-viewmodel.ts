import { appProvider } from '@/app-providers'
import { VotingPool } from '@/models/VotingModel'
import { observable, computed, action, IReactionDisposer, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { flatMap, get, isEmpty, set } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { PoolStore } from '@/stores/pool-store'

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
  @observable dataTemp?: VotingPool
  @action setDataTemp() {
    this.dataTemp = this.poolStore?.poolData
  }

  @action.bound onProjectNameChange(val: string) {
    if (this.dataTemp) {
      set(this.dataTemp, 'projectName', val)
    }
  }

  @action.bound onShortDescriptionChange(val: string) {
    if (this.dataTemp) {
      set(this.dataTemp, 'data.shortDescription', val)
    }
  }

  @action.bound onChangeImage(type: 'projectCover' | 'projectLogo', image: any) {
    if (this.dataTemp) {
      set(this.dataTemp, `data.${type}`, image)
    }
  }

  @action.bound onFieldsChange(fields: string[]) {
    if (this.dataTemp) {
      set(this.dataTemp, 'datas.fields', fields)
    }
  }

  @action.bound onSocialLinkChange(key: string, val: string) {
    if (this.dataTemp) {
      set(this.dataTemp, `data.socialLinks[${key}]`, val)
    }
  }

  @action.bound save() {
    //
  }
}
