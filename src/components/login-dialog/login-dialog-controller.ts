import { action, IReactionDisposer, observable, computed, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { walletStore } from '@/stores/wallet-store'
import { snackController } from '../snack-bar/snack-bar-controller'
import { authStore } from '@/stores/auth-store'

interface DialogConfig {
  message?: string
  hideClose?: boolean
}

const defaultConfig = {
  message: '',
  hideClose: true,
}

export class LoginDialogController {
  @observable config: DialogConfig = defaultConfig
  @observable show = false
  @observable loading = false
  @observable address = ''

  @observable resolver?: (value: any) => void

  _disposer: IReactionDisposer

  constructor() {
    // Because UI cannot keep up account data, must reaction to follow its update
    this._disposer = reaction(
      () => walletStore.account,
      (account) => {
        if (account) this.address = account
      }
    )
  }

  destroy() {
    this._disposer()
  }

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

  @action open(config: DialogConfig = defaultConfig) {
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
}

export const loginController = new LoginDialogController()
