import { appProvider } from '@/app-providers'
import { URL_ENDPOINT } from '@/constants'
import { promiseHelper } from '@/helpers/promise-helper'
import { action, observable } from 'mobx'

interface Config {
  canClose?: boolean
  message?: string
}

const defaultConfig = {
  canClose: true,
  message: '',
}

export class TwitterLoginDialogController {
  @observable show = false
  @observable isProcessing = false
  @observable config: Config = defaultConfig

  @observable resolver?: (args: any) => void

  @action open(config?: Config) {
    this.config = { ...this.config, ...(config || {}) }
    this.show = true
    return new Promise((resolve) => (this.resolver = resolve))
  }

  @action.bound close() {
    this.resolver && this.resolver(null)
    if (!this.isProcessing) {
      this.config = defaultConfig
      this.show = false
    }
  }

  @action.bound async handleTwitterLogin() {
    this.isProcessing = true

    const twitterLoginPage = `${URL_ENDPOINT}connect/twitter`
    window.open(twitterLoginPage, '_blank')

    // Watch values in local storage real time using interval
    // This help letting dialog know when will the login process finished
    // by watching localStorage value being populated
    const res = await promiseHelper.waitForLocalStorage()

    appProvider.authStore.changeJwt(res[0])
    appProvider.authStore.changeUser(res[1])

    this.isProcessing = false
    this.resolver && this.resolver('loggedIn')
  }
}

export const twitterLoginDialogController = new TwitterLoginDialogController()
