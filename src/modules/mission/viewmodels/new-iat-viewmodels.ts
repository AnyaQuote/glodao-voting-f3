import { TOTAL_IN_APP_TRIAL_STEP } from '@/constants'
import { set } from 'lodash-es'
import { action, observable } from 'mobx'

export class NewInAppTrialViewModel {
  @observable loading = false
  @observable step = 3
  @observable unlocked = 3

  @observable iatInfo: InAppTrialModel = {}

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
  @action.bound updateIatInfo(property: string, value: any) {
    this.iatInfo = set(this.iatInfo, property, value)
  }

  @action.bound createInAppTrialMission() {
    //
  }
}
interface InAppTrialModel {
  screenShots?: File[] | null
  tasks?: { name: string }[]
}
