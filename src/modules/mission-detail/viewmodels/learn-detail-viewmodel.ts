import { appProvider } from '@/app-providers'
import { Mission } from '@/models/MissionModel'
import { PreviewQuiz, Quiz } from '@/models/QuizModel'
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { isEmpty, find, has, get, toNumber } from 'lodash-es'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { promiseHelper } from '@/helpers/promise-helper'
import { exportToCsvAndDownload } from '@/helpers/file-helper'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import moment from 'moment'

export class LearnMissionDetailViewModel {
  @observable mission: Mission = {}
  @observable pool: VotingPool = {}
  @observable quiz: Quiz = {}
  @observable loading = false
  @observable loading_button = false

  private _snackbar = appProvider.snackbar
  private _api = appProvider.api
  private _router = appProvider.router
  private _auth = appProvider.authStore

  constructor(unicodeName: string, missionId: string) {
    this.fetchMissionDetail(unicodeName, missionId)
  }

  @action async export(type: string) {
    const start = moment()
    const missionEnd = moment(this.mission.endTime)
    if (start.isBefore(missionEnd) && type == 'reward') {
      snackController.commonError('Can not export file csv because the mission has not been over yet')
      return
    }
    try {
      this.loading_button = true
      let data
      if (type == 'user') {
        data = await this._api.getTaskUserReport(this.mission.id!, 'user')
        exportToCsvAndDownload(data, this.mission.name!)
      } else {
        data = await this._api.getTaskUserReport(this.mission.id!, 'rewards')
        exportToCsvAndDownload(data, this.mission.name!)
      }
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.loading_button = false
    }
  }

  @asyncAction *fetchMissionDetail(unicodeName: string, missionId: string) {
    try {
      this.loading = true
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
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @computed get totalParticipants() {
    return toNumber(get(this.mission, 'totalParticipants', 0))
  }

  // For learn to earn mission
  @computed get combineQuizData(): PreviewQuiz[] {
    if (isEmpty(this.quiz.answer)) return []
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
