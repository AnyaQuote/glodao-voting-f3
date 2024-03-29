import { appProvider } from '@/app-providers'
import {
  generateFileFromUrl,
  generateTextFileFromData,
  getApiFileUrl,
  getDataFromQuizFile,
  getPreviewFromQuizFile,
  getTextData,
} from '@/helpers/file-helper'
import { Data, MissionType } from '@/models/MissionModel'
import { Quiz, LearnToEarn, PreviewQuiz, MissionInfo } from '@/models/QuizModel'
import { Mission } from '@/models/MissionModel'
import { set, get, isEmpty, toNumber, sampleSize, find, merge, join } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import { VotingPool } from '@/models/VotingModel'
import { FixedNumber } from '@ethersproject/bignumber'
import { ALLOW_PASS_THROUGH, EMPTY_ARRAY, EMPTY_STRING, Zero } from '@/constants'
import { AppEditorController } from '@/components/editor/app-editor.controller'

export class EditLearnMissionViewModel {
  @observable step = 1

  @observable mission: Mission = {}
  @observable pool: VotingPool = {}
  @observable missionInfo: MissionInfo = {}
  @observable learnToEarn: LearnToEarn = {}
  @observable quiz: Quiz = {}
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

      // If mission is learn to earn, get quiz

      const taskTypeQuiz = find(get(this.mission, 'data.quiz', []), (task) => task.type === 'quiz')
      const id = get(taskTypeQuiz, 'quizId', '')
      const quiz = yield this._api.getOwnerQuiz(id)
      if (isEmpty(quiz)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.quiz = quiz

      this.missionInfo = {
        name: this.mission.name,
        shortDescription: this.mission.metadata?.shortDescription,
        // missionCover: this.mission.metadata?.projectLogo as any,
        priorityAmount: this.mission.priorityRewardAmount,
        maxParticipants: this.mission.maxParticipants?.toString(),
        maxPriorityParticipants: this.mission.maxPriorityParticipants?.toString(),
        startDate: this.mission.startTime,
        endDate: this.mission.endTime,
        type: this.mission.type,
        tokenBasePrice: this.mission.tokenBasePrice,
      }

      if (this.mission.metadata?.coverImage)
        this.missionInfo.missionCover = yield generateFileFromUrl(this.mission.metadata.coverImage)

      this.learnToEarn = {
        enabled: true,
        setting: {
          name: this.quiz.name,
          description: this.quiz.description,
        },
      }
      if (this.quiz.metadata?.coverImage)
        this.learnToEarn.setting!.imageCover = yield generateFileFromUrl(this.quiz.metadata?.coverImage)

      if (this.quiz.learningInformation) {
        // this.learnToEarn.setting!.learningFile = generateTextFileFromData(this.quiz.learningInformation, 'learning.txt')
        this.editorController.setContent(this.quiz.learningInformation)
      }

      this.generateQuizFile()
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.pageLoading = false
    }
  }

  generateQuizFile() {
    if (this.quiz.data && this.quiz.answer) {
      const res = merge(get(this.quiz, 'data'), get(this.quiz, 'answer'))?.map((r: any) =>
        join([r.question, ...r.data?.map((a) => a.text), r.answer], '|')
      )
      this.learnToEarn.setting!.quizFile = generateTextFileFromData(join(res, '\n'), 'quiz.txt')
    }
  }

  @action.bound changeMissionInfo(property: string, value: string) {
    if (property === 'missionDates') {
      this.missionInfo = { ...this.missionInfo, startDate: value[0], endDate: value[1] }
      return
    }
    this.missionInfo = set(this.missionInfo, property, value)
  }

  @action.bound changeLearnToEarnInfo(property: string, value: string | boolean) {
    this.learnToEarn = set(this.learnToEarn, property, value)
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
    const [res, _] = await Promise.all([
      await this._api.createQuiz({
        ownerAddress: this._auth.attachedAddress,
        ...quiz,
      }),
      await this._api.quizzes.delete(this.quiz.id),
    ])
    return res.id
  }

  async getMissionSetting() {
    const quizId = await this.getQuizId()
    return {
      quiz: [
        {
          type: 'quiz',
          quizId,
        },
      ],
    }
  }

  async getMissionModel(setting: Data, missionInfo: MissionInfo, pool: VotingPool) {
    const status = 'upcomming'
    const { website, ...socialLinks } = get(pool, 'data.socialLinks')
    const rewardAmount = this.rewardPerMission._value
    const maxParticipants = toNumber(missionInfo.maxParticipants)
    const maxPriorityParticipants = 0
    const priorityRewardAmount = '0'
    const coverImage = await this.getImageSource(missionInfo.missionCover!)
    const optTokenDecimal = pool.data?.optionalRewardTokenDecimals
    const optTokenAddress = pool.data?.optionalTokenAddress
    const optTokenLogo = pool.data?.optionalTokenLogo
    const optTokenBasePrice = this.tokenBasePrice

    const mission: Mission = {
      ownerAddress: this._auth.attachedAddress,
      rewardAmount,
      maxParticipants,
      maxPriorityParticipants,
      priorityRewardAmount,
      tokenBasePrice: optTokenBasePrice,
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
        rewardToken: this.tokenName,
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
      const missionSetting = yield this.getMissionSetting()
      const model = yield this.getMissionModel(missionSetting, this.missionInfo, this.pool)
      yield this._api.updateTask({ id: this.mission.id, ...model })
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
      return FixedNumber.from(this.pool?.data?.optionalRewardAmount).divUnsafe(
        FixedNumber.from(this.pool?.totalMission)
      )
    } catch (_) {
      return Zero
    }
  }

  @computed get tokenName() {
    return get(this.pool, 'data.optionalTokenName', '')
  }

  @computed get tokenBasePrice() {
    return get(this.missionInfo, 'tokenBasePrice', EMPTY_STRING)
  }

  @computed get tokenBAddress() {
    return this.pool.data?.optionalTokenAddress || EMPTY_STRING
  }

  @computed get tokenBName() {
    return this.pool.data?.optionalTokenName || EMPTY_STRING
  }
}
