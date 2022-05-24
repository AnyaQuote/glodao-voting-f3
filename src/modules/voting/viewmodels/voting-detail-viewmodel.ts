import { appProvider } from '@/app-providers'
import { VotingPools } from '@/models/VotingModel'
import { observable, computed, IReactionDisposer, when, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get, isEmpty } from 'lodash-es'
import { RoutePaths } from '@/router'
import { VotingHandler } from '@/blockchainHandlers/voting-contract-solidity'
import { Subject } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { apiService } from '@/services/api-service'
import { promiseHelper } from '@/helpers/promise-helper'

export class VotingDetailViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable voting = false

  @observable poolDetail?: VotingPools
  @observable votingList?: VotingPools[] = []
  @observable votingHandler?: VotingHandler
  @observable stakeFee?: FixedNumber
  @observable poolInfo?: any

  constructor(unicodeName: string) {
    this.loadData(unicodeName)

    this._disposers.push(
      reaction(
        () => walletStore.walletConnected,
        async () => {
          this.votingHandler?.injectMetamask(walletStore.web3!)
        }
      )
    )
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  /**
   * Fetch all data for pool detail and related voting pools
   * Go back to last page if api failed
   */
  @asyncAction *loadData(query: any) {
    try {
      const [poolDetail, votingList] = yield Promise.all([
        appProvider.api.voting.find({ unicodeName: query }, { _limit: 1 }),
        appProvider.api.voting.find({ status: 'voting' }, { _limit: -1 }),
      ])
      if (isEmpty(poolDetail)) {
        appProvider.router.push(RoutePaths.not_found)
      }
      this.poolDetail = get(poolDetail, '[0]')
      this.votingList = votingList

      const votingHandler = new VotingHandler()
      this.votingHandler = votingHandler
      const [poolType, poolInfo] = yield Promise.all([
        this.votingHandler.getPoolType(),
        this.votingHandler.getPoolInfo(this.poolDetail!.poolId),
      ])

      this.stakeFee = poolType.stakeFee
      this.poolInfo = poolInfo
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      //
    }
  }

  async vote() {
    const { completed } = await this.votingHandler!.vote(this.poolDetail!.poolId, walletStore.account)
    if (completed) {
      try {
        // api update status to approved
        await apiService.updateStatusToApproved({ id: this.poolDetail!.id, poolId: this.poolDetail!.poolId })
      } catch (error) {
        console.error(error)
      }
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
}
