import { appProvider } from '@/app-providers'
import { waitForWalletAccount } from '@/helpers/promise-helper'

import { action, computed, observable } from 'mobx'

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
    await waitForWalletAccount()

    // User connected to a wallet that is different from previous attached wallet
    if (this.attachedAddress !== this.connectedAddress) {
      this.config.message = 'Different wallet account detected. Update your main wallet to continue.'
      this.show = true
    }
  }

  @action.bound open(config?: Config) {
    this.config = { ...this.config, ...(config || {}) }
    this.show = true
  }

  @action.bound close() {
    if (!this.isUpdating) {
      this.config = defaultConfig
      this.show = false
    }
  }

  @action.bound async setAddress() {
    try {
      this.isUpdating = true
      const res = await appProvider.authStore.saveAttachWallet(appProvider.wallet.account)
      if (res) {
        appProvider.snackbar.updateSuccess()
        this.show = false
      }
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.isUpdating = false
    }
  }

  @computed get attachedAddress() {
    return appProvider.authStore.user.projectOwner?.address || ''
  }

  @computed get userAvatar() {
    return appProvider.authStore.user.avatar
  }

  @computed get connectedAddress() {
    return appProvider.wallet.account
  }
}

export const attachWalletDialogController = new AttachWalletDialogController()
