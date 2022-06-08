import { action, observable } from 'mobx'

export class TwitterLoginDialogController {
  @observable show = false

  _resolver?: (args: any) => void

  @action.bound open() {
    this.show = true
    // return new Promise((resolve) => (this._resolver = resolve))
  }

  @action.bound close() {
    // this._resolver && this._resolver(null)
    this.show = false
  }
}

export const twitterLoginDialogController = new TwitterLoginDialogController()
