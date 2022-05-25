import { appProvider } from '@/app-providers'
import { getJSONFromFile } from '@/helpers/file-helper'
import { Data } from '@/models/MissionModel'
import { Quiz } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { set } from 'lodash-es'
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
}

interface LearnToEarn {
  name?: string
  shortDescription?: string
  imageCover?: File | null
  quizFile?: File | null
  learningFile?: File | null
}

const learnToEarnDefault: LearnToEarn = {
  name: '',
  shortDescription: '',
  imageCover: null,
  quizFile: null,
  learningFile: null,
}

export const settingOneValue = {
  type: 'follow',
  page: 'GloDAO',
  required: true,
  link: 'https://twitter.com/GloDAO_Official',
}

export const settingTwoValue = {
  type: 'quote',
  content: 'GloDAO',
  page: 'GloDAO',
  hashtag: 'glodao',
  link: 'https://twitter.com/GloDAO_Official/status/1520689632299544577',
  embedLink: 'https://twitter.com/GloDAO_Official/status/1520689632299544577',
  required: true,
}

export const settingThreeValue = {
  type: 'follow',
  link: 'https://t.me/GloDAO_Channel',
  page: 'GloDAO Chanel',
  required: true,
}

export class NewMissionViewModel {
  @observable missionInfoForm: any
  @observable missionSettingForm: any[] = []
  @observable missionInfo = missionInfoDefault
  @observable learnToEarn = learnToEarnDefault

  @action.bound changeMissionInfo(property: string, value: string) {
    set(this.missionInfo, property, value)
  }
  @action.bound updateMissionSetting(property, value) {
    //
  }
  @action.bound changeLearnToEarnInfo(property, value) {
    set(this.learnToEarn, property, value)
  }
  @action injectForm(arrs: any[]) {
    this.missionSettingForm = arrs
  }

  @asyncAction submit() {
    try {
      // console.log('ref form:::', this.missionSettingForm)
      // const { quizFile, learningFile, name, shortDescription } = this.learnToEarn
      // let quizJSON, answerJSON, learningDoc
      // if (quizFile) {
      //   const textData = yield quizFile.text()
      //   ;[quizJSON, answerJSON] = getJSONFromFile(textData)
      // }
      // if (learningFile) {
      //   learningDoc = yield learningFile.text()
      // }
      // console.log('quizJSON::', quizJSON)
      // console.log('answerJSON::', answerJSON)
      // console.log('learningDoc::', learningDoc)
      // const data: Quiz = {
      //   name,
      //   description: shortDescription,
      //   learningInformation: learningDoc,
      //   metadata: {
      //     coverImage: '',
      //     tags: ['nft'],
      //   },
      //   data: quizJSON,
      //   answer: answerJSON,
      // }
      // const res = yield appProvider.api.quizzes.create(data)
      // const mission: Mission = {
      //   name: 'Hận Toản',
      //   type: 'bounty',
      //   status: 'draft',
      //   chainId: 'BSC',
      //   tokenBasePrice: '1.2',
      //   rewardAmount: '1000',
      //   startTime: moment().toISOString(),
      //   endTime: moment().toISOString(),
      //   data: {
      //     telegram: [
      //       {
      //         type: 'follow',
      //         link: 'https://t.me/bottoan1',
      //         page: 'bot Chanel',
      //         required: true,
      //       },
      //       {
      //         type: 'follow',
      //         link: 'https://t.me/bottoan2',
      //         page: 'bot group',
      //         required: true,
      //       },
      //     ],
      //   },
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
      // const fuck = yield appProvider.api.tasks.create(mission)
      // console.log('res:::', fuck)
    } catch (error) {
      appProvider.snackbar.commonError(error)
    }
  }
}
