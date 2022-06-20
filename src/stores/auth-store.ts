import { twitterLoginDialogController } from '@/components/twitter-login/twitter-login-dialog-controller'
import { SUCCESS_STATUS } from '@/constants'
import { localdata } from '@/helpers/local-data'
import { promiseHelper } from '@/helpers/promise-helper'
import { User } from '@/models/UserModel'
import router, { RoutePaths } from '@/router'
import { apiService } from '@/services/api-service'
import jwtDecode from 'jwt-decode'
import { get, isEmpty } from 'lodash-es'
import { action, computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class AuthStore {
  @observable jwt = ''
  @observable user: User = {}

  constructor() {
    if (localdata.jwt) this.changeJwt(localdata.jwt)
    if (localdata.user) this.changeUser(localdata.user)
  }

  @action.bound changeJwt(value: string) {
    this.jwt = value
    localdata.jwt = value
  }

  @action.bound changeUser(user: any) {
    this.user = user
    localdata.user = user
  }

  @action.bound resetJwt() {
    this.jwt = ''
  }

  @action.bound resetUser() {
    this.user = {}
  }

  @action clearLocalStorage() {
    localdata.resetAuth()
  }

  @action logout() {
    this.resetJwt()
    this.resetUser()
    localdata.resetAuth()

    router.push(RoutePaths.voting_list)
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

  /**
   * Get user data and jwt from twitter access code and secret
   * @param access_token access token retrieved from twitter login api
   * @param access_secret  access secret retrieved from twitter login api
   * @returns 'success', else throw if error
   */
  @asyncAction *fetchUser(access_token: string, access_secret: string) {
    if (!access_token || !access_secret) {
      throw new Error('Invalid access code. Please try again.')
    }
    let [err, res] = yield promiseHelper.handle(
      apiService.fetchUser(access_token, access_secret, localdata.referralCode)
    )
    if (err) throw err

    let user = res.user
    const jwt = res.jwt
    if (isEmpty(user.projectOwner)) {
      ;[err, res] = yield promiseHelper.handle(apiService.users.findOne(user.id, jwt))
      if (err) throw err
      else user = res
    }

    this.changeJwt(jwt)
    this.changeUser(user)
    localdata.referralCode = ''

    return SUCCESS_STATUS
  }

  @asyncAction *checkJwtExpiration() {
    const { exp } = jwtDecode(this.jwt) as any
    const isExpired = Date.now() >= exp * 1000
    if (isExpired) {
      const res = yield twitterLoginDialogController.open({
        message: 'Your Token has expired. Please sign in to continue.',
        canClose: false,
      })
      if (res) {
        twitterLoginDialogController.close()
      }
    }
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
    return SUCCESS_STATUS
  }

  @computed get attachedAddress() {
    return get(this.user, 'projectOwner.address', '')
  }
}
export const authStore = new AuthStore()
