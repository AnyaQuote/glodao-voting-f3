import { ProjectInfo } from '@/models/VotingModel'
import { action, computed, observable } from 'mobx'
import { set, get } from 'lodash'
import moment from 'moment'
import { FixedNumber } from '@ethersproject/bignumber'
import { HUNDRED, Zero } from '@/constants'

export class GeneralInformationViewModel {
  @observable projectInfo: ProjectInfo = {}
  @observable currentTime = moment()
  @action changeProjectInfo(property: string, value: any) {
    if (property === 'projectDates') {
      this.projectInfo = { ...this.projectInfo, startDate: value[0], endDate: value[1] }
      return
    }

    this.projectInfo = set(this.projectInfo, property, value)
  }
  @action getData() {
    return this.projectInfo
  }

  @computed get priorityAmount() {
    if (!this.projectInfo.priorityRatio || !this.projectInfo.optionalRewardAmount) {
      return Zero
    }

    try {
      const fxPriorityRatio = FixedNumber.from(this.projectInfo.priorityRatio).divUnsafe(HUNDRED)
      const optionalRewardAmount = FixedNumber.from(this.projectInfo.optionalRewardAmount)
      return optionalRewardAmount.mulUnsafe(fxPriorityRatio)
    } catch (error) {
      return Zero
    }
  }

  @computed get communityAmount() {
    try {
      const roundedValue = parseFloat(this.priorityAmount._value).toFixed(2)
      const fxRoundedValue = FixedNumber.from(roundedValue)
      return FixedNumber.from(this.projectInfo?.optionalRewardAmount).subUnsafe(fxRoundedValue)
    } catch (error) {
      return Zero
    }
  }

  @computed get personalReward() {
    try {
      return this.priorityAmount.divUnsafe(FixedNumber.from(this.projectInfo.maxPriorityParticipants))
    } catch (_) {
      return Zero
    }
  }
}
