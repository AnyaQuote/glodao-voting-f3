import { action, IReactionDisposer, observable, computed } from 'mobx'
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

  @observable resolver?: (value: any) => void;

  @asyncAction *signAndLogin() {
    try {
      this.loading = true
      const res = yield authStore.login()
      this.resolver && this.resolver(res)
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @action.bound confirm() {
    this.signAndLogin()
  }

  @action open(config?: DialogConfig) {
    this.config = { ...this.config, ...config }
    this.show = true
    return new Promise((resolve) => (this.resolver = resolve))
  }

  @action.bound close() {
    if (!this.loading) {
      this.show = false
      this.resolver && this.resolver(null)
    }
  }

  @computed get account() {
    return walletStore.account
  }
}

export const loginController = new LoginDialogController()
