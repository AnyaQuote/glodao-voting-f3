import { appProvider } from '@/app-providers'
import { getApiFileUrl } from '@/helpers/file-helper'
import { Data, MissionType, SocialTaskComponent, SocialTaskType } from '@/models/MissionModel'
import { MissionInfo } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { isEqual, set, get, isEmpty, toNumber } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import {
  ALLOW_PASS_THROUGH,
  EMPTY_OBJECT,
  EMPTY_STRING,
  ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD,
  PRIORITY_AMOUNT_RATIO,
  Zero,
} from '@/constants'

const joinTeleSetting = {
  key: 0,
  component: SocialTaskComponent.JOIN_TELEGRAM,
  setting: {
    type: SocialTaskType.FOLLOW,
    link: '',
    page: '',
    required: true,
  },
}

const teleChatSetting = {
  key: 1,
  component: SocialTaskComponent.CHAT_TELEGRAM,
  setting: {
    type: SocialTaskType,
    page: '',
    content: [],
    embedLink: '',
    link: '',
    required: true,
  },
}

const followTweetSetting = {
  key: 1,
  component: SocialTaskComponent.FOLLOW_TWITTER,
  setting: {
    type: SocialTaskType.FOLLOW,
    link: '',
    page: '',
    required: true,
  },
}

const quoteTweetSetting = {
  key: 1,
  component: SocialTaskComponent.QUOTE_TWITTER,
  setting: {
    type: SocialTaskType.QUOTE,
    content: '',
    page: '',
    hashtag: [],
    link: '',
    embedLink: '',
    required: true,
  },
}

interface TaskConfig {
  key?: number
  component?: string
  setting?: {
    type?: string
    link?: string
    page?: string
    required?: boolean
  }
}

export class NewSocialMissionViewModel {
  @observable step = 2

  // Setting must match observeable variable's name below
  // readonly missionSettings = [
  //   'joinTelegram',
  //   'followTwitter',
  //   'quoteTweet',
  //   'commentTweet',
  //   'telegramChat',
  //   'facebookFollow',
  //   'customTask',
  // ]

  @observable pool: VotingPool = {}
  @observable missionInfo: MissionInfo = {}
  // @observable joinTelegram = joinTelegramDefault
  // @observable followTwitter = followTwitterDefault
  // @observable quoteTweet = quoteTweetDefault
  // @observable commentTweet = commentTweetDefault
  // @observable telegramChat = telegramChatDefault
  // @observable facebookFollow = facebookFollowSetting
  // @observable customTask = customTaskSetting
  @observable fxAvgCommunityReward = Zero
  @observable pageLoading = false
  @observable btnLoading = false

  private _snackbar = appProvider.snackbar
  private _router = appProvider.router
  private _auth = appProvider.authStore
  private _api = appProvider.api

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

  @observable showSelectDialog = false
  @observable selectedSocial = ''
  readonly socialTypeEnum = SocialType
  @action.bound updateSelectDialogState(shown: boolean, type?: SocialType) {
    this.selectedSocial = type || ''
    this.showSelectDialog = shown
  }

  @observable telegram: TaskConfig[] = []
  @observable twitter: TaskConfig[] = []

  @action.bound changeMissionInfo(property: string, value: string) {
    this.missionInfo = set(this.missionInfo, property, value)
  }

  @action.bound updateSetting(socialType: SocialType, key: number, value: any) {
    console.log('updating')
    this[socialType] = this[socialType].map((setting) => {
      return setting.key === key ? value : setting
    })
  }

  @action.bound removeSetting(socialType: SocialType, key: number) {
    console.log('removing')
    this[socialType] = this[socialType].filter((setting) => setting.key !== key)
  }

  private _key = 0

  getTelegramTaskTypeData(type: string) {
    switch (type) {
      case SocialTaskType.FOLLOW:
        return { ...joinTeleSetting, key: this._key++ }
      case SocialTaskType.COMMENT:
        return { ...teleChatSetting, key: this._key++ }
      default:
        return { ...joinTeleSetting, key: this._key++ }
    }
  }

  getTwitterTaskTypeData(type: string) {
    switch (type) {
      case SocialTaskType.FOLLOW:
        return { ...followTweetSetting, key: this._key++ }
      case SocialTaskType.QUOTE:
        return { ...quoteTweetSetting, key: this._key++ }
      default:
        return { ...followTweetSetting, key: this._key++ }
    }
  }

  @action appendSetting(data: any) {
    let setting = {}
    switch (data.socialType) {
      case SocialType.TELEGRAM:
        setting = this.getTelegramTaskTypeData(data.type)
        this.telegram = [...this.telegram, setting]
        break
      case SocialType.TWITTER:
        setting = this.getTwitterTaskTypeData(data.type)
        this.twitter = [...this.twitter, setting]
        break
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

  getMissionSetting() {
    //
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

  async getMissionModel(setting: Data, missionInfo: MissionInfo, pool: VotingPool) {
    const status = 'upcomming'

    // const tokenBasePrice = await this.getTokenBasePriceValue(pool.ownerAddress!)
    const { website, ...socialLinks } = get(pool, 'data.socialLinks')

    // Reward amount of a mission/task
    const rewardAmount = this.rewardPerMission._value

    // Learn to earn mission needs maxParticipants
    const maxParticipants = missionInfo.maxParticipants ? toNumber(missionInfo.maxParticipants) : 0

    // Social mission needs maxPriorityParticipants and priorityRewardAmount field
    const maxPriorityParticipants = toNumber(missionInfo.maxPriorityParticipants)
    let priorityRewardAmount = '0'
    if (maxPriorityParticipants !== 0) {
      priorityRewardAmount = this.priorityAmount._value
    }

    const coverImage = await this.getImageSource(missionInfo.missionCover!)

    // const optRewardAmount = pool.data?.optionalRewardAmount
    const optTokenDecimal = pool.data?.optionalRewardTokenDecimals
    // const optTokenPriorityRewardAmount = FixedNumber.from(optRewardAmount).divUnsafe(PRIORITY_AMOUNT_RATIO)._value
    const optTokenAddress = pool.data?.optionalTokenAddress
    const optTokenLogo = pool.data?.optionalTokenLogo
    const optTokenBasePrice = await this.getTokenBasePriceValue(optTokenAddress as string)
    const optTokenName = pool.data?.optionalTokenName

    const mission: Mission = {
      // OPTIONAL TO MAIN TOKEN FOR MISSION
      rewardAmount,
      maxParticipants,
      maxPriorityParticipants,
      priorityRewardAmount,
      tokenBasePrice: optTokenBasePrice,
      // ==================================
      startTime: missionInfo.startDate,
      endTime: missionInfo.endDate,
      name: missionInfo.name,
      chainId: pool.chain,
      type: MissionType.SOCIAL,
      poolId: pool.id,
      data: setting,
      status,
      optionalTokens: [],
      metadata: {
        shortDescription: missionInfo.shortDescription,
        projectLogo: pool.data?.projectLogo,
        coverImage,
        caption: missionInfo.shortDescription,
        // OPTIONAL TO MAIN
        decimals: toNumber(optTokenDecimal),
        rewardToken: this.tokenName,
        tokenLogo: optTokenLogo,
        tokenContractAddress: optTokenAddress,
        // ===============
        socialLinks: socialLinks || [],
        website: website || '#',
      },
    }
    return mission
  }

  @asyncAction *submit() {
    try {
      console.log([...this.telegram])
      return
      this.btnLoading = true
      const missionSetting = yield this.getMissionSetting()
      const model = yield this.getMissionModel(missionSetting, this.missionInfo, this.pool)
      yield this._api.createTask({ ...model, ownerAddress: this._auth.attachedAddress })
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

  // @computed get isValid() {
  //   return (state) => true
  //   return (isFormValidated) => {
  //     return this.missionSettings.some((task) => this[task].enabled) && isFormValidated
  //   }
  // }

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
}

export enum SocialType {
  TELEGRAM = 'telegram',
  TWITTER = 'twitter',
}
