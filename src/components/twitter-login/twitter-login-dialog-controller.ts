import { appProvider } from '@/app-providers'
import { SUCCESS_STATUS } from '@/constants'
import { waitForLocalStorage } from '@/helpers/promise-helper'

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
    try {
      this.isProcessing = true
      const redirectUrl = `${process.env.VUE_APP_WEB_HOST}/twitter-auth`
      const bountyLoginUrl = process.env.VUE_APP_BOUNTY_DOMAIN
      const URL = `${bountyLoginUrl}/twitter-login?callback_url=${redirectUrl}`
      window.open(URL, '_blank')
      appProvider.authStore.clearLocalStorage()
      const res = await waitForLocalStorage()
      appProvider.authStore.changeJwt(res[0])
      appProvider.authStore.changeUser(res[1])
      this.resolver && this.resolver(SUCCESS_STATUS)
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.isProcessing = false
    }
  }
}

export const twitterLoginDialogController = new TwitterLoginDialogController()
