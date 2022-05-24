import { set } from 'lodash-es'
import { action, observable } from 'mobx'

const missionInfoDefault = {
  name: '',
  shortDescription: '',
  missionCover: '',
  priorityAmount: '',
  maxParticipants: '',
  startDate: {
    date: '',
    time: '',
  },
  endDate: {
    date: '',
    time: '',
  },
}

const missionSettingDefault = {
  twitter: [
    //
  ],
}

export class NewMissionViewModel {
  @observable missionInfo = missionInfoDefault
  @observable missonSetting = missionInfoDefault

  @action.bound changeMissionInfo(property: string, value: string) {
    set(this.missionInfo, property, value)
  }
  @action.bound updateMissionSetting(property, value) {
    //
  }
}
