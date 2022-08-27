import { EMPTY_STRING, EMPTY_ARRAY } from '@/constants/index'
import { promiseHelper } from '@/helpers/promise-helper'
import { appProvider } from '@/app-providers'
import { DisplayIatData, Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { action, computed, observable } from 'mobx'
import { get, isEmpty, find } from 'lodash-es'
import { RouteName } from '@/router'
import { APIKey, ReferenceTask } from '@/models/ApiKeyModel'
import { asyncAction } from 'mobx-utils'
import { exportToCsvAndDownload } from '@/helpers/file-helper'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import moment from 'moment'

export class InAppTrialDetailViewModel {
  @observable loading = false

  @observable mission: Mission = {}
  @observable pool: VotingPool = {}
  @observable apiKey: APIKey = {}
  @observable loading_button = false

  private _auth = appProvider.authStore
  private _snackbar = appProvider.snackbar
  private _api = appProvider.api
  private _router = appProvider.router

  constructor(unicodeName: string, missionId: string) {
    this.loadPageData(unicodeName, missionId)
  }

  @action async export(type: string) {
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
        exportToCsvAndDownload(data, this.mission.name!)
      }
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.loading_button = false
    }
  }

  @action async loadPageData(unicodeName: string, missionId: string) {
    try {
      this.loading = true

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

  @computed get webAppLink() {
    return get(this.mission, 'metadata.webUrl', EMPTY_STRING)
  }

  @computed get isWebApp() {
    return !!this.webAppLink
  }

  // ==================== IAT APP SETTING START =======================
  @computed get missionTaskSetting() {
    const tasks = get(this.mission, 'data.iat', EMPTY_ARRAY)
    const mappedData: DisplayIatData[] = tasks.map((task, index) => {
      const fullApiUrl = `${process.env.VUE_APP_API_STRAPI_ENDPOINT}tasks/updateInAppTrial?api_key=${this.apiKey.key}&secret_key=${this.apiKey.secret}`
      const displayApiUrl = `${process.env.VUE_APP_API_STRAPI_ENDPOINT}tasks/updateInAppTrial?api_key="API_KEY"&secret_key="SECRET_KEY"`
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

  @computed get taskDescription() {
    return get(this.mission, 'metadata.taskDescription', EMPTY_STRING)
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
      { divider: true },
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
      { divider: true },
      {
        active: false,
        name: this.missionName,
      },
    ]
  }
}
