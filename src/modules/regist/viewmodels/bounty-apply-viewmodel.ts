import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, autorun, computed, IReactionDisposer, observable, reaction, runInAction, when } from 'mobx'
import { set, kebabCase } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { toISO } from '@/helpers/date-helper'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { walletStore } from '@/stores/wallet-store'
import { authStore } from '@/stores/auth-store'
import { Subject } from 'rxjs'
import { VotingHandler } from '@/blockchainHandlers/voting-contract-solidity'
import { Zero } from '@/constants'
import { appProvider } from '@/app-providers'
import { RoutePaths } from '@/router'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: null,
  projectLogo: null,
  fields: [],
  socialLinks: {},
}

const poolInfoDefault = {
  rewardToken: '',
  rewardAmount: '',
  tokenAddress: '',
  startDate: {
    date: '',
    time: '',
  },
  endDate: {
    date: '',
    time: '',
  },
  totalMissions: '',
}

export class BountyApplyViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable step = 1.1
  @observable unlockedStep = 1.1
  @observable projectInfo = projectInfoDefault
  @observable poolInfo = poolInfoDefault
  @observable creating = false

  @observable approved = false
  @observable approving = false

  @observable bnbFee = Zero

  @observable votingHandler?: VotingHandler

  constructor() {
    if (authStore.isAuthenticated) {
      this.loadData()
    } else {
      appProvider.router.push(RoutePaths.project_list)
    }
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  async loadData() {
    const votingHandler = new VotingHandler()
    this.votingHandler = votingHandler
    await this.votingHandler.getPoolType()
    this.bnbFee = this.votingHandler.poolType.fee!

    this._disposers.push(
      when(
        () => walletStore.walletConnected,
        async () => {
          votingHandler.injectMetamask(walletStore.web3!)
        }
      )
    )
  }

  checkApproved() {
    this.votingHandler!.approved(this.poolInfo.tokenAddress, walletStore.account).then((approved) =>
      runInAction(() => (this.approved = approved))
    )
  }
  @asyncAction *approve() {
    this.approving = true
    try {
      yield this.votingHandler?.approve(this.poolInfo.tokenAddress, walletStore.account)
      this.approved = true
    } catch (error) {
      this.approved = false
      snackController.commonError(error)
    } finally {
      this.approving = false
    }
  }

  @asyncAction *submit() {
    this.creating = true
    try {
      const { poolId, ownerAddress, poolType } = yield this.votingHandler?.createPool(
        this.poolInfo.tokenAddress,
        '100',
        walletStore.account
      )

      const { projectName, projectLogo, projectCover, ...projectInfo } = this.projectInfo
      const { startDate, endDate, tokenAddress, ...poolInfo } = this.poolInfo

      // upload image
      let images
      if (projectLogo && projectCover) {
        const media = new FormData()
        media.append('files', projectLogo!)
        media.append('files', projectCover!)
        images = yield apiService.uploadFile(media)
      }

      // update voting pool
      const data = {
        projectName,
        type: 'bounty',
        poolId,
        ownerAddress,
        tokenAddress: this.poolInfo.tokenAddress,
        status: 'voting',
        unicodeName: kebabCase(projectName),
        startDate: toISO(startDate),
        endDate: toISO(endDate),
        data: {
          ...projectInfo,
          ...poolInfo,
          projectLogo: images ? getApiFileUrl(images[0]) : null,
          projectCover: images ? getApiFileUrl(images[1]) : null,
          poolType,
        },
      }
      const pool = yield apiService.createOrUpdateVotingPool(data)
      appProvider.router.push(RoutePaths.project_list)
    } catch (error) {
      console.error(error)
      snackController.commonError(error)
    } finally {
      this.creating = false
    }
  }

  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: any) {
    set(this.projectInfo, property, value)
  }

  @action.bound changePoolInfo(property: string, value: any) {
    set(this.poolInfo, property, value)
  }

  @action nextStep(value: number) {
    this.unlockedStep = this.step = value
  }
}
