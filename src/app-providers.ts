import { apiService } from '@/services/api-service'
import { action, computed, observable, reaction, runInAction } from 'mobx'
import moment from 'moment'
import { timer } from 'rxjs'
import VueRouter from 'vue-router'
import { localData } from './stores/local-data'
import { walletStore } from './stores/wallet-store'

export class AppProvider {
  router!: VueRouter
  api = apiService
  wallet = walletStore

  @observable lightmode = localData.lightmode
  @observable currentTime = moment()

  constructor() {
    reaction(
      () => this.lightmode,
      (mode) => (localData.lightmode = mode),
      { fireImmediately: true }
    )
    timer(0, 1000).subscribe(() => {
      runInAction(() => {
        this.currentTime = moment().milliseconds(0)
      })
    })
  }

  @action toggleLightMode($vuetify) {
    this.lightmode = !this.lightmode
    $vuetify.theme.dark = !this.lightmode
  }

  @computed get themeType() {
    return this.lightmode ? 'light' : 'dark'
  }
}

export const appProvider = new AppProvider()
