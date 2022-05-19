import { apiService } from '@/services/api-service'
import { action, computed, observable, reaction, runInAction } from 'mobx'
import moment from 'moment'
import { timer } from 'rxjs'
import VueRouter from 'vue-router'
import { snackController } from './components/snack-bar/snack-bar-controller'
import { authStore } from '@/stores/auth-store'
import { localData } from '@/stores/local-data'
import { walletStore } from '@/stores/wallet-store'

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
    timer(0, 1000).subscribe(() => {
      runInAction(() => {
        // console.log('appProvider.currentTime::', this.currentTime.valueOf())
        // console.log('authStore.jwtExpireDate:::', this.authStore.jwtExpireDate)
        this.currentTime = moment().milliseconds(0)
      })
    })
    // reaction(
    //   () => this.isExpired,
    //   () => {
    //     authStore.logout()
    //   }
    // )
  }

  @action toggleLightMode($vuetify) {
    this.lightmode = !this.lightmode
    $vuetify.theme.dark = !this.lightmode
  }

  @computed get themeType() {
    return this.lightmode ? 'light' : 'dark'
  }

  // @computed get isExpired() {
  //   return this.currentTime.valueOf() > this.authStore.jwtExpiredDate
  // }
}
