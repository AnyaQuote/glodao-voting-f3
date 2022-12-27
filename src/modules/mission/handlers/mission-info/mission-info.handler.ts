import { action, computed, observable } from 'mobx'
import { HandlerName, HandlerType, IBaseHandler } from '../base.handler'
import { VotingPool } from '@/models/VotingModel'
import { EMPTY_OBJECT, EMPTY_STRING, HUNDRED, Zero } from '@/constants'
import { MissionInfo } from '@/models/QuizModel'
import { get, set } from 'lodash-es'
import { FixedNumber } from '@ethersproject/bignumber'

export class MissionInfoHandler implements IBaseHandler {
  type: HandlerType = HandlerType.missionInfo
  name: HandlerName = HandlerName.missionInfo

  @observable valid = false

  @observable pool: VotingPool = EMPTY_OBJECT
  @observable appliedMission = 0
  @observable missionInfo: MissionInfo = EMPTY_OBJECT

  constructor(pool, appliedMission) {
    this.pool = pool
    this.appliedMission = appliedMission
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

  getData() {
    throw new Error('Method not implemented.')
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
