import { appProvider } from '@/app-providers'
import { VotingPools } from '@/models/VotingModel'
import { observable, computed, action, IReactionDisposer, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { flatMap, get, isEmpty, set } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { votingHandler } from '@/blockchainHandlers/voting-contract-solidity'
import { apiService } from '@/services/api-service'
export class ProjectDetailViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable poolDetail?: VotingPools
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
  @observable cancelled = false
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
          votingHandler?.injectMetamask(walletStore.web3!)
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
      this.poolDetail = get(res, '[0]')
      const poolInfo = yield votingHandler.getPoolInfo(this.poolDetail?.poolId)
      this.poolInfo = poolInfo
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @asyncAction *cancelAndWithdraw() {
    this.cancelling = true
    this.cancelled = false
    try {
      yield votingHandler.cancelPool(this.poolDetail?.poolId, walletStore.account)
      this.cancelled = true
    } catch (error) {
      appProvider.snackbar.commonError(error)
    }
    if (this.cancelled) {
      try {
        yield apiService.cancelVotingPool({
          id: this.poolDetail!.id,
          poolId: this.poolDetail!.poolId,
          ownerAddress: this.poolDetail!.ownerAddress,
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

  @computed get projectLogo() {
    return get(this.poolDetail, 'data.projectLogo', '')
  }

  @computed get projectName() {
    return get(this.poolDetail, 'projectName', '')
  }

  @computed get status() {
    return get(this.poolDetail, 'status', '')
  }
}
