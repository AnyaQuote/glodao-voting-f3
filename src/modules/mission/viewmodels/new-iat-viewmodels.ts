import { MetaData, MissionType, IatInfoProp, InAppTrialInfo, Mission, Data, IatData } from '@/models/MissionModel'
import { getApiFileUrl } from './../../../helpers/file-helper'
import { appProvider } from '@/app-providers'
import {
  ZERO_NUM,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  EMPTY_STRING,
  NULL,
  TOTAL_IN_APP_TRIAL_STEP,
  Zero,
  ALLOW_PASS_THROUGH,
} from '@/constants'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { FixedNumber } from '@ethersproject/bignumber'
import { get, isEmpty, set, toNumber } from 'lodash-es'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { generateRandomString } from '@/helpers'

export class NewInAppTrialViewModel {
  @observable loading = false
  @observable step = 1
  @observable unlocked = 1

  @observable iatInfo: InAppTrialInfo = EMPTY_OBJECT
  @observable pool: VotingPool = EMPTY_OBJECT
  @observable appliedMission = 0
  @observable btnLoading = false

  private _auth = appProvider.authStore
  private _api = appProvider.api
  private _snackbar = appProvider.snackbar
  private _router = appProvider.router

  constructor(unicodeName: string) {
    this.loadPageData(unicodeName)
  }

  @asyncAction *loadPageData(unicodeName: string) {
    try {
      this.loading = true
      waitForGlobalLoadingFinished()
      const pools = yield this._api.voting.find(
        {
          unicodeName,
          projectOwner: this._auth.projectOwnerId,
        },
        { _limit: 1 }
      )
      if (isEmpty(pools)) {
        this._router.replace(RouteName.NOT_FOUND)
      }
      this.pool = pools[0]
      const appliedMission = yield this._api.tasks.count({
        votingPool: this.pool.id,
      })
      this.appliedMission = toNumber(appliedMission)
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  /**
   * Change step to provided value
   * If no value is provided, increase step
   * Step is unchange if next step larger than unlocked
   * @param value value of next step
   */
  @action.bound changeStep(value?: number) {
    if (value) {
      if (value <= this.unlocked) {
        this.step = value
      }
    } else {
      const nextStep = this.step + 1
      if (nextStep <= TOTAL_IN_APP_TRIAL_STEP) {
        this.step = nextStep
        this.unlocked = nextStep
      }
    }
  }

  /**
   * Update property of iatInfo object
   * @param property property name of iatInfo object
   * @param value value to assign
   */
  @action.bound updateIatInfo(property: IatInfoProp, value: any) {
    this.iatInfo = set(this.iatInfo, property, value)
  }

  /**
   * Upload images and return image sources from server
   * @param files array of files/blobs
   * @returns array of image sources
   */
  async getImageSources(files: File[]) {
    const media = new FormData()
    files.forEach((file) => {
      media.append('files', file)
    })
    const images = (await this._api.uploadFile(media)) as Array<any>
    const sources = images.map((image) => getApiFileUrl(image))
    return sources
  }

  /**
   * Get token base price
   * If address from testnet, api wont wỏk
   * @param address token address
   * @returns price value of token
   */
  async getTokenBasePriceValue(address: string) {
    try {
      const res = await this._api.getTokenPrice(address)
      return res.price._value
    } catch (_) {
      // Incase testnet failed, return 1
      return '1'
    }
  }

  async getModel(info: InAppTrialInfo, pool: VotingPool, imageSources: string[]) {
    const type = MissionType.APP_TRIAL
    const maxParticipants = toNumber(info.maxParticipants)
    const status = 'upcomming'
    const [coverImage, ...screenshots] = imageSources
    const { website, ...socialLinks } = pool.data?.socialLinks
    const optTokenLogo = pool.data!.optionalTokenLogo
    const optTokenAddress = pool.data!.optionalTokenAddress!
    const optTokenDecimal = +pool.data!.optionalRewardTokenDecimals!
    const tokenBasePrice = await this.getTokenBasePriceValue(optTokenAddress)
    // Populate app trial task metadata
    const metadata: MetaData = {
      shortDescription: info.appDescription,
      projectLogo: pool.data!.projectLogo,
      caption: info.appDescription,
      appStoreUrl: info.appStoreLink,
      googlePlayUrl: info.chPlayLink,
      tokenContractAddress: optTokenAddress,
      rewardToken: this.tokenName,
      decimals: optTokenDecimal,
      tokenLogo: optTokenLogo,
      screenshots,
      socialLinks,
      coverImage,
      website,
    }
    // Populate app trial task data
    const iatData: IatData[] = info.tasks!.map((task) => {
      return {
        code: generateRandomString(),
        context: task.context!,
        required: true,
      }
    })
    const data: Data = { iat: iatData }
    // Populate mission model
    const model: Mission = {
      projectOwner: this._auth.projectOwnerId,
      rewardAmount: this.missionReward,
      maxParticipants,
      maxPriorityParticipants: 0,
      priorityRewardAmount: '0',
      tokenBasePrice,
      startTime: info.startDate,
      endTime: info.endDate,
      name: info.appTitle,
      chainId: pool.chainId,
      poolId: pool.id,
      metadata,
      status,
      data,
      type,
    }
    return model
  }

  @action async createInAppTrialMission() {
    try {
      this.btnLoading = true
      const uploadFiles = [this.iatInfo.appLogo!, ...this.iatInfo.screenShots!]
      // [0] app Logo, [...rest] screenshots
      const sources = await this.getImageSources(uploadFiles)
      const missionModel = await this.getModel(this.iatInfo, this.pool, sources)
      await this._api.createTask(missionModel)
      this._snackbar.addSuccess()
      this._router.push({
        name: RouteName.PROJECT_DETAIL,
        params: {
          unicodeName: get(this.pool, 'unicodeName', EMPTY_STRING),
          passThrough: ALLOW_PASS_THROUGH,
        },
      })
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.btnLoading = false
    }
  }

  @computed get tokenName() {
    return get(this.pool, 'data.optionalTokenName', EMPTY_STRING)
  }

  @computed get projectReward() {
    return get(this.pool, 'data.optionalRewardAmount', ZERO_NUM)
  }

  @computed get poolTotalMissions() {
    return get(this.pool, 'totalMission', ZERO_NUM)
  }

  @computed get remainingMission() {
    const totalMission = toNumber(this.poolTotalMissions)
    const remainingMission = totalMission - this.appliedMission
    return `${remainingMission} / ${totalMission}`
  }

  @computed get personalReward() {
    try {
      const fxMissionReward = FixedNumber.from(this.missionReward)
      const fxMaxParticipants = FixedNumber.from(this.maxParticipants)
      return fxMissionReward.divUnsafe(fxMaxParticipants)._value
    } catch (_) {
      return Zero
    }
  }

  @computed get remainingProjectReward() {
    try {
      const fxProjectReward = FixedNumber.from(this.projectReward)
      const fxMissionReward = FixedNumber.from(this.missionReward)
      return fxProjectReward.subUnsafe(fxMissionReward)._value
    } catch (_) {
      return Zero
    }
  }

  // ======== IN APP TRIAL MISSION INFO START ========

  @computed get missionReward() {
    try {
      const fxProjectReward = FixedNumber.from(this.projectReward)
      const fxTotalMission = FixedNumber.from(this.poolTotalMissions)
      return fxProjectReward.divUnsafe(fxTotalMission)._value
    } catch (_) {
      return Zero._value
    }
  }

  @computed get maxParticipants() {
    return get(this.iatInfo, 'maxParticipants', EMPTY_STRING)
  }

  @computed get missionStartDate() {
    return get(this.iatInfo, 'startDate', EMPTY_STRING)
  }

  @computed get missionEndDate() {
    return get(this.iatInfo, 'endDate', EMPTY_STRING)
  }

  @computed get projectEndDate() {
    return get(this.pool, 'endDate', EMPTY_STRING)
  }

  @computed get projectStartDate() {
    return get(this.pool, 'startDate', EMPTY_STRING)
  }

  // ======== IN APP TRIAL MISSION INFO END ========

  // ======== IN APP TRIAL APP INFO START ==========

  @computed get appTitle() {
    return get(this.iatInfo, 'appTitle', EMPTY_STRING)
  }

  @computed get appLogo() {
    return get(this.iatInfo, 'appLogo', NULL)
  }

  @computed get appStoreLink() {
    return get(this.iatInfo, 'appStoreLink', EMPTY_STRING)
  }

  @computed get chPlayLink() {
    return get(this.iatInfo, 'chPlayLink', EMPTY_STRING)
  }

  @computed get appDescription() {
    return get(this.iatInfo, 'appDescription', EMPTY_STRING)
  }

  @computed get appScreenShots() {
    return get(this.iatInfo, 'screenShots', NULL)
  }

  // ======== IN APP TRIAL APP INFO END ============

  @computed get taskSetting() {
    return get(this.iatInfo, 'tasks', EMPTY_ARRAY)
  }
}
