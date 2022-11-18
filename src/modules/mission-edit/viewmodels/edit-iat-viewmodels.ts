import { MetaData, MissionType, IatInfoProp, InAppTrialInfo, Mission, Data, IatData } from '@/models/MissionModel'
import { generateFileFromUrl, getApiFileUrl } from './../../../helpers/file-helper'
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
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { FixedNumber } from '@ethersproject/bignumber'
import { get, isEmpty, set, toNumber } from 'lodash-es'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { generateRandomString } from '@/helpers'
import { APIKey } from '@/models/ApiKeyModel'

enum AppPlatform {
  MOBILE = 'mobile',
  WEB = 'web',
}

export class EditInAppTrialViewModel {
  @observable loading = false
  @observable step = 1
  @observable unlocked = 1

  @observable mission: Mission = {}
  @observable apiKey: APIKey = {}
  @observable iatInfo: InAppTrialInfo = EMPTY_OBJECT
  @observable platformType = AppPlatform.WEB

  @observable pool: VotingPool = EMPTY_OBJECT
  @observable appliedMission = 0
  @observable btnLoading = false

  private _auth = appProvider.authStore
  private _api = appProvider.api
  private _snackbar = appProvider.snackbar
  private _router = appProvider.router

  constructor(unicodeName: string, missionId: string) {
    this.loadPageData(unicodeName, missionId)
  }

  @action async loadPageData(unicodeName: string, missionId: string) {
    try {
      this.loading = true

      // Get pool
      const pools = await this._api.voting.find<VotingPool>(
        { unicodeName, projectOwner: this._auth.projectOwnerId },
        { _limit: 1 }
      )
      if (isEmpty(pools)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.pool = pools[0]

      // Get mission
      const missions = await this._api.tasks.find<Mission>({ votingPool: this.pool.id, id: missionId }, { _limit: 1 })
      if (isEmpty(missions)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.mission = missions[0]

      // Get api key
      const apiKey = await this._api.apiKey.find<APIKey>({ projectOwner: this._auth.projectOwnerId }, { _limit: 1 })
      if (isEmpty(apiKey)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.apiKey = apiKey[0]

      this.iatInfo = {
        startDate: this.mission.startTime,
        endDate: this.mission.endTime,
        appTitle: this.mission.name,
        maxParticipants: this.mission.maxParticipants?.toString(),
        missionReward: this.mission.rewardAmount,
        tokenBasePrice: this.mission.tokenBasePrice,
        taskDescription: this.mission.metadata?.taskDescription,
        appDescription: this.mission.metadata?.shortDescription,
      }
      this.initializeMissionType()
      this.initializeMissionTask()
      await this.initializeMissionScreenshots()
      if (this.mission.metadata?.coverImage)
        this.iatInfo.appLogo = await generateFileFromUrl(this.mission.metadata?.coverImage)
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  initializeMissionTask = () => {
    this.iatInfo.tasks = get(this.mission, 'data.iat', []).map((task) => ({
      context: task.context,
      code: task.code,
    }))
  }

  initializeMissionScreenshots = async () => {
    const screenshots = get(this.mission, 'metadata.screenshots', EMPTY_ARRAY)
    const result: File[] = []
    for (let index = 0; index < screenshots.length; index++) {
      const element = screenshots[index]
      const f = await generateFileFromUrl(element)
      result.push(f)
    }
    this.iatInfo.screenShots = result
  }

  initializeMissionType = () => {
    const webUrl = get(this.mission, 'metadata.webUrl', EMPTY_STRING)
    const appStoreUrl = get(this.mission, 'metadata.appStoreUrl', EMPTY_STRING)
    const googlePlayUrl = get(this.mission, 'metadata.googlePlayUrl', EMPTY_STRING)

    if (isEmpty(webUrl)) {
      this.platformType = AppPlatform.MOBILE
      this.iatInfo.chPlayLink = googlePlayUrl
      this.iatInfo.appStoreLink = appStoreUrl
    } else {
      this.platformType = AppPlatform.WEB
      this.iatInfo.webAppLink = webUrl
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
    if (property === 'missionDates') {
      this.iatInfo = { ...this.iatInfo, startDate: value[0], endDate: value[1] }
      return
    }
    this.iatInfo = set(this.iatInfo, property, value)
  }

  /**
   * Change UI form when inputting web, appstore link and screenshot files
   * @param value Web | Mobile
   */
  @action.bound changePlatformType(value: AppPlatform) {
    this.platformType = value
    if (value === AppPlatform.MOBILE) {
      if (this.chPlayLink) {
        this.updateIatInfo('chPlayLink', EMPTY_STRING)
      }
      if (this.appStoreLink) {
        this.updateIatInfo('appStoreLink', EMPTY_STRING)
      }
    } else {
      if (this.webAppLink) {
        this.updateIatInfo('webAppLink', EMPTY_STRING)
      }
    }
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

  async getModel(info: InAppTrialInfo, pool: VotingPool, imageSources: string[]) {
    const type = MissionType.APP_TRIAL
    const maxParticipants = toNumber(info.maxParticipants)
    const status = 'upcomming'
    const [coverImage, ...screenshots] = imageSources
    const { website, ...socialLinks } = pool.data?.socialLinks
    const optTokenLogo = pool.data!.optionalTokenLogo
    const optTokenAddress = pool.data!.optionalTokenAddress!
    const optTokenDecimal = +pool.data!.optionalRewardTokenDecimals!
    const tokenBasePrice = this.tokenBasePrice
    // Populate app trial task metadata
    const metadata: MetaData = {
      shortDescription: info.appDescription,
      projectLogo: pool.data!.projectLogo,
      caption: info.appDescription,
      appStoreUrl: this.appStoreLink,
      googlePlayUrl: this.chPlayLink,
      webUrl: this.webAppLink,
      taskDescription: this.taskDescription,
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
        code: task.code ? task.code : generateRandomString(),
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
      await this._api.updateTask({ ...missionModel, id: this.mission.id })
      this._snackbar.updateSuccess()
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
    return totalMission - this.appliedMission
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
      const fxRemainingMission = FixedNumber.from(this.remainingMission)
      const fxMissionReward = FixedNumber.from(this.missionReward)
      return fxMissionReward.mulUnsafe(fxRemainingMission)._value
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

  // ======== IN APP TRIAL MISSION INFO END ========

  // ======== IN APP TRIAL APP INFO START ==========

  @computed get appTitle() {
    return get(this.iatInfo, 'appTitle', EMPTY_STRING)
  }

  @computed get appLogo() {
    return get(this.iatInfo, 'appLogo', NULL)
  }

  @computed get webAppLink() {
    return get(this.iatInfo, 'webAppLink', EMPTY_STRING)
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

  @computed get isMobilePlatform() {
    return this.platformType === AppPlatform.MOBILE
  }

  // ======== IN APP TRIAL APP INFO END ============

  @computed get taskSetting() {
    return get(this.iatInfo, 'tasks', EMPTY_ARRAY)
  }

  @computed get taskDescription() {
    return get(this.iatInfo, 'taskDescription', EMPTY_STRING)
  }

  @computed get tokenBasePrice() {
    return get(this.iatInfo, 'tokenBasePrice', EMPTY_STRING)
  }

  @computed get tokenBAdress() {
    return this.pool.data?.optionalTokenAddress || EMPTY_STRING
  }

  @computed get tokenBName() {
    return this.pool.data?.optionalTokenName || EMPTY_STRING
  }
}
