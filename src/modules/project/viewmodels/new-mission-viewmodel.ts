import { appProvider } from '@/app-providers'
import { getApiFileUrl, getJSONFromFile, getSamplePreviewJSONFromFile } from '@/helpers/file-helper'
import { Data } from '@/models/MissionModel'
import { Quiz, LearnToEarn, PreviewQuiz } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { isEqual, set, get, isEmpty, toNumber } from 'lodash-es'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { toISO } from '@/helpers/date-helper'
import { FixedNumber } from '@ethersproject/bignumber'

const missionInfoDefault = {
  name: '',
  shortDescription: '',
  missionCover: '',
  priorityAmount: '',
  maxParticipants: '',
  startDate: {
    date: '',
    time: '',
  },
  endDate: {
    date: '',
    time: '',
  },
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

export class NewMissionViewModel {
  @observable pool?: VotingPool
  @observable missionInfo = missionInfoDefault
  @observable joinTelegram = joinTelegramDef
  @observable followTwitter = followTwitterDef
  @observable quoteTweet = quoteTweetDef
  @observable commentTweet = commentTweetDef
  @observable learnToEarn = learnToEarnDefault
  @observable pageLoading = false
  @observable btnLoading = false

  // PREVIEW QUIZ VARIABLES
  @observable previewQuiz: PreviewQuiz[] = []
  previewSampleSize = 10

  constructor(unicodeName: string) {
    this.fetchProjectByUnicode(unicodeName)
  }

  @asyncAction *fetchProjectByUnicode(query: string) {
    try {
      this.pageLoading = true
      const res = yield appProvider.api.voting.find(
        {
          unicodeName: query,
          ownerAddress: appProvider.authStore.username,
        },
        { _limit: 1 }
      )
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
    set(this.missionInfo, property, value)
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
      const textData = yield quizFile.text()
      ;[quizJSON, answerJSON] = getJSONFromFile(textData)
    } else throw new Error('Missing quiz file')
    if (learningFile) {
      learningInformation = yield learningFile.text()
    } else throw new Error('Missing learning file')
    const quiz: Quiz = {
      name,
      description,
      learningInformation,
      data: quizJSON,
      answer: answerJSON,
      metadata: {
        coverImage: coverUrl,
        tags: this.pool?.data?.fields,
      },
    }
    const res = yield appProvider.api.quizzes.create(quiz)
    return res.id
  }

  @asyncAction *getMissionSetting() {
    const missionSetting = {}
    if (this.joinTelegram.enabled) {
      // set(missionSetting, 'telegram', [...get(missionSetting, 'telegram', []), this.joinTelegram.setting])
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
      // set(missionSetting, 'quiz', [...get(missionSetting, 'quiz', []), { type: 'quiz', quizId: quiz.id }])
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
      ownerAddress: appProvider.wallet.account,
      poolId: pool.id,
      name: missionInfo.name,
      type: pool.type,
      status,
      chainId: pool.chain,
      tokenBasePrice,
      rewardAmount: FixedNumber.from(pool.rewardAmount).divUnsafe(FixedNumber.from(pool.totalMission)).toString(),
      startTime: toISO(missionInfo.startDate),
      endTime: toISO(missionInfo.endDate),
      maxParticipant: toNumber(missionInfo.maxParticipants),
      priorityRewardAmount: missionInfo.priorityAmount,
      data: setting,
      metadata: {
        shortDescription: missionInfo.shortDescription,
        decimals: pool.data?.decimals,
        projectLogo: pool.data?.projectLogo,
        tokenLogo,
        coverImage: pool.data?.projectCover,
        caption: missionInfo.shortDescription,
        rewardToken: pool.tokenName,
        socialLinks,
        website,
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
      const { quizFile } = this.learnToEarn.setting!
      if (quizFile) {
        const data = yield quizFile.text()
        this.previewQuiz = getSamplePreviewJSONFromFile(data, this.previewSampleSize)
      }
    } catch (error) {
      appProvider.snackbar.commonError(error)
    }
  }
}
