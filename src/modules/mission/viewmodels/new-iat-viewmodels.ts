import { appProvider } from '@/app-providers'
import { TOTAL_IN_APP_TRIAL_STEP } from '@/constants'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { IatInfoProp, InAppTrialMission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { get, isEmpty, set } from 'lodash-es'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class NewInAppTrialViewModel {
  @observable loading = false
  @observable step = 3
  @observable unlocked = 3

  @observable iatInfo: InAppTrialMission = {}
  @observable pool: VotingPool = {}

  private _auth = appProvider.authStore
  private _api = appProvider.api
  private _snackbar = appProvider.snackbar
  private _router = appProvider.router

  constructor(unicodeName: string) {
    this.loadPageData(unicodeName)
    //
  }

  @asyncAction *loadPageData(unicodeName: string) {
    try {
      this.loading = true

      waitForGlobalLoadingFinished()

      const pools = yield this._api.voting.find({ unicodeName }, { _limit: 1 })

      if (isEmpty(pools)) {
        this._router.replace(RouteName.NOT_FOUND)
      }

      this.pool = pools[0]
    } catch (error) {
      this._snackbar.commonError(error)
    } finally {
      this.loading = false
    }
    //
  }

  /**
   * Change step to provided value
   * If no value is provided, increase step
   * Step is unchange if next step larger than unlocked
   * @param value value of next step
   */
  @action.bound changeStep(value?: number) {
    if (value) {
      if (value <= this.unlocked) {
        this.step = value
      }
    } else {
      const nextStep = this.step + 1
      if (nextStep <= TOTAL_IN_APP_TRIAL_STEP) {
        this.step = nextStep
        this.unlocked = nextStep
      }
    }
  }

  /**
   * Update property of iatInfo object
   * @param property property name of iatInfo object
   * @param value value to assign
   */
  @action.bound updateIatInfo(property: IatInfoProp, value: any) {
    this.iatInfo = set(this.iatInfo, property, value)
  }

  @action async createInAppTrialMission() {
    //
  }

  @computed get tokenName() {
    return '$HWD'
  }

  @computed get projectReward() {
    return '10000000'
  }

  @computed get remainingMission() {
    return '2/5'
  }

  @computed get personalReward() {
    return '100'
  }

  @computed get remainingProjectReward() {
    return '100'
  }

  // ======== IN APP TRIAL MISSION INFO START ========

  @computed get missionReward() {
    return get(this.iatInfo, 'missionReward', EMPTY_STRING)
  }

  @computed get maxParticipants() {
    return get(this.iatInfo, 'maxParticipants', EMPTY_STRING)
  }

  @computed get missionStartDate() {
    return get(this.iatInfo, 'startDate', EMPTY_STRING)
  }

  @computed get missionEndDate() {
    return get(this.iatInfo, 'endDate', EMPTY_STRING)
  }

  @computed get projectEndDate() {
    return get(this.pool, 'endDate', EMPTY_STRING)
  }

  @computed get projectStartDate() {
    return get(this.pool, 'startDate', EMPTY_STRING)
  }

  // ======== IN APP TRIAL MISSION INFO END ========

  // ======== IN APP TRIAL APP INFO START ==========

  @computed get appTitle() {
    return get(this.iatInfo, 'appTitle', EMPTY_STRING)
  }

  @computed get appLogo() {
    return get(this.iatInfo, 'appLogo', NULL)
  }

  @computed get appStoreLink() {
    return get(this.iatInfo, 'appStoreLink', EMPTY_STRING)
  }

  @computed get chPlayLink() {
    return get(this.iatInfo, 'chPlayLink', EMPTY_STRING)
  }

  @computed get appDescription() {
    return get(this.iatInfo, 'appDescription', EMPTY_STRING)
  }

  @computed get appScreenShots() {
    return get(this.iatInfo, 'screenShots', NULL)
  }

  // ======== IN APP TRIAL APP INFO END ============

  @computed get taskSetting() {
    return get(this.iatInfo, 'tasks', EMPTY_ARRAY)
  }
}

const EMPTY_STRING = ''
const NULL = null
const EMPTY_ARRAY = []
