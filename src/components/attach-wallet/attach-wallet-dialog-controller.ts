import { appProvider } from '@/app-providers'
import { authStore } from '@/stores/auth-store'
import { walletStore } from '@/stores/wallet-store'
import { action, computed, observable, reaction } from 'mobx'

interface Config {
  message?: string
  canClose?: boolean
}

const defaultConfig = {
  message: '',
  canClose: false,
}

export class AttachWalletDialogController {
  @observable show = false
  @observable isUpdating = false
  @observable config = defaultConfig

  @action.bound shouldOpen() {
    // Wait for wallet account value not empty
    // And compare previous attached wallet
    // with current connected wallet
    const disposer = reaction(
      () => this.connectedAddress,
      (value) => {
        if (value && authStore.user.projectOwner.address !== value) {
          this.config.message = 'Different wallet account detected. Please set your main wallet.'
          this.show = true
          disposer()
        }
      }
    )
  }

  @action.bound open(config: Config) {
    this.config = { ...this.config, ...config }
    this.show = true
  }

  @action.bound close() {
    this.show = false
  }

  @action.bound async setAddress() {
    try {
      this.isUpdating = true

      const res = await appProvider.authStore.saveAttachWallet(this.connectedAddress)

      if (res) {
        appProvider.snackbar.updateSuccess()
        this.close()
      }
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.isUpdating = false
    }
  }

  @computed get authUser() {
    return appProvider.authStore.user.avatar || ''
  }

  @computed get connectedAddress() {
    return walletStore.account
  }
}

export const attachWalletDialogController = new AttachWalletDialogController()
