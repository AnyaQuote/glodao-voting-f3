import {
  ERROR_MSG_DIFFERENT_WALLET_DETECTED,
  ERROR_MSG_MISSING_ATTACHED_WALLET,
  ERROR_MSG_NO_WALLET_CONNECTED,
  MSG_RELOAD_AFTER_UPDATE_SUCCESS,
  WALLET_ATTACHED_SUCCESSFUL,
  WALLET_CONNECTED_SUCCESSFUL,
} from '@/constants'
import { waitForGlobalLoadingFinished } from '@/helpers/promise-helper'
import { authStore } from '@/stores/auth-store'
import { walletStore } from '@/stores/wallet-store'
import { get } from 'lodash-es'
import { action, computed, IReactionDisposer, observable, reaction } from 'mobx'
import { snackController } from '../snack-bar/snack-bar-controller'

interface Config {
  message?: string
  canClose?: boolean
  allowSetter?: boolean
}

type Resolver = (args: any) => void

const defaultConfig = {
  message: '',
  canClose: false,
  allowSetter: true,
}

export class AttachWalletDialogController {
  @observable show = false
  @observable isUpdating = false
  @observable config = defaultConfig

  _disposer?: IReactionDisposer
  _resolver?: Resolver

  /**
   * Verify if wallet account is connected
   * This function should call before openToValidateWallet
   * See usage in router/index.ts
   * @returns void | resolved string
   */
  @action.bound async openToVerifyWalletConnected() {
    await waitForGlobalLoadingFinished()
    if (!this.connectedAddress) {
      this.prepareReaction()
      return this.open({ message: ERROR_MSG_NO_WALLET_CONNECTED, allowSetter: false }, true)
    }
  }

  /**
   * Validate connected wallet from metamask matched with project owner address in database
   * This function should called after openToVerifyWalletConnected is resolved
   * See usage in router/index.ts
   * @returns resolved string
   */
  @action.bound async openToValidateWallet() {
    // User hasn't attached any wallet yet
    if (!authStore.attachedAddress) {
      return this.open({ message: ERROR_MSG_MISSING_ATTACHED_WALLET, allowSetter: true }, true)
    }
    // User connected to a wallet that is different from previous attached wallet
    else if (authStore.attachedAddress !== this.connectedAddress) {
      return this.open({ message: ERROR_MSG_DIFFERENT_WALLET_DETECTED, allowSetter: false })
    }
    return WALLET_CONNECTED_SUCCESSFUL
  }

  disposeReaction() {
    this._disposer && this._disposer()
  }

  prepareReaction() {
    this._disposer = reaction(
      () => this.connectedAddress,
      (value) => {
        value && this._resolver && this._resolver(WALLET_CONNECTED_SUCCESSFUL)
      }
    )
  }

  @action revealCloseButton() {
    this.config.message = ''
    this.config.canClose = true
  }

  @action.bound open(config?: Config, isPromise = false) {
    this.config = { ...this.config, ...(config || {}) }
    !this.show && (this.show = true)
    if (isPromise) return new Promise<string>((resovle) => (this._resolver = resovle))
  }

  @action.bound close() {
    if (!this.isUpdating) {
      this.show = false
      this.config = defaultConfig
    }
  }

  @action.bound async setAddress() {
    try {
      this.isUpdating = true
      const res = await authStore.saveAttachWallet(this.connectedAddress)
      if (res) {
        snackController.success(MSG_RELOAD_AFTER_UPDATE_SUCCESS)
        this._resolver && this._resolver(WALLET_ATTACHED_SUCCESSFUL)
      }
    } catch (error) {
      snackController.commonError(error)
    } finally {
      this.isUpdating = false
    }
  }

  @computed get userAvatar() {
    return get(authStore.user, 'avatar', '')
  }

  @computed get connectedAddress() {
    return walletStore.account
  }
}

export const attachWalletDialogController = new AttachWalletDialogController()
