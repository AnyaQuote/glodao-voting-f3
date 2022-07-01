import { set } from 'lodash-es'
import { action, observable } from 'mobx'

const totalIatStep = 3
export class NewInAppTrialViewModel {
  @observable loading = false
  @observable step = 2
  @observable unlocked = 2

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
      if (nextStep <= totalIatStep) {
        this.step = nextStep
        this.unlocked = nextStep
      }
    }
  }

  @action.bound updateAppInfo(property, value) {
    this.iatInfo = set(this.iatInfo, property, value)
  }

  @action.bound createInAppTrialMission() {
    //
  }
}

interface InAppTrialModel {
  screenShots?: File[] | null
}
