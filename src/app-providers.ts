import { action } from 'mobx'
import VueRouter from 'vue-router'
import { walletStore } from './stores/wallet-store'

export class AppProvider {
  router!: VueRouter
  wallet = walletStore

  @action.bound setVueRouter(router: VueRouter) {
    this.router = router
  }
}

export const appProvider = new AppProvider()
