import { appProvider } from '@/app-providers'
import { getApiFileUrl, getDataFromQuizFile, getPreviewFromQuizFile } from '@/helpers/file-helper'
import { Data } from '@/models/MissionModel'
import { Quiz, LearnToEarn, PreviewQuiz } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { isEqual, set, get, isEmpty, toNumber, sampleSize } from 'lodash-es'
import { action, IReactionDisposer, observable, reaction, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import { walletStore } from '@/stores/wallet-store'
import { PRIORITY_AMOUNT_RATIO, Zero } from '@/constants'

export class NewMissionViewModel {
  @observable step = 1

  @observable pool: VotingPool = {}
  @observable missionInfo = missionInfoDefault
  @observable joinTelegram = joinTelegramDef
  @observable followTwitter = followTwitterDef
  @observable quoteTweet = quoteTweetDef
  @observable commentTweet = commentTweetDef
  @observable learnToEarn = learnToEarnDefault
  @observable pageLoading = false
  @observable btnLoading = false

  _disposer: IReactionDisposer
  // PREVIEW QUIZ VARIABLES
  @observable previewQuiz: PreviewQuiz[] = []
  previewSampleSize = 10

  constructor(unicodeName: string) {
    this._disposer = reaction(
      () => walletStore.account,
      (account) => {
        account && this.fetchProjectByUnicode({ unicodeName, ownerAddress: account })
      },
      { fireImmediately: true }
    )
  }

  destroy() {
    this._disposer()
  }

  @asyncAction *fetchProjectByUnicode(query: { unicodeName: string; ownerAddress: string }) {
    try {
      this.pageLoading = true
      const res = yield appProvider.api.voting.find(query, { _limit: 1 })
      if (isEmpty(res)) {
        appProvider.router.replace(RoutePaths.not_found)
      }
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
    set(this.joinTelegram, property, value)
  }

  @action.bound changeFollowTwitterSetting(property, value) {
    set(this.followTwitter, property, value)
  }

  @action.bound changeQuoteTweetSetting(property, value) {
    set(this.quoteTweet, property, value)
    if (isEqual(property, 'setting.link')) {
      set(this.quoteTweet, 'setting.embedLink', value)
    }
  }

  @action.bound changeCommentTweetSetting(property, value) {
    set(this.commentTweet, property, value)
    if (isEqual(property, 'setting.link')) {
      set(this.commentTweet, 'setting.embedLink', value)
    }
  }

  @action.bound changeLearnToEarnInfo(property, value) {
    set(this.learnToEarn, property, value)
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
    const missionSetting = {}
    if (this.joinTelegram.enabled) {
      set(missionSetting, 'telegram', [{ ...this.joinTelegram.setting }])
    }
    if (this.followTwitter.enabled) {
      set(missionSetting, 'twitter', [...get(missionSetting, 'twitter', []), { ...this.followTwitter.setting }])
    }
    if (this.quoteTweet.enabled) {
      set(missionSetting, 'twitter', [...get(missionSetting, 'twitter', []), { ...this.quoteTweet.setting }])
    }
    if (this.commentTweet.enabled) {
      set(missionSetting, 'twitter', [...get(missionSetting, 'twitter', []), { ...this.commentTweet.setting }])
    }
    if (this.learnToEarn.enabled) {
      const quizId = yield this.getQuizId()
      set(missionSetting, 'quiz', [{ type: 'quiz', quizId }])
    }
    return missionSetting
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
      const model = this.mappingFields(missionSetting, this.missionInfo, this.pool!)
      yield appProvider.api.createTask(model)
      appProvider.snackbar.addSuccess()
      appProvider.router.push(RoutePaths.project_detail + this.pool?.unicodeName)
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
}

const missionInfoDefault = {
  name: '',
  shortDescription: '',
  missionCover: '',
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

const joinTelegramDef = {
  enabled: false,
  setting: {
    type: 'follow',
    link: '',
    page: 'GloDAO Chanel',
    required: true,
  },
}

const followTwitterDef = {
  enabled: false,
  setting: { type: 'follow', page: 'GloDAO', required: true, link: '' },
}

const quoteTweetDef = {
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

const commentTweetDef = {
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
