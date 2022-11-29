import { appProvider } from '@/app-providers'
import { generateFileFromUrl, getApiFileUrl } from '@/helpers/file-helper'
import { Data, MissionType, SocialTaskComponent, SocialType, TaskConfig } from '@/models/MissionModel'
import { MissionInfo } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { assign, set, get, isEmpty } from 'lodash-es'
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
  HUNDRED,
  PRIORITY_AMOUNT_RATIO,
  Zero,
} from '@/constants'
import { getDefaultSettingConfig, extractTaskSettings } from '@/helpers'

export class EditSocialMissionViewModel {
  @observable step = 1

  @observable mission: Mission = {}
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

  constructor(unicodeName: string, missionId: string) {
    this.fetchMissionDetail(unicodeName, missionId)
  }

  @asyncAction *fetchMissionDetail(unicodeName: string, missionId: string) {
    try {
      this.pageLoading = true
      // Get pool
      const pools = yield this._api.voting.find<VotingPool>(
        { unicodeName, projectOwner: this._auth.projectOwnerId },
        { _limit: 1 }
      )
      if (isEmpty(pools)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.pool = pools[0]

      // Get mission
      const missions = yield this._api.tasks.find<Mission>({ votingPool: this.pool.id, id: missionId }, { _limit: 1 })
      if (isEmpty(missions)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.mission = missions[0]
      console.log(this.mission)
      this.missionInfo = {
        name: this.mission.name,
        shortDescription: this.mission.metadata?.shortDescription,
        // missionCover:this.mission.metadata?.projectLogo,
        priorityAmount: this.mission.priorityRewardAmount,
        priorityRatio: `${this.mission.priorityRatio ?? 0}`,
        maxParticipants: this.mission.maxParticipants?.toString(),
        maxPriorityParticipants: this.mission.maxPriorityParticipants?.toString(),
        startDate: this.mission.startTime,
        endDate: this.mission.endTime,
        type: this.mission.type,
        tokenBasePrice: this.mission.tokenBasePrice,
      }
      if (this.mission.metadata?.projectLogo)
        this.missionInfo.missionCover = yield generateFileFromUrl(this.mission.metadata?.projectLogo)

      this.generateTaskConfig(this.mission.data)
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.pageLoading = false
    }
  }

  generateTaskConfig = (data: any) => {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key] as Array<any>
        switch (key) {
          case 'optional':
            element.forEach((task, index) => {
              this.custom.push({
                key: index,
                component: SocialTaskComponent.CUSTOM_TASK,
                setting: { ...task },
              })
            })
            break
          case 'twitter':
            element.forEach((task, index) => {
              let component = SocialTaskComponent.FOLLOW_TWITTER
              if (task.type === 'follow') {
                component = SocialTaskComponent.FOLLOW_TWITTER
              } else if (task.type === 'like') {
                component = SocialTaskComponent.LIKE_TWITTER
              } else if (task.type === 'quote') {
                component = SocialTaskComponent.QUOTE_TWITTER
              } else if (task.type === 'comment') {
                component = SocialTaskComponent.COMMENT_TWITTER
              } else if (task.type === 'retweet') {
                component = SocialTaskComponent.RETWEET_TWITTER
              }
              this.twitter.push({
                key: index,
                component,
                setting: { ...task },
              })
            })
            break
          case 'telegram':
            element.forEach((task, index) => {
              let component = SocialTaskComponent.JOIN_TELEGRAM
              if (task.type === 'follow') {
                component = SocialTaskComponent.JOIN_TELEGRAM
              } else if (task.type === 'chat') {
                component = SocialTaskComponent.CHAT_TELEGRAM
              }
              this.telegram.push({
                key: index,
                component,
                setting: { ...task },
              })
            })
            break
          case 'discord':
            element.forEach((task, index) => {
              let component = SocialTaskComponent.JOIN_DISCORD
              if (task.type === 'join-server') {
                component = SocialTaskComponent.JOIN_DISCORD
              }
              this.discord.push({
                key: index,
                component,
                setting: { ...task },
              })
            })
            break
          case 'facebook':
            element.forEach((task, index) => {
              let component = SocialTaskComponent.FOLLOW_FACEBOOK
              if (task.type === 'follow') {
                component = SocialTaskComponent.FOLLOW_FACEBOOK
              }
              this.facebook.push({
                key: index,
                component,
                setting: { ...task },
              })
            })
            break
        }
      }
    }
  };

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

  @action.bound changeMissionInfo(property: string, value: any) {
    if (property === 'missionDates') {
      this.missionInfo = { ...this.missionInfo, startDate: value[0], endDate: value[1] }
      return
    }
    this.missionInfo = set(this.missionInfo, property, value)
  }

  @action.bound updateSetting(socialType: SocialType, key: number, value: any) {
    console.log(socialType, key, value)
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
    const priorityRatio = +(missionInfo.priorityRatio ?? 0)
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
      priorityRatio: priorityRatio,
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
      console.log('this.missionInfo', this.missionInfo)
      const model = yield this.getMissionModel(missionSettings, this.missionInfo, this.pool)
      const res = yield this._api.updateTask({ id: this.mission.id!, ...model })
      console.log(res)
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

  @computed get tokenBasePrice() {
    return get(this.missionInfo, 'tokenBasePrice', EMPTY_STRING)
  }

  @computed get tokenBAddress() {
    return this.mission.metadata?.tokenContractAddress || EMPTY_STRING
  }

  @computed get tokenBName() {
    return this.mission.metadata?.rewardToken || EMPTY_STRING
  }
}
