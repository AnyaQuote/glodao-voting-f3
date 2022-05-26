import { appProvider } from '@/app-providers'
import { getApiFileUrl, getJSONFromFile } from '@/helpers/file-helper'
import { Data } from '@/models/MissionModel'
import { Quiz, LearnToEarn } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { isEqual, set, get } from 'lodash-es'
import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'

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

const missionSettingDefault: Data = {
  twitter: [
    //
  ],
  telegram: [
    //
  ],
  quiz: [
    //
  ],
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
  @observable missionInfo = missionInfoDefault
  @observable joinTelegram = joinTelegramDef
  @observable followTwitter = followTwitterDef
  @observable quoteTweet = quoteTweetDef
  @observable commentTweet = commentTweetDef
  @observable learnToEarn = learnToEarnDefault
  @observable loading = false

  constructor() {
    //
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
      coverUrl = getApiFileUrl(yield appProvider.api.uploadFile(media))
    } else {
      // get project Cover for learn to earn cover
    }
    if (quizFile) {
      const textData = yield quizFile.text()
      ;[quizJSON, answerJSON] = getJSONFromFile(textData)
    } else throw new Error('Missing quiz file')
    if (learningFile) {
      learningInformation = yield learningFile.text()
    } else throw new Error('Missing learning file')
    const data: Quiz = {
      name,
      description,
      learningInformation,
      metadata: {
        coverImage: coverUrl,
        tags: ['nft'],
      },
      data: quizJSON,
      answer: answerJSON,
    }
    const res = yield appProvider.api.quizzes.create(data)
    return res
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
      const quiz = yield this.getQuizId()
      // set(missionSetting, 'quiz', [...get(missionSetting, 'quiz', []), { type: 'quiz', quizId: quiz.id }])
      set(missionSetting, 'quiz', [{ type: 'quiz', quizId: quiz.id }])
    }
    return missionSetting
  }

  @asyncAction *submit() {
    try {
      this.loading = true
      const data = yield this.getMissionSetting()
      console.log('mission.data:::', data)
      // const mission: Mission = {
      //   name: 'Hận Toản',
      //   type: 'bounty',
      //   status: 'draft',
      //   chainId: 'BSC',
      //   tokenBasePrice: '1.2',
      //   rewardAmount: '1000',
      //   startTime: moment().toISOString(),
      //   endTime: moment().toISOString(),
      //   data,
      //   metadata: {
      //     shortDescription:
      //       'Decentralized autonomous community of users, investors, and partners called GloDAO. This is an open ecosystem that combines Web3.0 Social Networking, DAO Organization, and Advertising. ',
      //     decimals: '18',
      //     projectLogo: 'https://diversity-api.contracts.dev/uploads/Tubbly_logo_3x_e3e569ffda.png',
      //     tokenLogo: 'https://api.glodao.io/uploads/BUSD_Logo_2cc6a78969.svg',
      //     coverImage: 'https://diversity-api.contracts.dev/uploads/Facebook_cover_1_b3e93b5f13.png',
      //     caption:
      //       "GloDAO establishes itself as a decentralized autonomous community of users, investors, and partners. This provides an open ecosystem and a fusion of Web3.0 Social Networking - DAO organization - Advertising, all in one place. <br/>GloDAO was born with a purpose: to support and promote the full potential of the projects and optimize its user performance. <br/>GloDAO is on its way to form a publicly open, transparent, and completely decentralized environment. The vast range of users that this can touch includes community members, projects, and KOL partners who can generate even more value and wealth when participating in GloDAO's ecosystem.",
      //     rewardToken: 'BUSD',
      //     socialLinks: {
      //       twitter: 'https://twitter.com/GloDAO_Official',
      //       telegram: 'https://t.me/GloDAO_Channel',
      //       facebook: 'https://www.facebook.com/GloDao-105742212066225',
      //     },
      //     website: 'https://glodao.io/',
      //   },
      // }
      // console.log('final:::', mission)
      // const fuck = yield appProvider.api.tasks.create(mission)
      // console.log('res:::', fuck)
      appProvider.snackbar.addSuccess()
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }
}
