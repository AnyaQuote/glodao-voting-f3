import { appProvider } from '@/app-providers'
import { Mission } from '@/models/MissionModel'
import { VotingPool } from '@/models/VotingModel'
import { observable } from 'mobx'

export class InAppTrialDetailViewModel {
  @observable loading = false

  @observable mission: Mission = {}
  @observable pool: VotingPool = {}

  private _auth = appProvider.authStore
  private _snackbar = appProvider.snackbar
  private _api = appProvider.api
  private _router = appProvider.router

  constructor(unicodeName: string, missionId: string) {
    //
  }
}
