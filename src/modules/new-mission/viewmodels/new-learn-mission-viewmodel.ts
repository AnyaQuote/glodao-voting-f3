import { appProvider } from '@/app-providers'
import { getApiFileUrl, getDataFromQuizFile, getPreviewFromQuizFile, getTextData } from '@/helpers/file-helper'
import { Data, MissionType } from '@/models/MissionModel'
import { Quiz, LearnToEarn, PreviewQuiz, MissionInfo } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { set, get, isEmpty, toNumber, sampleSize, round } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import { ALLOW_PASS_THROUGH, EMPTY_ARRAY, EMPTY_STRING, Zero } from '@/constants'
import { AppEditorController } from '@/components/editor/app-editor.controller'

export class NewLearnMissionViewModel {
  @observable step = 1
  @observable quizLength = 0
  @observable pool: VotingPool = {}
  @observable missionInfo: MissionInfo = {}
  @observable learnToEarn: LearnToEarn = {
    enabled: true,
    setting: {
      questionsPerQuiz: '10',
      correctAnswersPerQuiz: '10',
      canRepeat: true,
    },
  }
  @observable pageLoading = false
  @observable btnLoading = false

  // PREVIEW QUIZ VARIABLES
  @observable previewQuiz: PreviewQuiz[] = []
  previewSampleSize = 10
  editorController = new AppEditorController()

  private _snackbar = appProvider.snackbar
  private _router = appProvider.router
  private _auth = appProvider.authStore
  private _api = appProvider.api

  constructor() {
    //
  }

  @action.bound changeLearnToEarnInfo(property: string, value: string | boolean) {
    this.learnToEarn = set(this.learnToEarn, property, value)
  }

  @action changeStep(step: number) {
    this.step = step
  }

  @action.bound getQuizLength(value: number) {
    this.quizLength = value
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
    const learningInformation = this.editorController.content
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
    return quiz
  }

  async getMissionSetting() {
    const { canRepeat, correctAnswersPerQuiz } = this.learnToEarn.setting!
    const questionsPerQuiz = parseInt(this.learnToEarn.setting!.questionsPerQuiz!)
    let passingCriteria = 1.0
    if (questionsPerQuiz && correctAnswersPerQuiz) {
      passingCriteria = round(+correctAnswersPerQuiz / +questionsPerQuiz, 2)
    }
    const quizId = await this.getQuizId()
    return {
      quiz: [
        {
          type: 'quiz',
          quizId: quizId,
          passingCriteria: passingCriteria,
          questionsPerQuiz: questionsPerQuiz,
          canRepeat: canRepeat,
        },
      ],
    }
  }

  async getMissionModel(setting: Data, missionInfo: MissionInfo, pool: VotingPool) {
    const status = 'upcomming'
    const { website, ...socialLinks } = get(pool, 'data.socialLinks')
    // const rewardAmount = this.rewardPerMission._value
    const maxParticipants = toNumber(missionInfo.maxParticipants)
    const maxPriorityParticipants = 0
    const priorityRewardAmount = '0'
    const coverImage = await this.getImageSource(missionInfo.missionCover!)
    const optTokenDecimal = pool.data?.optionalRewardTokenDecimals
    const optTokenAddress = pool.data?.optionalTokenAddress
    const optTokenLogo = pool.data?.optionalTokenLogo
    // const optTokenBasePrice = this.tokenBasePrice

    const mission: Mission = {
      ownerAddress: this._auth.attachedAddress,
      // rewardAmount,
      maxParticipants,
      maxPriorityParticipants,
      priorityRewardAmount,
      // tokenBasePrice: optTokenBasePrice,
      startTime: missionInfo.startDate,
      endTime: missionInfo.endDate,
      name: missionInfo.name,
      chainId: pool.chain,
      type: MissionType.LEARN,
      poolId: pool.id,
      data: setting,
      status,
      optionalTokens: EMPTY_ARRAY,
      metadata: {
        shortDescription: missionInfo.shortDescription,
        projectLogo: pool.data?.projectLogo,
        coverImage,
        caption: missionInfo.shortDescription,
        decimals: toNumber(optTokenDecimal),
        // rewardToken: this.tokenName,
        tokenLogo: optTokenLogo,
        tokenContractAddress: optTokenAddress,
        socialLinks: socialLinks || EMPTY_ARRAY,
        website: website || '#',
      },
    }
    return mission
  }

  @asyncAction *submit() {
    try {
      this.btnLoading = true

      const { canRepeat, correctAnswersPerQuiz, questionsPerQuiz } = this.learnToEarn.setting!
      if (parseInt(questionsPerQuiz!) < parseInt(correctAnswersPerQuiz || questionsPerQuiz!)) {
        this._snackbar.commonError('Correct answer need to be equal or smaller than question per quiz')
        return
      }

      if (parseInt(questionsPerQuiz!) > this.quizLength) {
        this._snackbar.commonError('Question per quiz need to be equal or smaller than total question of quiz')
        return
      }

      const missionSetting = yield this.getMissionSetting()
      const model = yield this.getMissionModel(missionSetting, this.missionInfo, this.pool)
      //
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

  /**
   * Process file and return JSON data of preview quiz
   */
  @asyncAction *prepareQuizPreview() {
    if (!this.learnToEarn.setting?.quizFile) return false
    const res = yield getPreviewFromQuizFile(this.learnToEarn.setting.quizFile)
    this.previewQuiz = sampleSize(res, 10)
  }

  @asyncAction *getData() {
    const missionSetting = yield this.getMissionSetting()
    console.log(missionSetting)

    return missionSetting
  }
}
