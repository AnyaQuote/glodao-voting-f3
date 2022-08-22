import { appProvider } from '@/app-providers'
import { Zero } from '@/constants'
import { Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { FixedNumber } from '@ethersproject/bignumber'
import { isEmpty, find, has, get, toNumber } from 'lodash-es'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class SocialMissionDetailViewModel {
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

  @asyncAction *export() {
    this.loading_button = true
    yield this.delay(2000)
    this.loading_button = false
  }
  delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

  // For social mission
  @computed get priorityPoolParticipants() {
    return toNumber(get(this.mission, 'maxPriorityParticipants', 0))
  }

  // For social mission
  @computed get communityPoolParticipants() {
    return this.totalParticipants > 0 ? this.totalParticipants - this.priorityPoolParticipants : 0
  }
}
