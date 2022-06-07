import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, autorun, computed, IReactionDisposer, observable, reaction, runInAction, when } from 'mobx'
import { set, kebabCase, toNumber } from 'lodash'
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
import { blockchainHandler } from '@/blockchainHandlers'
import { FixedNumber } from '@ethersproject/bignumber'
import moment from 'moment'
import web3 from 'web3'

export class ProjectInfo {
  projectName?: string
  shortDescription?: string
  projectCover?: any
  projectLogo?: any
  fields?: any[]
  socialLinks?: any

  tokenName?: string
  rewardAmount?: string
  tokenAddress?: string

  optionalTokenName?: string
  optionalRewardAmount?: string
  optionalTokenAddress?: string

  startDate?: string
  endDate?: string
  totalMissions?: string
}

export class BountyApplyViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()
  tokenTestnetList = [
    {
      tokenName: 'GLD',
      tokenAddress: '0x1fa6283ec7fbb012407e7a5fc44a78b065b2a1cf-gld',
      decimals: 18,
    },
    {
      tokenName: 'BUSD',
      tokenAddress: '0x1fa6283ec7fbb012407e7a5fc44a78b065b2a1cf',
      decimals: 18,
    },
    {
      tokenName: 'USDT',
      tokenAddress: '0x1fa6283ec7fbb012407e7a5fc44a78b065b2a1cf-usdt',
      decimals: 18,
    },
  ]

  tokenList = this.tokenTestnetList

  @observable step = 1.1
  @observable unlockedStep = 1.1
  @observable projectInfo: ProjectInfo = {}
  @observable creating = false

  @observable approved = false
  @observable optionalApproved = false
  @observable approving = false
  @observable optionalApproving = false

  @observable bnbFee = Zero
  @observable rewardTokenBalance = Zero
  @observable rewardTokenDecimals = 18
  @observable optionalRewardTokenBalance = Zero
  @observable optionalRewardTokenDecimals = 18

  @observable tokenInfoLoading = false
  @observable approveChecking = false

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
      this.bnbFee = this.votingHandler.poolType.creationFee!
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

  @asyncAction *loadConfirmData() {
    try {
      this.approveChecking = true
      yield Promise.all([this.getRewardTokenInfo(), this.checkApproved(), this.checkOptionalApproved()])
    } catch (error) {
      console.error(error)
      snackController.commonError(error)
    } finally {
      this.approveChecking = false
    }
  }

  @asyncAction *getRewardTokenInfo() {
    const tokenInfo = yield this.votingHandler!.getTokenInfo(
      walletStore.web3,
      this.projectInfo.tokenAddress,
      walletStore.account
    )
    this.rewardTokenBalance = tokenInfo.balance
  }

  @asyncAction *checkApproved() {
    const approved = yield this.votingHandler!.approved(this.projectInfo.tokenAddress, walletStore.account)
    this.approved = approved
  }

  @asyncAction *checkOptionalApproved() {
    if (this.projectInfo.optionalTokenAddress && web3.utils.isAddress(this.projectInfo.optionalTokenAddress)) {
      const approved = yield this.votingHandler!.approved(this.projectInfo.optionalTokenAddress, walletStore.account)
      this.optionalApproved = approved
    }
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
  @asyncAction *optionalApprove() {
    this.optionalApproving = true
    try {
      yield this.votingHandler?.approve(this.projectInfo.optionalTokenAddress, walletStore.account)
      this.optionalApproved = true
    } catch (error) {
      this.optionalApproved = false
      snackController.commonError(error)
    } finally {
      this.optionalApproving = false
    }
  }

  @asyncAction *submit() {
    this.creating = true
    try {
      const { poolId, ownerAddress, poolType } = yield this.votingHandler?.createPool(
        this.projectInfo,
        walletStore.account,
        this.rewardTokenDecimals,
        this.optionalRewardTokenDecimals
      )

      // upload image
      let images
      if (this.projectInfo.projectLogo && this.projectInfo.projectCover) {
        const media = new FormData()
        media.append('files', this.projectInfo.projectLogo)
        media.append('files', this.projectInfo.projectCover)
        images = yield apiService.uploadFile(media)
      }

      let unicodeName = kebabCase(this.projectInfo.projectName)
      // check duplicate unicodeName
      const pools = yield apiService.voting.find({
        unicodeName,
        _limit: 1,
      })
      if (pools && pools.length > 0) {
        unicodeName = unicodeName + moment().unix().toString()
      }

      // update voting pool
      const data = {
        projectName: this.projectInfo.projectName?.trim(),
        type: 'bounty',
        poolId,
        ownerAddress,
        tokenAddress: this.projectInfo.tokenAddress,
        tokenName: this.projectInfo.tokenName,
        status: 'voting',
        unicodeName: kebabCase(this.projectInfo.projectName),
        totalMission: this.projectInfo.totalMissions,
        rewardAmount: this.projectInfo.rewardAmount,
        startDate: this.projectInfo.startDate,
        endDate: this.projectInfo.endDate,
        data: {
          shortDescription: this.projectInfo.shortDescription,
          fields: this.projectInfo.fields,
          socialLinks: this.projectInfo.socialLinks,
          projectLogo: images ? getApiFileUrl(images[0]) : null,
          projectCover: images ? getApiFileUrl(images[1]) : null,
          poolType,
          decimals: this.rewardTokenDecimals,
          optionalRewardTokenDecimals: this.optionalRewardTokenDecimals,
          optionalTokenAddress: this.projectInfo.optionalTokenAddress,
          optionalRewardAmount: this.projectInfo.optionalRewardAmount,
          optionalTokenName: this.projectInfo.optionalTokenName,
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
    if (property === 'optionalTokenAddress') {
      if (web3.utils.isAddress(value)) {
        this.tokenInfoLoading = true
        value = web3.utils.toChecksumAddress(value)
        this.votingHandler!.getTokenInfo(walletStore.web3, value, walletStore.account).then((tokenInfo) => {
          runInAction(() => {
            this.projectInfo = { ...this.projectInfo, optionalTokenName: tokenInfo.symbol as string }
            this.optionalRewardTokenBalance = tokenInfo.balance
            this.optionalRewardTokenDecimals = toNumber(tokenInfo.decimals)
            this.tokenInfoLoading = false
          })
        })
      } else {
        runInAction(() => (this.projectInfo = { ...this.projectInfo, tokenName: '' }))
      }
    } else if (property === 'tokenAddress') {
      const token = this.tokenList.find((item) => item.tokenAddress == value)
      set(this.projectInfo, 'tokenName', token?.tokenName)
      this.rewardTokenDecimals = token?.decimals || 18
    }

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
