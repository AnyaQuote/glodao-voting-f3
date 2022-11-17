import { apiService } from '@/services/api-service'
import { action, computed, observable, reaction, runInAction } from 'mobx'
import moment from 'moment'
import { timer } from 'rxjs'
import VueRouter from 'vue-router'
import { snackController } from './components/snack-bar/snack-bar-controller'
import { authStore } from '@/stores/auth-store'
import { localData } from '@/stores/local-data'
import { walletStore } from '@/stores/wallet-store'
import EventBus from './plugins/event-bus'

export let appProvider: AppProvider
export class AppProvider {
  router!: VueRouter
  api = apiService
  snackbar = snackController
  localData = localData
  authStore = authStore
  wallet = walletStore

  @observable lightmode = localData.lightmode
  @observable currentTime = moment()

  constructor(router: VueRouter) {
    this.router = router
    appProvider = this
    reaction(
      () => this.lightmode,
      (mode) => (localData.lightmode = mode),
      { fireImmediately: true }
    )
    timer(0, 5000).subscribe(() => {
      runInAction(() => {
        this.currentTime = moment().milliseconds(0)
        EventBus.$emit('subscribe-time', this.currentTime)
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
