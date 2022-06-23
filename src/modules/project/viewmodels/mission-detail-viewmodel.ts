import { appProvider } from '@/app-providers'
import { Zero } from '@/constants'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { Mission } from '@/models/MissionModel'
import { PreviewQuiz, Quiz } from '@/models/QuizModel'
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { FixedNumber } from '@ethersproject/bignumber'
import { isEmpty, find, has, get, toNumber } from 'lodash-es'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class MissionDetailViewModel {
  @observable mission: Mission = {}
  @observable pool: VotingPool = {}
  @observable quiz: Quiz = {}
  @observable loading = false

  private _snackbar = appProvider.snackbar
  private _api = appProvider.api
  private _router = appProvider.router

  constructor(unicodeName: string, missionId: string) {
    this.fetchMissionDetail(unicodeName, missionId)
  }

  @asyncAction *fetchMissionDetail(unicodeName: string, missionId: string) {
    try {
      this.loading = true
      yield waitForGlobalLoadingFinished()
      // Get pool
      const pools = yield this._api.voting.find<VotingPool>({ unicodeName }, { _limit: 1 })
      if (isEmpty(pools)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.pool = pools[0]

      // Get mission
      const missions = yield this._api.tasks.find<Mission>({ poolId: this.pool.id, id: missionId }, { _limit: 1 })
      if (isEmpty(missions)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.mission = missions[0]

      // If mission is learn to earn, get quiz
      if (this.isLearnToEarnMission) {
        const id = get(this.mission, 'data.quiz.quizId', '')
        const quizzes = yield this._api.quizzes.find({ id }, { _limit: 1 })
        if (isEmpty(quizzes)) {
          this._router.replace({ name: RouteName.NOT_FOUND })
        }
        this.quiz = quizzes[0]
        console.log('this.quiz', this.quiz.answer)
      }
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @computed get isLearnToEarnMission() {
    return has(this.mission, 'data.quiz')
  }

  // For social mission
  @computed get communityAmount() {
    try {
      const fxRewardAmount = FixedNumber.from(this.mission.rewardAmount)
      const fxPriortyAmount = FixedNumber.from(this.mission.priorityRewardAmount)
      return fxRewardAmount.subUnsafe(fxPriortyAmount)
    } catch (_) {
      return Zero
    }
  }

  @computed get totalParticipants() {
    return toNumber(get(this.mission, 'totalParticipants', 0))
  }

  // For social mission
  @computed get priorityPoolParticipants() {
    return toNumber(get(this.mission, 'maxPriorityParticipants', 0))
  }

  // For social mission
  @computed get communityPoolParticipants() {
    return this.totalParticipants > 0 ? this.totalParticipants - this.priorityPoolParticipants : 0
  }

  // For learn to earn mission
  @computed get combineQuizData(): PreviewQuiz[] {
    if (!this.isLearnToEarnMission || isEmpty(this.quiz.answer)) return []
    const combinedData = this.quiz.data!.map((item) => {
      const found = find(this.quiz.answer, (answer) => answer.id === item.id)!
      return {
        id: item.id,
        question: item.question,
        choices: item.data,
        answer: found.answer,
      }
    })
    return combinedData
  }
}
