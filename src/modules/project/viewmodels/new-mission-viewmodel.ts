import { appProvider } from '@/app-providers'
import { getApiFileUrl, getDataFromQuizFile, getPreviewFromQuizFile } from '@/helpers/file-helper'
import { Data } from '@/models/MissionModel'
import { Quiz, LearnToEarn, PreviewQuiz } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { isEqual, set, get, isEmpty, toNumber, sampleSize } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import { PRIORITY_AMOUNT_RATIO, Zero } from '@/constants'
import { authStore } from '@/stores/auth-store'

export class NewMissionViewModel {
  @observable step = 1

  @observable pool: VotingPool = {}
  @observable missionInfo = missionInfoDefault
  @observable joinTelegram = joinTelegramDefault
  @observable followTwitter = followTwitterDefault
  @observable quoteTweet = quoteTweetDefault
  @observable commentTweet = commentTweetDefault
  @observable telegramChat = telegramChatDefault
  @observable learnToEarn = learnToEarnDefault
  @observable pageLoading = false
  @observable btnLoading = false

  // PREVIEW QUIZ VARIABLES
  @observable previewQuiz: PreviewQuiz[] = []
  previewSampleSize = 10

  constructor(unicodeName: string) {
    this.fetchProjectByUnicode(unicodeName)
  }

  @asyncAction *fetchProjectByUnicode(unicodeName: string) {
    try {
      this.pageLoading = true
      const res = yield appProvider.api.voting.find(
        { unicodeName, ownerAddress: authStore.attachedAddress },
        { _limit: 1 }
      )
      isEmpty(res) && appProvider.router.replace(RoutePaths.not_found)

      this.pool = res[0]
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.pageLoading = false
    }
  }

  @action.bound changeMissionInfo(property: string, value: string) {
    this.missionInfo = set(this.missionInfo, property, value)
  }
  @action.bound changeJoinTelegramSetting(property, value) {
    this.joinTelegram = set(this.joinTelegram, property, value)
  }

  @action.bound changeFollowTwitterSetting(property, value) {
    this.followTwitter = set(this.followTwitter, property, value)
  }

  @action.bound changeQuoteTweetSetting(property, value) {
    isEqual(property, 'setting.link') && (this.quoteTweet = set(this.quoteTweet, 'setting.embedLink', value))
    this.quoteTweet = set(this.quoteTweet, property, value)
  }

  @action.bound changeCommentTweetSetting(property, value) {
    isEqual(property, 'setting.link') && (this.commentTweet = set(this.commentTweet, 'setting.embedLink', value))
    this.commentTweet = set(this.commentTweet, property, value)
  }

  @action.bound changeTelegramChatSetting(property, value) {
    this.telegramChat = set(this.telegramChat, property, value)
  }

  @action.bound changeLearnToEarnInfo(property, value) {
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

  @asyncAction *getQuizId() {
    const { quizFile, learningFile, imageCover, name, description } = this.learnToEarn.setting!
    let quizJSON, answerJSON, learningInformation, coverUrl
    if (imageCover) {
      const media = new FormData()
      media.append('files', imageCover)
      coverUrl = getApiFileUrl(yield appProvider.api.uploadFile(media)[0])
    } else {
      coverUrl = this.pool?.data?.projectCover
    }

    if (quizFile) {
      ;[quizJSON, answerJSON] = yield getDataFromQuizFile(quizFile)
    }

    if (learningFile) {
      learningInformation = (yield learningFile.text()).trim()
    }

    const quiz: Quiz = {
      name,
      description,
      learningInformation,
      data: quizJSON,
      answer: answerJSON,
      ownerAddress: appProvider.wallet.account,
      metadata: {
        coverImage: coverUrl,
        tags: this.pool?.data?.fields,
      },
    }
    const res = yield appProvider.api.createQuiz(quiz)
    return res.id
  }

  @asyncAction *getMissionSetting() {
    const setting = {}

    // Collect social settings
    this.joinTelegram.enabled && set(setting, 'telegram', [{ ...this.joinTelegram.setting }])
    this.followTwitter.enabled &&
      set(setting, 'twitter', [...get(setting, 'twitter', []), { ...this.followTwitter.setting }])
    this.quoteTweet.enabled && set(setting, 'twitter', [...get(setting, 'twitter', []), { ...this.quoteTweet.setting }])
    this.commentTweet.enabled &&
      set(setting, 'twitter', [...get(setting, 'twitter', []), { ...this.commentTweet.setting }])

    // Collect learn to earn setting
    if (this.learnToEarn.enabled) {
      const quizId = yield this.getQuizId()
      set(setting, 'quiz', [{ type: 'quiz', quizId }])
    }

    return setting
  }

  @action mappingFields(setting: Data, missionInfo: any, pool: VotingPool): Mission {
    const { website, ...socialLinks } = get(pool, 'data.socialLinks')
    // HARD CODE
    const tokenLogo = 'https://api.glodao.io/uploads/BUSD_Logo_2cc6a78969.svg'
    const status = 'draft'
    const tokenBasePrice = '1'
    // =========
    return {
      rewardAmount: FixedNumber.from(pool.rewardAmount).divUnsafe(FixedNumber.from(pool.totalMission)).toString(),
      maxParticipant: toNumber(missionInfo.maxParticipants),
      priorityRewardAmount: this.priorityAmount.toString(),
      ownerAddress: appProvider.wallet.account,
      startTime: missionInfo.startDate,
      endTime: missionInfo.endDate,
      name: missionInfo.name,
      chainId: pool.chain,
      type: pool.type,
      tokenBasePrice,
      poolId: pool.id,
      data: setting,
      status,
      metadata: {
        shortDescription: missionInfo.shortDescription,
        projectLogo: pool.data?.projectLogo,
        coverImage: pool.data?.projectCover,
        caption: missionInfo.shortDescription,
        decimals: pool.data?.decimals,
        rewardToken: pool.tokenName,
        socialLinks: socialLinks || [],
        website: website || '#',
        tokenLogo,
      },
    }
  }

  @asyncAction *submit() {
    try {
      this.btnLoading = true
      const missionSetting = yield this.getMissionSetting()
      const model = this.mappingFields(missionSetting, this.missionInfo, this.pool)
      yield appProvider.api.createTask(model)
      appProvider.snackbar.addSuccess()
      appProvider.router.push(RoutePaths.project_detail + this.pool.unicodeName)
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.btnLoading = false
    }
  }

  /**
   * Process file and return JSON data of preview quiz
   */
  @asyncAction *prepareQuizPreview() {
    try {
      if (!this.learnToEarn.setting?.quizFile) return false
      const res = yield getPreviewFromQuizFile(this.learnToEarn.setting?.quizFile)
      this.previewQuiz = sampleSize(res, 10)
      return true
    } catch (error) {
      appProvider.snackbar.commonError(error)
    }
    return false
  }

  @computed get rewardPerMission() {
    try {
      return FixedNumber.from(this.pool?.totalMission).divUnsafe(FixedNumber.from(this.pool?.totalMission))
    } catch (error) {
      return Zero
    }
  }

  @computed get priorityAmount() {
    return this.rewardPerMission.mulUnsafe(PRIORITY_AMOUNT_RATIO)
  }

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

const missionInfoDefault = {
  name: '',
  shortDescription: '',
  missionCover: null,
  priorityAmount: '',
  maxParticipants: '',
  startDate: '',
  endDate: '',
  type: '',
}

const learnToEarnDefault: LearnToEarn = {
  enabled: false,
  setting: {
    name: '',
    description: '',
    imageCover: null,
    quizFile: null,
    learningFile: null,
  },
}

const joinTelegramDefault = {
  enabled: false,
  setting: {
    type: 'follow',
    link: '',
    page: 'GloDAO Chanel',
    required: true,
  },
}

const followTwitterDefault = {
  enabled: false,
  setting: { type: 'follow', page: 'GloDAO', required: true, link: '' },
}

const quoteTweetDefault = {
  enabled: false,
  setting: {
    type: 'quote',
    content: 'GloDAO',
    page: 'GloDAO',
    hashtag: '',
    link: '',
    embedLink: '',
    required: true,
  },
}

const commentTweetDefault = {
  enabled: false,
  setting: {
    type: 'comment',
    page: 'GloDAO',
    content: 'GloDAO',
    embedLink: '',
    link: '',
    required: true,
  },
}

const telegramChatDefault = {
  enabled: false,
  setting: {
    type: 'comment',
    page: 'GloDAO',
    content: 'GloDAO',
    embedLink: '',
    link: '',
    required: true,
  },
}
