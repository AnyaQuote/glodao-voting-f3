import { appProvider } from '@/app-providers'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { Zero } from '@/constants'
import { exportToCsvAndDownload } from '@/helpers/file-helper'
import { promiseHelper } from '@/helpers/promise-helper'
import { Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { FixedNumber } from '@ethersproject/bignumber'
import { isEmpty, find, has, get, toNumber } from 'lodash-es'
import { action, computed, observable, toJS } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'
import { IDetailViewmodel } from './base-detail-viewmodel'

export class SocialMissionDetailViewModel implements IDetailViewmodel {
  @observable mission: Mission = {}
  @observable pool: VotingPool = {}
  @observable loading = false
  @observable loading_button = false

  private _snackbar = appProvider.snackbar
  private _api = appProvider.api
  private _router = appProvider.router
  private _auth = appProvider.authStore

  constructor(unicodeName: string, missionId: string) {
    this.fetchMissionDetail(unicodeName, missionId)
  }

  @action async export(type: string, sendReward = false) {
    const start = moment()
    const missionEnd = moment(this.mission.endTime)
    if (start.isBefore(missionEnd) && type === 'reward') {
      snackController.commonError('Can not export file csv because the mission has not been over yet')
      return
    }
    try {
      this.loading_button = true
      let data
      if (type === 'user') {
        data = await this._api.getTaskUserReport(this.mission.id!, 'user')
        exportToCsvAndDownload(data, this.mission.name!)
      } else {
        data = await this._api.getTaskUserReport(this.mission.id!, 'rewards')
        console.log(data)
        if (!sendReward) exportToCsvAndDownload(data, this.mission.name!)
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
      const pools = yield this._api.voting.find<VotingPool>({ unicodeName }, { _limit: 1 })
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
      console.log(toJS(this.pool), toJS(this.mission))
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
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

  // For social missionf
  @computed get priorityPoolParticipants() {
    const maxPriorityParticipants = toNumber(get(this.mission, 'maxPriorityParticipants', 0))
    if (maxPriorityParticipants > this.totalParticipants) {
      return this.totalParticipants
    } else {
      return maxPriorityParticipants
    }
  }

  // For social mission
  @computed get communityPoolParticipants() {
    return this.totalParticipants > 0 ? this.totalParticipants - this.priorityPoolParticipants : 0
  }
}
