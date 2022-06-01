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
import { loginController } from '@/components/login-dialog/login-dialog-controller'

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
  }

  @action.bound changeJwt(value: string) {
    this.jwt = value
    localdata.jwt = value
  }
  @action.bound resetJwt() {
    this.jwt = ''
  }
  @action.bound resetUser() {
    this.user = {}
  }

  @action logout() {
    this.resetJwt()
    this.resetUser()
    localdata.resetAuth()
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
      return 'success'
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

  @asyncAction *fetchUser(access_token: string, access_secret: string) {
    try {
      const res = yield apiService.fetchUser(access_token, access_secret, localdata.referralCode)
      let user = res.user
      const jwt = res.jwt
      if (!user.projectOwner) {
        user = yield apiService.users.findOne(user.id, jwt)
      }
      this.changeJwt(jwt)
      this.changeUser(user)
      this.changeTwitterLoginDialog(false)
      localdata.referralCode = ''
    } catch (error) {
      snackController.error(get(error, 'response.data.message', '') || (error as string))
    } finally {
      router.push('/voting').catch(() => {
        //
      })
    }
  }

  @asyncAction *checkJwtExpiration() {
    const { exp } = jwtDecode(this.jwt) as any
    const isExpired = Date.now() >= exp * 1000
    if (isExpired) {
      this.logout()
      const res = yield loginController.open({ message: 'Your session has expired. Please login to continue.' })
      if (res) {
        loginController.close()
      }
    }
  }

  @asyncAction *checkEmptyJwt() {
    if (isEmpty(this.jwt)) {
      const res = yield loginController.open({
        message: 'This step requires authentication. Please sign in to continue.',
      })
      if (res) {
        loginController.close()
      }
    }
  }

  @action.bound changeUser(user: any) {
    this.user = user
    localdata.user = user
    if (this.user.id && !get(user, 'projectOwner.address', '')) this.changeAttachWalletDialog(true)
  }

  @action.bound changeWalletDialogInput(value: string) {
    this.walletDialogInput = value
  }

  @asyncAction *saveAttachWallet() {
    try {
      this.isWalletUpdating = true
      const signature = yield this.signMessage(walletStore.account, 'bsc', get(this.user, 'projectOwner.nonce', 0))
      const updatedProjectOwner = yield apiService.updateProjectOwnerAddress(
        walletStore.account,
        signature,
        'bsc',
        get(this.user, 'projectOwner.id', '')
      )
      this.changeUser({ ...this.user, projectOwner: updatedProjectOwner })
      snackController.updateSuccess()
      this.changeAttachWalletDialog(false)
    } catch (error) {
      console.error(error)
      snackController.error(get(error, 'response.data.message', '') || get(error, 'message', '') || (error as string))
    } finally {
      this.isWalletUpdating = false
    }
  }

  @action.bound changeAttachWalletDialog(value: boolean) {
    if (!value && !this.user.projectOwner.address) {
      snackController.error('You need to set your main wallet')
      return
    }
    this.attachWalletDialog = value
  }

  @action.bound changeTwitterLoginDialog(value: boolean) {
    this.twitterLoginDialog = value
  }

  @computed get isAuthenticated() {
    return !!this.jwt
  }

  @computed get username() {
    return this.user.username
  }
}
export const authStore = new AuthStore()
