import { EMPTY_STRING } from './../../../constants/index'
import { waitForGlobalLoadingFinished } from './../../../helpers/promise-helper'
import { appProvider } from '@/app-providers'
import { Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { action, computed, observable } from 'mobx'
import { get, isEmpty } from 'lodash-es'
import { RouteName } from '@/router'
import { APIKey } from '@/models/ApiKeyModel'

export class InAppTrialDetailViewModel {
  @observable loading = false

  @observable mission: Mission = {}
  @observable pool: VotingPool = {}
  @observable apiKey: APIKey = {}

  private _auth = appProvider.authStore
  private _snackbar = appProvider.snackbar
  private _api = appProvider.api
  private _router = appProvider.router

  constructor(unicodeName: string, missionId: string) {
    this.loadPageData(unicodeName, missionId)
  }

  @action async loadPageData(unicodeName: string, missionId: string) {
    try {
      this.loading = true
      await waitForGlobalLoadingFinished()
      // Get pool
      const pools = await this._api.voting.find<VotingPool>(
        { unicodeName, projectOwner: this._auth.projectOwnerId },
        { _limit: 1 }
      )
      if (isEmpty(pools)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.pool = pools[0]

      // Get mission
      const missions = await this._api.tasks.find<Mission>({ votingPool: this.pool.id, id: missionId }, { _limit: 1 })
      if (isEmpty(missions)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.mission = missions[0]

      // Get api key
      const apiKey = await this._api.apiKey.find<APIKey>({ projectOwner: this._auth.projectOwnerId }, { _limit: 1 })
      if (isEmpty(apiKey)) {
        this._router.replace({ name: RouteName.NOT_FOUND })
      }
      this.apiKey = apiKey[0]
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  // ==================== IAT MISSION INFO START ======================
  @computed get projectLogo() {
    return get(this.mission, 'metadata.projectLogo', EMPTY_STRING)
  }

  @computed get missionName() {
    return get(this.mission, 'name', EMPTY_STRING)
  }

  @computed get missionStartDate() {
    return get(this.mission, 'startTime', EMPTY_STRING)
  }

  @computed get missionEndDate() {
    return get(this.mission, 'endTime', EMPTY_STRING)
  }

  @computed get missionAppLogo() {
    return get(this.mission, 'metadata.coverImage', EMPTY_STRING)
  }

  @computed get missionReward() {
    return get(this.mission, 'rewardAmount', EMPTY_STRING)
  }

  @computed get missionTokenName() {
    return get(this.mission, 'metadata.rewardToken', EMPTY_STRING)
  }
  // ==================== IAT MISSION INFO END ========================

  @computed get appStoreLink() {
    return get(this.mission, 'metadata.appStoreLink', EMPTY_STRING)
  }

  @computed get googlePlayLink() {
    return get(this.mission, 'metadata.googlePlay', EMPTY_STRING)
  }

  // ==================== IAT MISSION INFO END ========================
  // ==================== IAT MISSION INFO END ========================
}
