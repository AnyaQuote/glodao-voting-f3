import { action, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { walletStore } from '@/stores/wallet-store'
import { snackController } from '../snack-bar/snack-bar-controller'
import { authStore } from '@/stores/auth-store'

interface DialogConfig {
  message?: string
}

export class LoginDialogController {
  @observable config: DialogConfig = {
    message: '',
  }
  @observable show = false
  @observable loading = false
  wallet = walletStore;

  @asyncAction *signAndLogin() {
    let res
    try {
      this.loading = true
      res = yield authStore.login()
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.loading = false
      if (res) this.close()
    }
  }

  @action.bound confirm() {
    this.signAndLogin()
  }

  @action.bound open(config?: DialogConfig) {
    this.config = { ...this.config, ...config }
    this.show = true
  }

  @action.bound close() {
    if (!this.loading) this.show = false
  }
}

export const loginController = new LoginDialogController()
