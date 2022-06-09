import { promiseHelper } from '@/helpers/promise-helper'
import { authStore } from '@/stores/auth-store'
import { walletStore } from '@/stores/wallet-store'
import { action, computed, observable } from 'mobx'
import { snackController } from '../snack-bar/snack-bar-controller'

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

  @action.bound async shouldOpenOnValidation() {
    // User hasn't attached any wallet yet
    if (!this.attachedAddress) {
      this.config.message = 'Please set your main wallet to continue.'
      this.show = true
      return
    }

    // Incase browser reload, wait for the wallet until its value is reassigned again
    await promiseHelper.waitForWalletAccount()

    // User connected to a wallet that is different from previous attached wallet
    if (this.attachedAddress !== this.connectedAddress) {
      this.config.message = 'Different wallet account detected. Update your main wallet to continue.'
      this.show = true
    }
  }

  @action.bound open(config: Config) {
    this.config = { ...this.config, ...config }
    this.show = true
  }

  @action.bound close() {
    this.config = defaultConfig
    this.show = false
  }

  @action.bound async setAddress() {
    try {
      this.isUpdating = true
      const res = await authStore.saveAttachWallet(walletStore.account)
      if (res) {
        snackController.updateSuccess()
        this.close()
      }
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.isUpdating = false
    }
  }

  @computed get attachedAddress() {
    return authStore.user.projectOwner?.address || ''
  }

  @computed get userAvatar() {
    return authStore.user.avatar
  }

  @computed get connectedAddress() {
    return walletStore.account
  }
}

export const attachWalletDialogController = new AttachWalletDialogController()
