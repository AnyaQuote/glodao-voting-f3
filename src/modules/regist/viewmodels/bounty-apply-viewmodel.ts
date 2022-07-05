import { VotingPoolType } from '@/models/VotingModel'
import { APP_CHAIN, APP_CHAIN_ID } from '@/constants/index'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, computed, IReactionDisposer, observable, reaction, runInAction, when } from 'mobx'
import { set, kebabCase, toNumber, isEmpty } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { walletStore } from '@/stores/wallet-store'
import { Subject } from 'rxjs'
import { VotingHandler } from '@/blockchainHandlers/voting-contract-solidity'
import { Zero } from '@/constants'
import { appProvider } from '@/app-providers'
import { RouteName } from '@/router'
import { blockchainHandler } from '@/blockchainHandlers'
import { FixedNumber } from '@ethersproject/bignumber'
import moment from 'moment'
import web3 from 'web3'
import { promiseHelper } from '@/helpers/promise-helper'
import { VotingPool, VotingPoolStatus } from '@/models/VotingModel'

export class BountyApplyViewModel {
  private _auth = appProvider.authStore
  private _api = appProvider.api
  private _router = appProvider.router
  private _snackbar = appProvider.snackbar
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
  @observable projectInfo: ProjectInfo = {
    votingStart: moment().toISOString(),
    votingEnd: moment().add(3, 'd').toISOString(),
  }
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
    this.loadData()
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

  /**
   * Upload image to media library and get source path
   * @param projectLogo selected logo image file
   * @param projectCover selected cover image file
   * @returns array of image sources in order pass in
   */
  async getImageSources(projectLogo: File, projectCover: File) {
    const media = new FormData()
    media.append('files', projectLogo)
    media.append('files', projectCover)
    const uploadedMedia = await this._api.uploadFile(media)
    const logoSource = getApiFileUrl(uploadedMedia[0])
    const coverSource = getApiFileUrl(uploadedMedia[1])
    return [logoSource, coverSource]
  }

  /**
   * Check if existed a unicode name
   * If existed, return kebab case project name postfix with unix from moment
   * Else return kebab case project name
   * @param projectName Name of the project
   * @returns projectName converted to kebase case
   */
  @asyncAction *checkUnicodeDuplicate(projectName: string) {
    const unicodeName = kebabCase(projectName)
    const [_, res] = yield promiseHelper.handle(apiService.voting.find({ unicodeName }, { _limit: 1 }))
    return isEmpty(res) ? unicodeName : unicodeName + moment().unix().toString()
  }

  /**
   * Get and map data to voting pool model
   * @returns populated voting pool model
   */
  @asyncAction *getVotingPoolModel() {
    const { poolId, ownerAddress, poolType } = yield this.votingHandler?.createPool(
      this.projectInfo,
      walletStore.account,
      this.rewardTokenDecimals,
      this.optionalRewardTokenDecimals
    )

    // upload image
    const [projectLogo, projectCover] = yield this.getImageSources(
      this.projectInfo.projectLogo,
      this.projectInfo.projectCover
    )
    const status = VotingPoolStatus.APPROVED
    const unicodeName = yield this.checkUnicodeDuplicate(this.projectInfo.projectName!)
    const votingStart = moment().toISOString()
    const votingEnd = moment().add(3, 'd').toISOString()

    // update voting pool
    const data: VotingPool = {
      projectOwner: this._auth.projectOwnerId,
      projectName: this.projectInfo.projectName?.trim(),
      type: VotingPoolType.BOUNTY,
      poolId,
      ownerAddress,
      tokenAddress: this.projectInfo.tokenAddress,
      tokenName: this.projectInfo.tokenName,
      status,
      unicodeName,
      totalMission: this.projectInfo.totalMissions,
      rewardAmount: this.projectInfo.rewardAmount,
      votingStart,
      votingEnd,
      startDate: this.projectInfo.startDate,
      endDate: this.projectInfo.endDate,
      chain: APP_CHAIN,
      chainId: APP_CHAIN_ID,
      data: {
        shortDescription: this.projectInfo.shortDescription,
        fields: this.projectInfo.fields,
        socialLinks: this.projectInfo.socialLinks,
        projectLogo,
        projectCover,
        poolType,
        decimals: this.rewardTokenDecimals,
        optionalRewardTokenDecimals: this.optionalRewardTokenDecimals,
        optionalTokenAddress: this.projectInfo.optionalTokenAddress,
        optionalRewardAmount: this.projectInfo.optionalRewardAmount,
        optionalTokenName: this.projectInfo.optionalTokenName,
      },
    }
    return data
  }

  @asyncAction *submit() {
    this.creating = true
    try {
      // Cái nhập vào phải nhỏ hơn cái hiện có
      if (walletStore.bnbBalance) {
        //
      }
      const votingPoolModel = yield this.getVotingPoolModel()
      yield this._api.createOrUpdateVotingPool(votingPoolModel)
      this._snackbar.addSuccess()
      promiseHelper.delay(500)
      this._router.push({
        name: RouteName.PROJECT_LIST,
      })
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.creating = false
    }
  }

  @action.bound changeStep(value: number) {
    if (this.creating) return
    if (value <= this.unlockedStep) {
      this.step = value
    }
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
    this.projectInfo = set(this.projectInfo, property, value)
  }

  @action nextStep(value: number) {
    this.unlockedStep = value
    this.step = value
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

  votingStart?: string
  votingEnd?: string

  startDate?: string
  endDate?: string
  totalMissions?: string
}
