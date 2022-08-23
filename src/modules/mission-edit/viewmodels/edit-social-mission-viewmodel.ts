import { appProvider } from '@/app-providers'
import { getApiFileUrl } from '@/helpers/file-helper'
import { Data, MissionType, SocialType, TaskConfig } from '@/models/MissionModel'
import { MissionInfo } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { assign, isEqual, set, get, isEmpty, toNumber } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import {
  ALLOW_PASS_THROUGH,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  EMPTY_STRING,
  ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD,
  PRIORITY_AMOUNT_RATIO,
  Zero,
} from '@/constants'
import { getDefaultSettingConfig, extractTaskSettings } from '@/helpers'

export class EditSocialMissionViewModel {
  @observable step = 1

  @observable pool: VotingPool = EMPTY_OBJECT
  @observable missionInfo: MissionInfo = EMPTY_OBJECT
  @observable fxAvgCommunityReward = Zero
  @observable pageLoading = false
  @observable btnLoading = false

  @observable telegram: TaskConfig[] = EMPTY_ARRAY
  @observable twitter: TaskConfig[] = EMPTY_ARRAY
  @observable facebook: TaskConfig[] = EMPTY_ARRAY
  @observable custom: TaskConfig[] = EMPTY_ARRAY
  @observable discord: TaskConfig[] = EMPTY_ARRAY

  @observable showSelectDialog = false
  @observable selectedSocialType = EMPTY_STRING

  private _snackbar = appProvider.snackbar
  private _router = appProvider.router
  private _auth = appProvider.authStore
  private _api = appProvider.api

  private _key = 0

  constructor(unicodeName: string) {
    this.fetchProjectByUnicode(unicodeName)
  }

  @asyncAction *fetchProjectByUnicode(unicodeName: string) {
    try {
      this.pageLoading = true

      const [pools] = yield Promise.all([
        this._api.voting.find({ unicodeName, projectOwner: this._auth.projectOwnerId }, { _limit: 1 }),
        // this._api.getAverageCommunityReward(10),
      ])

      if (isEmpty(pools)) {
        this._router.replace(RoutePaths.not_found)
      }
      this.pool = pools[0]

      // if (get(avgCommunityReward, 'code') === '500') {
      //   throw ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD
      // }
      // // console.log('avgCommunityReward', avgCommunityReward)
      // this.fxAvgCommunityReward = FixedNumber.from(get(avgCommunityReward, 'data.result', '0'))
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.pageLoading = false
    }
  }

  @action.bound updateSelectDialogState(shown: boolean, type?: SocialType) {
    this.selectedSocialType = type || EMPTY_STRING
    this.showSelectDialog = shown
  }

  @action.bound changeMissionInfo(property: string, value: string) {
    this.missionInfo = set(this.missionInfo, property, value)
  }

  @action.bound updateSetting(socialType: SocialType, key: number, value: any) {
    this[socialType] = this[socialType].map((setting) => {
      return setting.key === key ? value : setting
    })
  }

  @action.bound removeSetting(socialType: SocialType, key: number) {
    this[socialType] = this[socialType].filter((setting) => setting.key !== key)
  }

  @action appendSetting(socialType: string, taskType: string) {
    try {
      const setting = getDefaultSettingConfig(socialType, taskType, this._key++)
      this[socialType] = [...this[socialType], setting]
    } catch (error) {
      this._snackbar.commonError(error)
    }
  }

  @action changeStep(step: number) {
    this.step = step
  }

  async getImageSource(imageFile: File) {
    const media = new FormData()
    media.append('files', imageFile)
    const imageResult = await this._api.uploadFile(media)
    return getApiFileUrl(imageResult[0])
  }

  getSocialMissionSettings() {
    const settings = {}
    if (this.telegram.length > 0) {
      assign(settings, { [SocialType.TELEGRAM]: extractTaskSettings(this.telegram) })
    }
    if (this.twitter.length > 0) {
      assign(settings, { [SocialType.TWITTER]: extractTaskSettings(this.twitter) })
    }
    if (this.facebook.length > 0) {
      assign(settings, { [SocialType.FACEBOOK]: extractTaskSettings(this.facebook) })
    }
    if (this.discord.length > 0) {
      assign(settings, { [SocialType.DISCORD]: extractTaskSettings(this.discord) })
    }
    if (this.custom.length > 0) {
      assign(settings, { optional: extractTaskSettings(this.custom) })
    }
    return settings
  }

  async getMissionModel(setting: Data, missionInfo: MissionInfo, pool: VotingPool) {
    const status = 'upcomming'
    const { website, ...socialLinks } = pool.data?.socialLinks
    const rewardAmount = this.rewardPerMission._value
    const maxParticipants = missionInfo.maxParticipants ? +missionInfo.maxParticipants : 0
    const maxPriorityParticipants = +missionInfo.maxPriorityParticipants!
    const priorityRewardAmount = maxPriorityParticipants !== 0 ? this.priorityAmount._value : '0'
    const coverImage = await this.getImageSource(missionInfo.missionCover!)
    const optTokenDecimal = pool.data!.optionalRewardTokenDecimals
    const optTokenAddress = pool.data!.optionalTokenAddress
    const optTokenLogo = pool.data!.optionalTokenLogo
    const optTokenBasePrice = this.tokenBasePrice
    const mission: Mission = {
      type: MissionType.SOCIAL,
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
      data: setting,
      status,
      optionalTokens: EMPTY_ARRAY,
      ownerAddress: this._auth.attachedAddress,
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
      },
    }
    return mission
  }

  @asyncAction *submit() {
    try {
      this.btnLoading = true
      const missionSettings = yield this.getSocialMissionSettings()
      const model = yield this.getMissionModel(missionSettings, this.missionInfo, this.pool)
      yield this._api.createTask(model)
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

  @computed get rewardPerMission() {
    try {
      return FixedNumber.from(this.pool?.data?.optionalRewardAmount).divUnsafe(
        FixedNumber.from(this.pool?.totalMission)
      )
    } catch (_) {
      return Zero
    }
  }

  @computed get priorityAmount() {
    return this.rewardPerMission.mulUnsafe(PRIORITY_AMOUNT_RATIO)
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

  @computed get tokenName() {
    return get(this.pool, 'data.optionalTokenName', '')
  }

  // @computed get maxPriorityParticipantsLimit() {
  //   try {
  //     const fxPotentialPriorityReward = this.fxAvgCommunityReward.mulUnsafe(FixedNumber.from('2'))
  //     const fxparticipantLimit = this.priorityAmount.divUnsafe(fxPotentialPriorityReward)
  //     const limit = ceil(toNumber(fxparticipantLimit._value))
  //     if (limit === 0) {
  //       throw null
  //     } else return limit
  //   } catch (_) {
  //     return 200
  //   }
  // }

  @computed get hasSettings() {
    return (
      this.telegram.length || this.twitter.length || this.discord.length || this.facebook.length || this.custom.length
    )
  }

  @computed get projectStartDate() {
    return get(this.pool, 'startDate', '')
  }

  @computed get projectEndDate() {
    return get(this.pool, 'endDate', '')
  }

  @computed get missionStartDate() {
    return get(this.missionInfo, 'startDate', '')
  }

  @computed get missionStartMaxDate() {
    return this.missionEndDate || this.projectEndDate
  }

  @computed get missionEndDate() {
    return get(this.missionInfo, 'endDate', '')
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
