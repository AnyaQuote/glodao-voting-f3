import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, autorun, computed, IReactionDisposer, observable, reaction, runInAction, when } from 'mobx'
import { set, kebabCase } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { walletStore } from '@/stores/wallet-store'
import { authStore } from '@/stores/auth-store'
import { Subject } from 'rxjs'
import { VotingHandler } from '@/blockchainHandlers/voting-contract-solidity'
import { Zero } from '@/constants'
import { appProvider } from '@/app-providers'
import { RoutePaths } from '@/router'
import { toISO } from '@/helpers/date-helper'
import { blockchainHandler } from '@/blockchainHandlers'
import { FixedNumber } from '@ethersproject/bignumber'

class ProjectInfo {
  projectName?: string
  shortDescription?: string
  projectCover?: any
  projectLogo?: any
  fields?: any[]
  socialLinks?: any

  rewardToken?: string
  rewardAmount?: string
  tokenAddress?: string
  startDate?: string
  endDate?: string
  totalMissions?: string
}

export class BountyApplyViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable step = 1.1
  @observable unlockedStep = 1.1
  @observable projectInfo: ProjectInfo = {}
  @observable creating = false

  @observable approved = false
  @observable approving = false

  @observable bnbFee = Zero
  @observable rewardTokenBalance = Zero

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
    if (walletStore.chainType === 'sol') {
      //
    } else {
      const address = process.env.VUE_APP_VOTING_SOLIDITY
      const votingHandler = new VotingHandler(address!, blockchainHandler.getWeb3(walletStore.chainId)!)
      this.votingHandler = votingHandler
      await this.votingHandler.getPoolType()
      this.bnbFee = this.votingHandler.poolType.fee!
      this._disposers.push(
        when(
          () => walletStore.walletConnected,
          async () => {
            votingHandler.injectProvider()
          }
        )
      )
    }
  }

  async loadConfirmData() {
    await Promise.all([this.checkApproved(), this.getTokenBalance()])
  }

  @asyncAction *checkApproved() {
    const approved = yield this.votingHandler!.approved(this.projectInfo.tokenAddress, walletStore.account)
    this.approved = approved
  }
  @asyncAction *getTokenBalance() {
    const rewardTokenBalance = yield this.votingHandler?.getTokenBalance(
      walletStore.web3,
      this.projectInfo.tokenAddress,
      walletStore.account
    )
    this.rewardTokenBalance = rewardTokenBalance
  }

  @asyncAction *approve() {
    this.approving = true
    try {
      yield this.votingHandler?.approve(this.projectInfo.tokenAddress, walletStore.account)
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
        this.projectInfo.tokenAddress!,
        this.projectInfo.rewardAmount!,
        walletStore.account
      )

      // upload image
      let images
      if (this.projectInfo.projectLogo && this.projectInfo.projectCover) {
        const media = new FormData()
        media.append('files', this.projectInfo.projectLogo)
        media.append('files', this.projectInfo.projectCover)
        images = yield apiService.uploadFile(media)
      }

      // update voting pool
      const data = {
        projectName: this.projectInfo.projectName,
        type: 'bounty',
        poolId,
        ownerAddress,
        tokenAddress: this.projectInfo.tokenAddress,
        rewardTokenSymbol: this.projectInfo.rewardToken,
        status: 'voting',
        unicodeName: kebabCase(this.projectInfo.projectName),
        totalMission: this.projectInfo.totalMissions,
        // startDate: toISO(startDate),
        // endDate: toISO(endDate),
        data: {
          shortDescription: this.projectInfo.shortDescription,
          fields: this.projectInfo.fields,
          socialLinks: this.projectInfo.socialLinks,
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
    if (this.creating) return
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: any) {
    set(this.projectInfo, property, value)
  }

  @action nextStep(value: number) {
    this.unlockedStep = this.step = value
  }

  @computed get rewardPerMission() {
    try {
      return FixedNumber.from(this.projectInfo?.rewardAmount).divUnsafe(
        FixedNumber.from(this.projectInfo?.totalMissions)
      )
    } catch (error) {
      return Zero
    }
  }
}
