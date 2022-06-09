import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { localdata } from '@/helpers/local-data'
import { promiseHelper } from '@/helpers/promise-helper'
import router, { RoutePaths } from '@/router'
import { apiService } from '@/services/api-service'
import jwtDecode from 'jwt-decode'
import { get, isEmpty } from 'lodash-es'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class AuthStore {
  @observable attachWalletDialog = false
  @observable isWalletUpdating = false
  @observable twitterLoginDialog = false
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
      router.go(-1)
    } catch (error) {
      snackController.commonError(error)
      router.push(RoutePaths.not_found)
    }
  }

  @asyncAction checkJwtExpiration() {
    const { exp } = jwtDecode(this.jwt) as any
    const isExpired = Date.now() >= exp * 1000
    if (isExpired) {
      this.logout()
      // Cons: if user is in any form pages.
      // This login will redirect the user to new page,
      // resulting in the user has to do the form again
      this.changeTwitterLoginDialog(true)
    }
  }

  @asyncAction checkEmptyJwt() {
    if (isEmpty(this.jwt)) {
      this.changeTwitterLoginDialog(true)
    }
  }

  @action.bound changeUser(user: any) {
    this.user = user
    localdata.user = user
    // if (this.user.id && !get(user, 'projectOwner.address', '')) this.changeAttachWalletDialog(true)
  }

  @asyncAction *saveAttachWallet(addressInput: string) {
    let [err, res] = yield promiseHelper.handle(
      this.signMessage(addressInput, 'bsc', get(this.user, 'projectOwner.nonce', 0))
    )

    if (err) throw err

    const signature = res
    ;[err, res] = yield promiseHelper.handle(
      apiService.updateProjectOwnerAddress(addressInput, signature, 'bsc', get(this.user, 'projectOwner.id', ''))
    )

    if (err) throw err

    this.changeUser({ ...this.user, projectOwner: res })
    return 'success'
  }

  // @action.bound changeAttachWalletDialog(value: boolean) {
  //   if (!value && !this.user.projectOwner.address) {
  //     snackController.error('You need to set your main wallet')
  //     return
  //   }
  //   this.attachWalletDialog = value
  // }

  @action.bound changeTwitterLoginDialog(value: boolean) {
    this.twitterLoginDialog = value
  }

  @computed get isAuthenticated() {
    return !!this.jwt
  }

  @computed get userAvatar() {
    return this.user.avatar || ''
  }

  @computed get ownerAttachedAddress() {
    return this.user.projectOwner.address || ''
  }
}
export const authStore = new AuthStore()
