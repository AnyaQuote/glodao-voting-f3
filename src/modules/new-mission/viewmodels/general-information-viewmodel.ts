import { ProjectInfo } from '@/models/VotingModel'
import { action, observable } from 'mobx'
import { set } from 'lodash'
import moment from 'moment'

export class GeneralInformationViewModel {
  @observable projectInfo: ProjectInfo = {}
  @observable currentTime = moment()
  @action.bound changeProjectInfo(property: string, value: any) {
    if (property === 'projectDates') {
      this.projectInfo = { ...this.projectInfo, startDate: value[0], endDate: value[1] }
    }

    this.projectInfo = set(this.projectInfo, property, value)
  }
  @action getData() {
    return this.projectInfo
  }
}
