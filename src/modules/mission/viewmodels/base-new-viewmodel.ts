import { appProvider } from '@/app-providers'
import { EMPTY_OBJECT, EMPTY_STRING, HUNDRED, Zero } from '@/constants'
import { MissionInfo } from '@/models/QuizModel'
import { VotingPool } from '@/models/VotingModel'
import { RouteName } from '@/router'
import { FixedNumber } from '@ethersproject/bignumber'
import { get, isEmpty, set, toNumber } from 'lodash-es'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class BaseNewMissionViewModel {
  @observable loading = false
  @observable btnLoading = false

  @observable step = 1
  @observable unlocked = 1

  @observable pool: VotingPool = EMPTY_OBJECT
  @observable appliedMission = 0
  @observable missionInfo: MissionInfo = EMPTY_OBJECT

  auth = appProvider.authStore
  api = appProvider.api
  snackbar = appProvider.snackbar
  router = appProvider.router

  constructor(unicodeName: string) {
    this.loadPageData(unicodeName)
  }

  @asyncAction *loadPageData(unicodeName: string) {
    try {
      this.loading = true
      const pools = yield this.api.voting.find(
        {
          unicodeName,
          projectOwner: this.auth.projectOwnerId,
        },
        { _limit: 1 }
      )
      if (isEmpty(pools)) {
        this.router.replace(RouteName.NOT_FOUND)
      }
      this.pool = pools[0]
      const appliedMission = yield this.api.tasks.count({
        votingPool: this.pool.id,
      })
      this.appliedMission = toNumber(appliedMission)
    } catch (error) {
      this.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @asyncAction *submit() {
    //
  }

  @action.bound changeMissionInfo(property: string, value: any) {
    if (property === 'missionDates') {
      this.missionInfo = { ...this.missionInfo, startDate: value[0], endDate: value[1] }
      return
    }
    if (property === 'priorityRatio' && value === '0') {
      this.missionInfo = { ...this.missionInfo, maxPriorityParticipants: '0' }
    }
    this.missionInfo = set(this.missionInfo, property, value)
  }
  ƒ

  @action changeStep(step: number) {
    this.step = step
  }

  goBack() {
    this.router.go(-1)
  }

  @computed get priorityAmount() {
    if (!this.missionInfo.priorityRatio) {
      return Zero
    }
    try {
      const fxPriorityRatio = FixedNumber.from(this.missionInfo.priorityRatio).divUnsafe(HUNDRED)
      return this.rewardPerMission.mulUnsafe(fxPriorityRatio)
    } catch (_) {
      return Zero
    }
  }

  @computed get communityAmount() {
    const roundedValue = parseFloat(this.priorityAmount._value).toFixed(2)
    const fxRoundedValue = FixedNumber.from(roundedValue)
    return this.rewardPerMission.subUnsafe(fxRoundedValue)
  }

  @computed get personalReward() {
    try {
      return this.priorityAmount.divUnsafe(FixedNumber.from(this.missionInfo.maxPriorityParticipants))
    } catch (_) {
      return Zero
    }
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
