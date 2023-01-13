import { appProvider } from '@/app-providers'
import { getApiFileUrl, getDataFromQuizFile, getPreviewFromQuizFile, getTextData } from '@/helpers/file-helper'
import { Quiz, LearnToEarn, PreviewQuiz, MissionInfo } from '@/models/QuizModel'
import { set, get, isEmpty, toNumber, sampleSize, round, assign, isEqual } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import {
  ALLOW_PASS_THROUGH,
  EMPTY_ARRAY,
  EMPTY_STRING,
  Zero,
  ZERO_NUM,
  EMPTY_OBJECT,
  NULL,
  TOTAL_IN_APP_TRIAL_STEP,
} from '@/constants'
import {
  SocialType,
  TaskConfig,
  MetaData,
  MissionType,
  IatInfoProp,
  InAppTrialInfo,
  Mission,
  Data,
  IatData,
} from '@/models/MissionModel'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD, HUNDRED, PRIORITY_AMOUNT_RATIO } from '@/constants'
import { getDefaultSettingConfig, extractTaskSettings, generateRandomString } from '@/helpers'
import { BaseNewMissionViewModel } from './base-new-viewmodel'
import { IBaseHandler } from '../handlers/base.handler'
import { MissionInfoHandler } from '../handlers/mission-info/mission-info.handler'
import { SocialHandler } from '../handlers/social/social.handler'
import { IatHandler } from '../handlers/iat/iat.handler'
import { loadingController } from '@/components/global-loading/global-loading-controller'

enum AppPlatform {
  MOBILE = 'mobile',
  WEB = 'web',
}

export class NewMixMissionVIewModel extends BaseNewMissionViewModel {
  @observable quizLength = 0
  @observable pool: VotingPool = EMPTY_OBJECT
  @observable handlers: IBaseHandler[] = []

  constructor(unicodeName: string) {
    super(unicodeName)
    this.initData(unicodeName)
  }

  @asyncAction *initData(unicodeName) {
    this.loading = true
    yield this.loadPageData(unicodeName)
    this.handlers = [new MissionInfoHandler(this.pool, this.appliedMission), new SocialHandler(), new IatHandler()]
    this.loading = false
  }

  @action nextStep(): void {
    super.nextStep()
  }

  @asyncAction *submit() {
    try {
      this.btnLoading = true
      const missionModel = yield this.mixMissionModel()
      yield this.api.createTask(missionModel)
      this.snackbar.addSuccess()
      this.router.push({
        name: RouteName.PROJECT_DETAIL,
        params: {
          unicodeName: get(this.pool, 'unicodeName', EMPTY_STRING),
          passThrough: ALLOW_PASS_THROUGH,
        },
      })
    } catch (error) {
      this.snackbar.commonError(error)
    } finally {
      this.btnLoading = false
    }
  }

  async mixMissionModel() {
    const missionInfo = this.handlers[0].getData()
    const socialInfo = this.handlers[1].getData()
    const iatInfo = this.handlers[2].getData()
    const pool = this.pool
    const [coverImage, ...screenshots] = await this.getImageSources(iatInfo.appLogo, ...(iatInfo.screenShots || []))

    const status = 'upcomming'
    const { website, ...socialLinks } = pool.data?.socialLinks
    const rewardAmount = this.rewardPerMission._value
    const maxParticipants = missionInfo.maxParticipants ? +missionInfo.maxParticipants : 0
    const maxPriorityParticipants = +missionInfo.maxPriorityParticipants!
    const priorityRewardAmount = maxPriorityParticipants !== 0 ? this.priorityAmount._value : '0'
    const priorityRatio = +(missionInfo.priorityRatio ?? 0)
    const optTokenDecimal = pool.data!.optionalRewardTokenDecimals
    const optTokenAddress = pool.data!.optionalTokenAddress
    const optTokenLogo = pool.data!.optionalTokenLogo
    const optTokenBasePrice = missionInfo.tokenBasePrice

    const mission = {
      type: MissionType.MIX,
      rewardAmount,
      maxParticipants,
      maxPriorityParticipants,
      priorityRewardAmount,
      tokenBasePrice: optTokenBasePrice,
      startTime: missionInfo.startDate,
      endTime: missionInfo.endDate,
      name: missionInfo.name,
      chainId: pool.chain,
      poolId: pool.id,
      data: this.mixMissionData(socialInfo, iatInfo.taskData),
      status,
      priorityRatio: priorityRatio,
      optionalTokens: EMPTY_ARRAY,
      ownerAddress: this.auth.attachedAddress,
      projectOwner: this.auth.projectOwnerId,
      metadata: {
        shortDescription: missionInfo.shortDescription,
        projectLogo: pool.data!.projectLogo,
        caption: missionInfo.shortDescription,
        decimals: +optTokenDecimal!,
        rewardToken: this.tokenName,
        tokenLogo: optTokenLogo,
        tokenContractAddress: optTokenAddress,
        socialLinks: socialLinks,
        website: website,
        coverImage,
        appStoreUrl: iatInfo.appStoreLink,
        googlePlayUrl: iatInfo.chPlayLink,
        webUrl: iatInfo.webAppLink,
        taskDescription: iatInfo.taskDescription,
        screenshots,
      },
    }
    return mission
  }

  mixMissionData(socialData, iatData) {
    return {
      ...socialData,
      iat: iatData,
    }
  }

  async getImageSource(imageFile: File) {
    const media = new FormData()
    media.append('files', imageFile)
    const imageResult = await this.api.uploadFile(media)
    return getApiFileUrl(imageResult[0])
  }

  async getImageSources(...files: (File | undefined | null)[]) {
    const media = new FormData()
    files.forEach((f) => f && media.append('files', f))
    const images = await this.api.uploadFile(media)
    return images.map((image: any) => getApiFileUrl(image))
  }

  @computed get currentHandler() {
    if (this.handlers.length === 0) return null
    return this.handlers[this.step]
  }

  @computed get isCurrentHandlerValid() {
    return this.currentHandler?.valid ?? false
  }

  @computed get isLastStep() {
    return this.step === this.handlers.length - 1
  }

  @computed get priorityAmount() {
    if (!this.missionInfo.priorityRatio) {
      return Zero
    }
    try {
      const fxPriorityRatio = FixedNumber.from(this.missionInfo.priorityRatio).divUnsafe(HUNDRED)
      return this.rewardPerMission.mulUnsafe(fxPriorityRatio)
    } catch (_) {
      return Zero
    }
  }

  @computed get communityAmount() {
    const roundedValue = parseFloat(this.priorityAmount._value).toFixed(2)
    const fxRoundedValue = FixedNumber.from(roundedValue)
    return this.rewardPerMission.subUnsafe(fxRoundedValue)
  }

  @computed get personalReward() {
    try {
      return this.priorityAmount.divUnsafe(FixedNumber.from(this.missionInfo.maxPriorityParticipants))
    } catch (_) {
      return Zero
    }
  }

  @computed get rewardPerMission() {
    try {
      return FixedNumber.from(this.pool?.data?.optionalRewardAmount).divUnsafe(
        FixedNumber.from(this.pool?.totalMission)
      )
    } catch (_) {
      return Zero
    }
  }

  @computed get tokenName() {
    return get(this.pool, 'data.optionalTokenName', '')
  }

  @computed get tokenBasePrice() {
    return get(this.missionInfo, 'tokenBasePrice', EMPTY_STRING)
  }

  @computed get tokenBAddress() {
    return this.pool.data?.optionalTokenAddress || EMPTY_STRING
  }

  @computed get tokenBName() {
    return this.pool.data?.optionalTokenName || EMPTY_STRING
  }
}
