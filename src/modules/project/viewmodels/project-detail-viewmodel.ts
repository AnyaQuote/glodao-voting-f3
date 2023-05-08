import { RouteName } from './../../../router/index'
import { appProvider } from '@/app-providers'
import { observable, computed, action, IReactionDisposer, reaction, when } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get, isEmpty, kebabCase, toNumber } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Subject } from 'rxjs'
import { walletStore } from '@/stores/wallet-store'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { PoolStore } from '@/stores/pool-store'
import { Mission } from '@/models/MissionModel'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import moment from 'moment'
import { promiseHelper } from '@/helpers/promise-helper'
import { HUNDRED, Zero, ZERO_NUM } from '@/constants'
import { FixedNumber } from '@ethersproject/bignumber'
import { VotingPool } from '@/models/VotingModel'
import { VotingHandlerV2 } from '@/blockchainHandlers/voting-contract-solidity-v2'
import { blockchainHandler } from '@/blockchainHandlers'
import web3 from 'web3'
import { bnHelper } from '@/helpers/bignumber-helper'

export class ProjectDetailViewModel {
  private _auth = appProvider.authStore
  private _router = appProvider.router
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

  @observable poolInfo: VotingPool = {}

  constructor(unicodeName: string) {
    this.fetchProjectDetail(unicodeName)
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  @observable votingHandlerV2?: VotingHandlerV2;
  @asyncAction *fetchProjectDetail(unicodeName: string) {
    try {
      this.loading = true

      let res
      if (!unicodeName) {
        this._router.replace({
          name: RouteName.NOT_FOUND,
        })
      }
      res = yield appProvider.api.voting.find(
        {
          unicodeName,
          projectOwner: this._auth.projectOwnerId,
        },
        { _limit: 1 }
      )
      if (isEmpty(res)) {
        appProvider.router.replace(RoutePaths.not_found)
      }
      const votingPool = get(res, '[0]')

      const address = process.env.VUE_APP_VOTING_V2_SOLIDITY
      let votingHandlerV2

      if (votingPool.version === 'v2') {
        votingHandlerV2 = new VotingHandlerV2(address!, blockchainHandler.getWeb3(process.env.VUE_APP_CHAIN_ID)!)
      }

      this.votingHandlerV2 = votingHandlerV2

      this._disposers.push(
        when(
          () => walletStore.walletConnected,
          async () => {
            votingHandlerV2?.injectProvider()
          }
        )
      )

      this._disposers.push(
        reaction(
          () => walletStore.account,
          async () => {
            votingHandlerV2?.injectProvider()
          }
        )
      )

      this.poolStore = new PoolStore(votingPool)
      this.poolInfo = this.poolStore.poolData
      if (votingPool.status === 'approved') {
        res = yield appProvider.api.tasks.find({ poolId: votingPool.poolId }, { _limit: -1, _sort: 'startTime:asc' })
        this.missions = res || []
      }
      yield this.checkPoolFunded()
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @observable isFunded = false;
  @asyncAction *checkPoolFunded() {
    const isFunded = yield this.votingHandlerV2?.isPoolFunded(this.poolInfo.poolId)
    this.isFunded = isFunded
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

        appProvider.snackbar.success('Cancel successfully. Browser will refresh soon...')
        this.changeCancelDialog(false)

        // Reload after cancelling
        promiseHelper.delay(500)
        location.reload()
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

  @observable approved = false
  @observable approving = false
  @observable approvedChecking = false;
  @asyncAction *checkTokenBApproved() {
    this.approvedChecking = true
    try {
      const approved = yield this.votingHandlerV2?.approved(this.tokenBAddress, walletStore.account)
      this.approved = approved
    } catch (error) {
      this.approved = false
      snackController.commonError(error)
    } finally {
      this.approvedChecking = false
    }
  }
  @asyncAction *approve() {
    this.approving = true
    try {
      yield this.votingHandlerV2?.approve(this.tokenBAddress, walletStore.account)
      this.approved = true
    } catch (error) {
      this.approving = false
      snackController.commonError(error)
    } finally {
      this.approving = false
    }
  }

  @observable tokenBAddress = ''
  @observable tokenBDecimals = 18
  @observable tokenBBalance = Zero;
  @asyncAction *onTokenAddressChange(tokenAddress) {
    this.tokenBAddress = tokenAddress
    if (this.tokenBAddress && web3.utils.isAddress(this.tokenBAddress)) {
      yield this.checkTokenBApproved()
      const { decimals, balance } = yield this.votingHandlerV2?.getTokenInfo(
        walletStore.web3,
        this.tokenBAddress,
        walletStore.account
      )
      this.tokenBDecimals = decimals
      this.tokenBBalance = balance
    }
  }

  @observable funding = false;
  @asyncAction *fund() {
    if (bnHelper.lt(this.tokenBBalance, this.totalToFund)) {
      snackController.error(`Balance Insufficient`)
      return
    }

    this.funding = true
    try {
      yield this.votingHandlerV2?.fundTokenB(
        this.poolInfo.poolId,
        this.tokenBAddress,
        bnHelper.toDecimalString(this.tokenBAmount, this.tokenBDecimals.toString()),
        walletStore.account
      )
      this.checkPoolFunded()

      // update votingpool on server
      yield appProvider.api.updateTokenBVotingPool({
        id: this.poolInfo.id,
        data: {
          ...this.poolInfo.data,
          optionalRewardTokenDecimals: +this.tokenBDecimals.toString(),
          optionalTokenAddress: this.tokenBAddress,
        },
      })

      snackController.success('Fund successfully')
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.funding = false
    }
  }

  @computed get tokenBAmount() {
    const value = get(this.poolInfo, 'data.optionalRewardAmount', ZERO_NUM)
    return FixedNumber.from(value)
  }

  @computed get tokenBName() {
    return get(this.poolInfo, 'data.optionalTokenName')
  }

  @computed get tokenBSingleMissionAmount() {
    try {
      return this.tokenBAmount.divUnsafe(FixedNumber.from(this.poolInfo.totalMission))
    } catch (_) {
      return Zero
    }
  }

  @computed get platformFee() {
    try {
      return this.tokenBAmount.mulUnsafe(FixedNumber.from(process.env.VUE_APP_FEE_PERCENT)).divUnsafe(HUNDRED)
    } catch (error) {
      return Zero
    }
  }

  @computed get totalToFund() {
    return this.tokenBAmount.addUnsafe(this.platformFee)
  }

  @computed get poolVersion() {
    return this.poolInfo.version
  }

  @computed get usedMission() {
    return this.poolInfo.usedMission
  }

  @computed get totalMission() {
    return this.poolInfo.totalMission
  }

  @computed get remainingMission() {
    const result = toNumber(this.totalMission) - toNumber(this.usedMission)
    return result > 0 ? result : 0
  }
}
