import { appProvider } from '@/app-providers'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { RoutePaths } from '@/router'
import { isEmpty } from 'lodash-es'
import { observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class MissionDetailViewModel {
  @observable mission: Mission = {}
  @observable pool: VotingPool = {}
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
      const pools = yield this._api.voting.find<VotingPool>({ unicodeName }, { _limit: 1 })
      if (isEmpty(pools)) {
        this._router.replace(RoutePaths.not_found)
      }
      this.pool = pools[0]

      const missions = yield this._api.tasks.find<Mission>({ poolId: this.pool.id, id: missionId }, { _limit: 1 })
      if (isEmpty(missions)) {
        this._router.replace(RoutePaths.not_found)
      }
      this.mission = missions[0]
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }
}
