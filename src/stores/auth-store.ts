import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { localdata } from '@/helpers/local-data'
import router from '@/router'
import { apiService } from '@/services/api-service'
import jwtDecode from 'jwt-decode'
import { get, isEmpty, isArray } from 'lodash-es'
import { action, computed, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'
import { walletStore } from './wallet-store'
import { promiseHelper } from '@/helpers/promise-helper'

export class AuthStore {
  @observable attachWalletDialog = false
  @observable walletDialogInput = ''
  @observable isWalletUpdating = false
  @observable twitterLoginDialog = false
  @observable isLoggingInTwitter = false
  @observable jwt = ''
  @observable user: any = {}

  constructor() {
    if (localdata.jwt) this.changeJwt(localdata.jwt)
    if (localdata.user) this.changeUser(localdata.user)
    reaction(
      () => walletStore.account,
      () => this.logout
    )
  }

  @action.bound changeAttachWalletDialog(value: boolean) {
    if (!value && !this.user.hunter.address) {
      snackController.error('You need to set your main wallet')
      return
    }
    this.attachWalletDialog = value
  }
  @action.bound changeWalletDialogInput(value: string) {
    this.walletDialogInput = value
  }
  @asyncAction *saveAttachWallet() {
    //
  }

  @action.bound changeJwt(value: string) {
    this.jwt = value
    localdata.jwt = value
  }
  @action.bound resetJwt() {
    this.jwt = ''
  }
  @action.bound changeUser(user: any) {
    this.user = user
    localdata.user = user
    if (this.user.id && !get(user, 'hunter.address', '')) this.changeAttachWalletDialog(true)
  }
  @action.bound resetUser() {
    this.user = {}
  }

  @action logout() {
    try {
      this.resetJwt()
      this.resetUser()
      localdata.resetAuth()
    } catch (error) {
      snackController.commonError(error)
    }
  }

  @asyncAction *login() {
    if (!this.isAuthenticated && walletStore.account) {
      walletStore.resetJwt()
      let error,
        result
        // ---- Check if an user existed ----
      ;[error, result] = yield promiseHelper.handle(apiService.users.find({ username: walletStore.account }))

      // ---- If no user found, sign up for new user ----
      if (!error && isEmpty(result)) {
        ;[error, result] = yield promiseHelper.handle(apiService.signUp(walletStore.account))
      } else if (error) {
        throw error
      }

      const user = isArray(result) ? get(result, '[0]') : result

      // ---- Generate a signature for the new user ----
      let signature
      ;[error, result] = yield promiseHelper.handle(
        this.signMessage(walletStore.account, walletStore.chainType, user?.nonce, walletStore.selectedAdapter)
      )
      if (result) {
        signature = result
      } else {
        throw error
      }
      // ---- With given signature, perform login the user ----
      ;[error, result] = yield promiseHelper.handle(
        apiService.signIn({
          publicAddress: walletStore.account,
          signature,
        })
      )

      if (result) {
        this.changeUser(get(result, 'user'))
        this.changeJwt(get(result, 'jwt'))
      } else {
        throw error
      }
    }
  }

  @asyncAction *signMessage(account, chainType, nonce, selectedAdapter: any = null) {
    if (!account) return ''
    const message = `GloDAO wants to: \n Sign message with account \n ${account} - One time nonce: ${nonce}`
    const data = new TextEncoder().encode(message)
    if (chainType === 'sol') {
      //solana sign message
    } else {
      //bsc sign message
      if (typeof window === 'undefined') {
        return ''
      }
      if (window.ethereum) {
        const request = { method: 'personal_sign', params: [message, account] }
        return yield window.ethereum.request(request)
      } else {
        throw new Error('Plugin Metamask is not installed!')
      }
    }
  }

  @action checkJwtExpiration() {
    const { exp } = jwtDecode(this.jwt) as any
    const isExpired = Date.now() >= exp * 1000
    if (isExpired) {
      this.logout()
      snackController.commonError('Your session has expired! Please log in')
      this.login()
    }
  }

  @computed get isAuthenticated() {
    return !!this.jwt
  }

  @computed get username() {
    return this.user.username
  }
}
export const authStore = new AuthStore()
