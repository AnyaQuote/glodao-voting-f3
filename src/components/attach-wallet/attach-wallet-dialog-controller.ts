import { appProvider } from '@/app-providers'
import { walletStore } from '@/stores/wallet-store'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class AttachWalletDialogController {
  @observable show = false
  @observable isUpdating = false

  _resolver?: (args: any) => void

  @action.bound open() {
    this.show = true
    return new Promise((resolve) => (this._resolver = resolve))
  }

  @action.bound close() {
    this._resolver && this._resolver(null)
    this.show = false
  }

  @asyncAction *setAddress() {
    try {
      //   this.isUpdating = true

      const res = yield appProvider.authStore.saveAttachWallet(this.connectedAddress)

      if (res) {
        this._resolver && this._resolver(res)
        appProvider.snackbar.addSuccess()
      }
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      //   this.isUpdating = false
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
