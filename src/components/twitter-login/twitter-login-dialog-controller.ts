import { appProvider } from '@/app-providers'
import { URL_ENDPOINT } from '@/constants'
import { promiseHelper } from '@/helpers/promise-helper'
import { RoutePaths } from '@/router'
import { delay } from 'lodash-es'
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

  @action.bound open(config?: Config) {
    this.config = { ...this.config, ...(config || {}) }
    this.show = true
  }

  @action.bound close() {
    this.config = defaultConfig
    this.show = false
  }

  @action.bound async handleTwitterLogin() {
    this.isProcessing = true

    const twitterLoginPage = `${URL_ENDPOINT}connect/twitter`
    window.open(twitterLoginPage, '_blank')

    // Watch values in local storage real time using interval
    // This help letting dialog know when will the login process finished
    // by watching localStorage value being populated
    await promiseHelper.waitForLocalStorage()

    this.isProcessing = false
    this.show = false

    // Perfom current tab reload
    delay(() => {
      location.reload()
    }, 200)
  }
}

export const twitterLoginDialogController = new TwitterLoginDialogController()
