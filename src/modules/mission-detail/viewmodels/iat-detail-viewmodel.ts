import { API_ENDPOINT } from '@/constants/index'
import { EMPTY_STRING, EMPTY_ARRAY } from '@/constants/index'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { appProvider } from '@/app-providers'
import { DisplayIatData, Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { action, computed, observable } from 'mobx'
import { get, isEmpty, find } from 'lodash-es'
import { RouteName } from '@/router'
import { APIKey, ReferenceTask } from '@/models/ApiKeyModel'

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

  @action.bound async copyToClipboard(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      this._snackbar.success('Copied')
    } catch (error) {
      this._snackbar.error('Cannot copy')
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
    return get(this.mission, 'metadata.googlePlayUrl', EMPTY_STRING)
  }

  @computed get googlePlayLink() {
    return get(this.mission, 'metadata.appStoreUrl', EMPTY_STRING)
  }

  // ==================== IAT APP SETTING START =======================
  @computed get missionTaskSetting() {
    const tasks = get(this.mission, 'data.iat', EMPTY_ARRAY)
    const mappedData: DisplayIatData[] = tasks.map((task, index) => {
      const fullApiUrl = `${API_ENDPOINT}tasks/updateInAppTrial?api_key=${this.apiKey.key}&secret_key=${this.apiKey.secret}`
      const displayApiUrl = `${API_ENDPOINT}tasks/updateInAppTrial?api_key="API_KEY"&secret_key="SECRET_KEY"`
      return {
        step: index + 1,
        fullApiUrl,
        displayApiUrl,
        ...task,
      }
    })
    return mappedData
  }

  @computed get taskCode() {
    const myTask = find(this.apiKey.tasks, (item: any) => item.id === this.mission.id)
    return get(myTask, 'code', 'undefined')
  }

  @computed get api_key() {
    return get(this.apiKey, 'key', EMPTY_STRING)
  }

  @computed get secret_key() {
    return get(this.apiKey, 'secret', EMPTY_STRING)
  }
  // ==================== IAT APP SETTING END =========================

  @computed get missionAppDescription() {
    return get(this.mission, 'metadata.shortDescription', EMPTY_STRING)
  }

  @computed get missionAppScreenshots() {
    return get(this.mission, 'metadata.screenshots', EMPTY_ARRAY)
  }

  @computed get breadcrumbData() {
    return [
      {
        active: true,
        name: 'Your project',
        onCallback: () => {
          this._router.push({ name: RouteName.PROJECT_LIST })
        },
      },
      {
        active: true,
        name: get(this.pool, 'projectName', EMPTY_STRING),
        onCallback: () => {
          this._router.push({
            name: RouteName.PROJECT_DETAIL,
            params: { unicodename: get(this.pool, 'unicodeName', EMPTY_STRING) },
          })
        },
      },
      {
        active: false,
        name: this.missionName,
      },
    ]
  }
}
