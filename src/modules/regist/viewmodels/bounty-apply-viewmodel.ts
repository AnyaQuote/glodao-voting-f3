import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { apiService } from '@/services/api-service'
import { authStore } from '@/stores/auth-store'
import { walletStore } from '@/stores/wallet-store'
import { action, computed, IReactionDisposer, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { Subject, timer } from 'rxjs'

export class BountyApplyViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable userInfo: any = undefined
  @observable jwt = ''

  constructor() {
    this.loadData()
    this._disposers = [
      reaction(
        () => walletStore.account,
        () => {
          this.loadData()
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
    // await this.login()
  }

  @asyncAction *login() {
    if (!this.isLogin && walletStore.account) {
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
      console.log('user: ', user)
      let signature
      try {
        signature = yield this.signMessage(
          walletStore.account,
          walletStore.chainType,
          user?.nonce,
          walletStore.selectedAdapter
        )
      } catch (e) {
        yield walletStore.disconnectAccount()
      }
      if (!signature) return

      try {
        const res = yield apiService.users.signIn({
          publicAddress: walletStore.account,
          signature,
        })
        if (res) {
          this.userInfo = res.user
          this.jwt = res.jwt
          authStore.changeJwt(res.jwt)
        }
      } catch (e) {
        snackController.commonError(e)
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

  //   @asyncAction *approve() {
  //     this.approving = true
  //     try {
  //       yield this.stakingHandler!.approveToken(walletStore.account)
  //       this.approved = true
  //     } catch (error: any) {
  //       snackController.error(error.message)
  //     }
  //     this.approving = false
  //   }

  @computed get isLogin() {
    return !!this.jwt
  }
}
