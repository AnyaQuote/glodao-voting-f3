import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { localdata } from '@/helpers/local-data'
import router from '@/router'
import { apiService } from '@/services/api-service'
import jwtDecode from 'jwt-decode'
import { get } from 'lodash-es'
import { action, computed, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import moment from 'moment'
import { walletStore } from './wallet-store'

export class AuthStore {
  @observable attachWalletDialog = false
  @observable walletDialogInput = ''
  @observable isWalletUpdating = false
  @observable twitterLoginDialog = false
  @observable isLoggingInTwitter = false
  @observable jwt = ''
  @observable user: any = {}

  constructor() {
    //
    if (localdata.jwt) this.changeJwt(localdata.jwt)
    if (localdata.user) this.changeUser(localdata.user)
    if (this.jwt) {
      const { exp } = jwtDecode(this.jwt) as any
      const isExpire = Date.now() >= exp * 1000
      // If the token has expired
      if (isExpire) {
        this.logout()
        snackController.error('Your session has expired! Please log in')
      }
    }

    reaction(
      () => walletStore.account,
      () => {
        this.resetJwt()
        this.resetUser()
        localdata.resetUser()
      }
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
  @asyncAction *getUserData() {
    try {
      const res = yield apiService.users.findOne(this.user.id, this.jwt)
      this.changeUser(res)
    } catch (error) {
      snackController.error('Fail to get user data')
    }
  }
  @action.bound resetWalletDialogInput() {
    this.walletDialogInput = ''
  }
  @action.bound changeTwitterLoginDialog(value: boolean) {
    this.twitterLoginDialog = value
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

  @asyncAction *fetchUser(access_token: string, access_secret: string) {
    try {
      const res = yield apiService.fetchUser(access_token, access_secret, localdata.referralCode)
      let user = res.user
      const jwt = res.jwt
      if (!user.hunter) {
        user = yield apiService.users.findOne(user.id, jwt)
      }
      this.changeJwt(jwt)
      this.changeUser(user)
      this.changeTwitterLoginDialog(false)
      localdata.referralCode = ''
    } catch (error) {
      snackController.error(get(error, 'response.data.message', '') || (error as string))
    } finally {
      router.push('/bounty').catch(() => {
        //
      })
    }
  }

  @asyncAction *logout() {
    try {
      yield router.push('/bounty').catch(() => {
        //
      })
      this.resetJwt()
      this.resetUser()
      localdata.resetUser()
    } catch (error) {
      snackController.error(error as string)
    }
  }

  @asyncAction *signMessage(wallet, chainType, nonce, selectedAdapter: any = null) {
    if (!wallet) return ''
    const message = `GloDAO wants to: \n Sign message with account \n ${wallet} - One time nonce: ${nonce}`
    // const data = new TextEncoder().encode(message)
    if (chainType === 'sol') {
      //solana sign message
      // const a = (selectedAdapter || this.selectedAdapter) as any
      // let res
      // if (a.signMessage) {
      //   res = yield a.signMessage(data)
      // } else {
      //   res = yield a._wallet.signMessage(data)
      // }
      // return Object.values(res?.signature || res)
    } else {
      //bsc sign message
      if (typeof window === 'undefined') {
        return ''
      }
      if (window.ethereum) {
        const request = { method: 'personal_sign', params: [message, wallet] }
        return yield window.ethereum.request(request)
      } else {
        throw new Error('Plugin Metamask is not installed!')
      }
    }
  }

  @computed get accountAge() {
    if (!this.user?.twitterCreatedTime) return 0
    else return moment().diff(moment(this.user.twitterCreatedTime), 'days')
  }

  @computed get registeredWallet() {
    return get(this.user, 'hunter.address', '')
  }

  @computed get userRole() {
    return get(this.user, 'role.type', 'public')
  }

  @computed get hunterId() {
    return get(this.user, 'hunter.id', '')
  }
}

export const authStore = new AuthStore()
