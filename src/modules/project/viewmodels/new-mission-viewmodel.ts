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
import { ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD, PRIORITY_AMOUNT_RATIO, Zero } from '@/constants'

export class NewMissionViewModel {
  @observable step = 1

  @observable pool: VotingPool = {}
  @observable missionInfo: MissionInfo = {}
  @observable learnToEarn: LearnToEarn = {}
  @observable joinTelegram = joinTelegramDefault
  @observable followTwitter = followTwitterDefault
  @observable quoteTweet = quoteTweetDefault
  @observable commentTweet = commentTweetDefault
  @observable telegramChat = telegramChatDefault
  @observable fxAvgCommunityReward = Zero
  @observable pageLoading = false
  @observable btnLoading = false

  // PREVIEW QUIZ VARIABLES
  @observable previewQuiz: PreviewQuiz[] = []
  previewSampleSize = 10

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
        this._api.voting.find({ unicodeName, ownerAddress: this._auth.attachedAddress }, { _limit: 1 }),
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

  @action.bound changeLearnToEarnInfo(property: string, value: string | boolean) {
    this.learnToEarn = set(this.learnToEarn, property, value)
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

  async getQuizId() {
    if (!this.learnToEarn.setting) return null
    const { quizFile, learningFile, imageCover, name, description } = this.learnToEarn.setting
    let coverUrl

    if (imageCover) {
      coverUrl = await this.getImageSource(imageCover)
    } else {
      coverUrl = get(this.pool, 'data.projectCover')
    }

    const [data, answer] = await getDataFromQuizFile(quizFile!)
    const learningInformation = await getTextData(learningFile!)
    const projectOwnerId = this._auth.projectOwnerId

    const quiz: Quiz = {
      name,
      description,
      learningInformation,
      data,
      answer,
      projectOwner: projectOwnerId,
      metadata: {
        coverImage: coverUrl,
        tags: get(this.pool, 'data.fields', []),
      },
    }
    const res = await this._api.createQuiz({
      ownerAddress: this._auth.attachedAddress,
      ...quiz,
    })
    return res.id
  }

  async getMissionSetting() {
    if (this.learnToEarn.enabled) {
      const quizId = await this.getQuizId()
      return {
        quiz: [
          {
            type: 'quiz',
            quizId,
          },
        ],
      }
    } else {
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
  }

  async getTokenBasePriceValue(address: string) {
    const res = await this._api.getTokenPrice(address)
    return res.price._value
  }

  async getMissionModel(setting: Data, missionInfo: MissionInfo, pool: VotingPool) {
    const tokenLogo = 'https://api.glodao.io/uploads/BUSD_Logo_2cc6a78969.svg'
    const status = 'upcomming'

    const tokenBasePrice = await this.getTokenBasePriceValue(pool.ownerAddress!)
    const { website, ...socialLinks } = get(pool, 'data.socialLinks')
    const isSocialMission = missionInfo.type === 'social'

    // Type of the mission
    const type = isSocialMission ? MissionType.SOCIAL : MissionType.LEARN

    // Reward amount of a mission/task
    const rewardAmount = this.rewardPerMission._value

    // Learn to earn mission needs maxParticipants
    const maxParticipants = isSocialMission ? 0 : toNumber(missionInfo.maxParticipants)

    // Social mission needs maxPriorityParticipants and priorityRewardAmount field
    const maxPriorityParticipants = isSocialMission ? toNumber(missionInfo.maxPriorityParticipants) : 0
    const priorityRewardAmount = isSocialMission ? this.priorityAmount._value : '0'

    const coverImage = await this.getImageSource(missionInfo.missionCover!)

    const optRewardAmount = pool.data?.optionalRewardAmount
    const optTokenDecimal = pool.data?.optionalRewardTokenDecimals
    const optTokenPriorityRewardAmount = FixedNumber.from(optRewardAmount).divUnsafe(PRIORITY_AMOUNT_RATIO)._value
    const optTokenAddress = pool.data?.optionalTokenAddress
    const optTokenLogo = pool.data?.optionalTokenLogo
    const optTokenBasePrice = await this.getTokenBasePriceValue(optTokenAddress as string)
    const optionalToken: OptionalTokenItem = {
      rewardAmount: optRewardAmount,
      decimal: optTokenDecimal,
      priorityRewardAmount: optTokenPriorityRewardAmount,
      tokenContractAddress: optTokenAddress,
      tokenLogo: optTokenLogo,
      tokenBasePrice: optTokenBasePrice,
    }

    const mission: Mission = {
      rewardAmount,
      maxParticipants,
      maxPriorityParticipants,
      priorityRewardAmount,
      tokenBasePrice,
      startTime: missionInfo.startDate,
      endTime: missionInfo.endDate,
      name: missionInfo.name,
      chainId: pool.chain,
      type,
      poolId: pool.id,
      data: setting,
      status,
      optionalTokens: [optionalToken],
      metadata: {
        shortDescription: missionInfo.shortDescription,
        projectLogo: pool.data?.projectLogo,
        coverImage,
        caption: missionInfo.shortDescription,
        decimals: pool.data?.decimals,
        rewardToken: pool.tokenName,
        socialLinks: socialLinks || [],
        website: website || '#',
        tokenLogo,
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
          unicodeName: get(this.pool, 'unicodeName', ''),
        },
      })
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.btnLoading = false
    }
  }

  /**
   * Process file and return JSON data of preview quiz
   */
  @asyncAction *prepareQuizPreview() {
    if (!this.learnToEarn.setting?.quizFile) return false
    const res = yield getPreviewFromQuizFile(this.learnToEarn.setting.quizFile)
    this.previewQuiz = sampleSize(res, 10)
  }

  @computed get rewardPerMission() {
    try {
      return FixedNumber.from(this.pool?.rewardAmount).divUnsafe(FixedNumber.from(this.pool?.totalMission))
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
}
