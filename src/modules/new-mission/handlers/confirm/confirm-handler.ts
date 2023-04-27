import { IReactionDisposer, action, computed, observable, reaction, when } from 'mobx'
import { HandlerName, HandlerType, IBaseHandler } from '../base.handler'
import { ProjectInfo, VotingPool, VotingPoolStatus, VotingPoolType } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import { ALLOW_PASS_THROUGH, EMPTY_STRING, HUNDRED, Zero } from '@/constants'
import { get, isEmpty, kebabCase, set } from 'lodash-es'
import { promiseHelper } from '@/helpers/promise-helper'
import { RouteName } from '@/router'
import { walletStore } from '@/stores/wallet-store'
import { bnHelper } from '@/helpers/bignumber-helper'
import { asyncAction } from 'mobx-utils'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import moment from 'moment'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { VotingHandlerV2 } from '@/blockchainHandlers/voting-contract-solidity-v2'
import { appProvider } from '@/app-providers'
import { Subject } from 'rxjs'
import { blockchainHandler } from '@/blockchainHandlers'
import web3 from 'web3'

import { NewSocialMissionViewModel } from '@/modules/new-mission/viewmodels/new-social-mission-viewmodel'

export class ConfirmHandler implements IBaseHandler {
  type: HandlerType = HandlerType.confirm
  name: HandlerName = HandlerName.confirm
  @observable valid = true
  private _auth = appProvider.authStore
  private _api = appProvider.api
  private _router = appProvider.router
  private _snackbar = appProvider.snackbar
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()
  tokenTestnetList = [
    // {
    //   tokenName: 'GLD',
    //   tokenAddress: '0x1fa6283ec7fbb012407e7a5fc44a78b065b2a1cf-gld',
    //   decimals: 18,
    // },
    {
      tokenName: 'BUSD',
      tokenAddress: process.env.VUE_APP_BUSD_ADDRESS,
      decimals: 18,
    },
    // {
    //   tokenName: 'USDT',
    //   tokenAddress: '0x1fa6283ec7fbb012407e7a5fc44a78b065b2a1cf-usdt',
    //   decimals: 18,
    // },
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

  @observable feePerMission = Zero
  @observable rewardTokenBalance = Zero
  @observable rewardTokenDecimals = 18
  @observable optionalRewardTokenBalance = Zero
  @observable optionalRewardTokenDecimals = 18

  @observable tokenInfoLoading = false
  @observable approveChecking = false

  @observable votingHandler?: VotingHandlerV2
  // @observable rewardType = RewardDistributionType.TOKEN

  @observable formState = false

  constructor() {
    this.loadData()
  }

  getData() {
    throw new Error('Method not implemented.')
  }
  @action setProjectInfo(projectInfo: ProjectInfo) {
    this.projectInfo = { ...projectInfo, feePerMission: this.feePerMission.toString() }
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  @asyncAction *loadData() {
    if (walletStore.chainType === 'sol') {
      //
    } else {
      const address = process.env.VUE_APP_VOTING_V2_SOLIDITY
      const votingHandler = new VotingHandlerV2(address!, blockchainHandler.getWeb3(process.env.VUE_APP_CHAIN_ID)!)
      this.votingHandler = votingHandler
      yield this.votingHandler.getPoolType()
      this.feePerMission = this.votingHandler.poolType.feePerMission!

      this._disposers.push(
        when(
          () => walletStore.walletConnected,
          async () => {
            votingHandler.injectProvider()
          }
        )
      )

      this._disposers.push(
        reaction(
          () => walletStore.account,
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
      yield Promise.all([
        this.getRewardTokenInfo(),
        this.getOptionalTokenInfo(),
        this.checkApproved(),
        this.checkOptionalApproved(),
      ])
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

  @asyncAction *getOptionalTokenInfo() {
    if (this.projectInfo.optionalTokenAddress) {
      const tokenInfo = yield this.votingHandler!.getTokenInfo(
        walletStore.web3,
        this.projectInfo.optionalTokenAddress,
        walletStore.account
      )
      this.optionalRewardTokenBalance = tokenInfo.balance
    }
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
   * @param tokenLogo selected cover image file
   * @returns array of image sources in order pass in
   */
  async getImageSources(...files: (File | undefined | null)[]) {
    const media = new FormData()
    files.forEach((f) => f && media.append('files', f))
    const uploadedMedia = await this._api.uploadFile(media)
    return uploadedMedia.map((m: any) => getApiFileUrl(m))
  }

  /**
   * Check if existed a unicode name
   * If existed, return kebab case project name postfix with unix from moment
   * Else return kebab case project name
   * @param projectName Name of the project
   * @returns projectName converted to kebase case
   */
  @asyncAction *getUnicodeName(projectName: string) {
    const unicodeName = kebabCase(projectName)
    const res = yield apiService.voting.find({ unicodeName }, { _limit: 1 })
    if (isEmpty(res)) {
      return unicodeName
    } else {
      return unicodeName + moment().unix().toString()
    }
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
      this.optionalRewardTokenDecimals,
      this.projectInfo.totalMissions
    )

    // upload image
    const [projectLogo, projectCover, optionalTokenLogo] = yield this.getImageSources(
      this.projectInfo.projectLogo,
      this.projectInfo.projectCover,
      this.projectInfo.optionalTokenLogo
    )
    const status = VotingPoolStatus.APPROVED
    const unicodeName = yield this.getUnicodeName(this.projectInfo.projectName!)
    const votingStart = this.currentTime.toISOString()
    const votingEnd = this.currentTime.clone().add(3, 'd').toISOString()

    // update voting pool
    const data: VotingPool = {
      version: 'v2',
      ownerAddress,
      projectOwner: this._auth.projectOwnerId,
      projectName: this.projectInfo.projectName?.trim(),
      type: VotingPoolType.BOUNTY,
      poolId,
      status,
      // TOKEN A
      tokenAddress: this.projectInfo.tokenAddress,
      rewardAmount: this.projectInfo.rewardAmount,
      tokenName: this.projectInfo.tokenName,
      // ========
      unicodeName,
      totalMission: this.projectInfo.totalMissions,
      votingStart,
      votingEnd,
      startDate: this.projectInfo.startDate,
      endDate: this.projectInfo.endDate,
      chain: process.env.VUE_APP_CHAIN,
      chainId: process.env.VUE_APP_CHAIN_ID,
      data: {
        shortDescription: this.projectInfo.shortDescription,
        fields: this.projectInfo.fields,
        socialLinks: this.projectInfo.socialLinks,
        projectLogo,
        projectCover,
        poolType,
        // TOKEN A
        decimals: this.rewardTokenDecimals,
        // =======
        // TOKEN B
        // Incase do not input optional token address, decimal and token address is set to default 0 and ''
        optionalRewardTokenDecimals: this.projectInfo.optionalTokenAddress ? this.optionalRewardTokenDecimals : 0,
        optionalTokenAddress: this.projectInfo.optionalTokenAddress || '',
        optionalRewardAmount: this.projectInfo.optionalRewardAmount,
        optionalTokenName: this.projectInfo.optionalTokenName,
        optionalTokenLogo: optionalTokenLogo,
        // ======
      },
    }
    return data
  }

  @asyncAction *submit() {
    if (bnHelper.lt(walletStore.bnbBalance, this.bnbFee)) {
      snackController.error('BNB - Balance Insufficient')
      return
    }
    if (bnHelper.lt(this.rewardTokenBalance, FixedNumber.from(this.projectInfo.rewardAmount))) {
      snackController.error(`${this.projectInfo.tokenName} - Balance Insufficient`)
      return
    }
    // If token address is not input, don't check balance
    // Because the system will get tokenAddress to check balance
    if (
      this.projectInfo.optionalTokenAddress &&
      this.projectInfo.optionalRewardAmount &&
      bnHelper.lt(this.optionalRewardTokenBalance, FixedNumber.from(this.projectInfo.optionalRewardAmount))
    ) {
      snackController.error(`${this.projectInfo.optionalTokenName} - Balance Insufficient`)
      return
    }

    this.creating = true
    try {
      const votingPoolModel = yield this.getVotingPoolModel()
      yield this._api.createOrUpdateVotingPool(votingPoolModel)
      this._snackbar.addSuccess()
      promiseHelper.delay(500)
      this._router.push({
        name: RouteName.PROJECT_LIST,
        params: {
          passThrough: ALLOW_PASS_THROUGH,
        },
      })
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.creating = false
    }
  }

  @action.bound changeProjectInfo(property: string, value: any) {
    this.projectInfo = set(this.projectInfo, property, value)
  }

  // @action.bound switchType(value: RewardDistributionType) {
  //   this.rewardType = value

  //   if (value === RewardDistributionType.BUSD) {
  //     // Set BUSDF optionalTokenAddress  optional token (tokenAddress, decimals)
  //     this.changeProjectInfo('optionalTokenAddress', process.env.VUE_APP_BUSD_ADDRESS!)
  //     this.optionalRewardTokenDecimals = 18
  //   } else {
  //     this.changeProjectInfo('optionalTokenAddress', null)
  //   }
  // }

  @action nextStep(value: number) {
    this.unlockedStep = value
    this.step = value
  }

  @computed get rewardPerMission() {
    try {
      return FixedNumber.from(this.projectInfo?.optionalRewardAmount).divUnsafe(
        FixedNumber.from(this.projectInfo?.totalMissions)
      )
    } catch (error) {
      return Zero
    }
  }

  @computed get tokenName() {
    return get(this.projectInfo, 'optionalTokenName', '')
  }

  @computed get missionFee() {
    return get(this.projectInfo, 'rewardAmount', '')
  }

  @computed get generateWithTokenAddress() {
    return !!this.projectInfo.optionalTokenAddress
  }

  @computed get bnbFee() {
    try {
      return this.votingHandler!.poolType.creationFee!.mulUnsafe(
        FixedNumber.from(this.projectInfo.totalMissions!.toString())
      )
    } catch (error) {
      return Zero
    }
  }

  @computed get platformFee() {
    try {
      return FixedNumber.from(this.projectInfo.optionalRewardAmount)
        .mulUnsafe(FixedNumber.from(process.env.VUE_APP_FEE_PERCENT))
        .divUnsafe(HUNDRED)
    } catch (error) {
      return Zero
    }
  }

  @computed get currentTime() {
    return appProvider.currentTime
  }
  @computed get tokenBasePrice() {
    return get(this.projectInfo, 'tokenBasePrice', EMPTY_STRING)
  }

  @computed get tokenBAddress() {
    return this.projectInfo.optionalTokenAddress || EMPTY_STRING
  }

  @computed get tokenBName() {
    return this.projectInfo?.optionalTokenName || EMPTY_STRING
  }
}
