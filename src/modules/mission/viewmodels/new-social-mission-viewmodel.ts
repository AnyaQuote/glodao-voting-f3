import { appProvider } from '@/app-providers'
import { getApiFileUrl, getDataFromQuizFile, getPreviewFromQuizFile, getTextData } from '@/helpers/file-helper'
import { Data, MissionType, OptionalTokenItem } from '@/models/MissionModel'
import {
  Quiz,
  LearnToEarn,
  PreviewQuiz,
  MissionInfo,
  joinTelegramDefault,
  followTwitterDefault,
  quoteTweetDefault,
  commentTweetDefault,
  telegramChatDefault,
} from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { isEqual, set, get, isEmpty, toNumber, sampleSize, ceil } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import { EMPTY_STRING, ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD, PRIORITY_AMOUNT_RATIO, Zero } from '@/constants'

export class NewSocialMissionViewModel {
  @observable step = 1

  @observable pool: VotingPool = {}
  @observable missionInfo: MissionInfo = {}
  @observable joinTelegram = joinTelegramDefault
  @observable followTwitter = followTwitterDefault
  @observable quoteTweet = quoteTweetDefault
  @observable commentTweet = commentTweetDefault
  @observable telegramChat = telegramChatDefault
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

  @action.bound changeMissionInfo(property: string, value: string) {
    this.missionInfo = set(this.missionInfo, property, value)
  }
  @action.bound changeJoinTelegramSetting(property: string, value: string | boolean) {
    this.joinTelegram = set(this.joinTelegram, property, value)
  }

  @action.bound changeFollowTwitterSetting(property: string, value: string | boolean) {
    this.followTwitter = set(this.followTwitter, property, value)
  }

  @action.bound changeQuoteTweetSetting(property: string, value: string | boolean) {
    isEqual(property, 'setting.link') && (this.quoteTweet = set(this.quoteTweet, 'setting.embedLink', value))
    this.quoteTweet = set(this.quoteTweet, property, value)
  }

  @action.bound changeCommentTweetSetting(property: string, value: string | boolean) {
    isEqual(property, 'setting.link') && (this.commentTweet = set(this.commentTweet, 'setting.embedLink', value))
    this.commentTweet = set(this.commentTweet, property, value)
  }

  @action.bound changeTelegramChatSetting(property: string, value: string | boolean) {
    this.telegramChat = set(this.telegramChat, property, value)
  }

  @action changeStep(step: number) {
    this.step = step
  }

  @action resetSocialSetting() {
    this.changeJoinTelegramSetting('enabled', false)
    this.changeCommentTweetSetting('enabled', false)
    this.changeFollowTwitterSetting('enabled', false)
    this.changeQuoteTweetSetting('enabled', false)
    this.changeTelegramChatSetting('enabled', false)
  }

  async getImageSource(imageFile: File) {
    const media = new FormData()
    media.append('files', imageFile)
    const imageResult = await this._api.uploadFile(media)
    return getApiFileUrl(imageResult[0])
  }

  async getMissionSetting() {
    let socialSetting = {}
    if (this.joinTelegram.enabled) {
      socialSetting = set(socialSetting, 'telegram', [
        ...get(socialSetting, 'telegram', []),
        { ...this.joinTelegram.setting },
      ])
    }
    if (this.followTwitter.enabled) {
      socialSetting = set(socialSetting, 'twitter', [
        ...get(socialSetting, 'twitter', []),
        { ...this.followTwitter.setting },
      ])
    }
    if (this.quoteTweet.enabled) {
      socialSetting = set(socialSetting, 'twitter', [
        ...get(socialSetting, 'twitter', []),
        { ...this.quoteTweet.setting },
      ])
    }
    if (this.commentTweet.enabled) {
      socialSetting = set(socialSetting, 'twitter', [
        ...get(socialSetting, 'twitter', []),
        { ...this.commentTweet.setting },
      ])
    }
    if (this.telegramChat.enabled) {
      socialSetting = set(socialSetting, 'telegram', [
        ...get(socialSetting, 'telegram', []),
        { ...this.telegramChat.setting },
      ])
    }
    return socialSetting
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
    const maxParticipants = toNumber(missionInfo.maxParticipants)

    // Social mission needs maxPriorityParticipants and priorityRewardAmount field
    const maxPriorityParticipants = toNumber(missionInfo.maxPriorityParticipants)
    const priorityRewardAmount = this.priorityAmount._value

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
      this.btnLoading = true
      const missionSetting = yield this.getMissionSetting()
      const model = yield this.getMissionModel(missionSetting, this.missionInfo, this.pool)
      yield this._api.createTask({ ...model, ownerAddress: this._auth.attachedAddress })
      this._snackbar.addSuccess()
      this._router.push({
        name: RouteName.PROJECT_DETAIL,
        params: {
          unicodeName: get(this.pool, 'unicodeName', EMPTY_STRING),
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

  @computed get isValid() {
    return (formState) =>
      formState &&
      (this.joinTelegram.enabled ||
        this.followTwitter.enabled ||
        this.quoteTweet.enabled ||
        this.commentTweet.enabled ||
        this.telegramChat.enabled)
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
}