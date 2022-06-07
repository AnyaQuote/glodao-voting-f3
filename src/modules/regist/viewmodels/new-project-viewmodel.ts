import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { walletStore } from '@/stores/wallet-store'
import { authStore } from '@/stores/auth-store'
import { Subject } from 'rxjs'

export class NewProjectViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()
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

  @asyncAction signAndLogin() {
    try {
      this.loading = true
    } catch (error) {
      console.error(error)
      snackController.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @computed get isLoggedIn() {
    return authStore.isAuthenticated
  }
}
