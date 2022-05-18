import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { apiService } from '@/services/api-service'
import { walletStore } from '@/stores/wallet-store'
import { authStore } from '@/stores/auth-store'
import { Subject } from 'rxjs'

export class NewProjectViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()
  @observable jwt = ''
  @observable loading = false

  constructor() {
    this.loadData()
    this._disposers = [
      reaction(
        () => walletStore.account,
        () => {
          //
        }
      ),
    ]
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  async loadData() {
    //
  }

  @asyncAction *login() {
    if (!this.isLogin && walletStore.account) {
      this.loading = true
      walletStore.resetJwt()
      let getUser: any = []
      try {
        getUser = yield apiService.users.find({ username: walletStore.account }, { _limit: 1 }) || []
      } catch (e) {
        //
      }
      let user = getUser[0]
      if (!user) {
        user = yield apiService.users.signUp(walletStore.account)
      }

      let signature
      try {
        signature = yield this.signMessage(
          walletStore.account,
          walletStore.chainType,
          user?.nonce,
          walletStore.selectedAdapter
        )
      } catch (e) {
        snackController.commonError(e)
      }
      if (!signature) {
        this.loading = false
        return
      }

      try {
        const res = yield apiService.users.signIn({
          publicAddress: walletStore.account,
          signature,
        })
        if (res) {
          this.jwt = res.jwt
          authStore.changeJwt(res.jwt)
        }
      } catch (e) {
        snackController.commonError(e)
      }

      this.loading = false
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

  @computed get isLogin() {
    return !!this.jwt
  }
}
