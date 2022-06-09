import { URL_ENDPOINT } from '@/constants'
import { localdata } from '@/helpers/local-data'
import { delay } from 'lodash-es'
import { action, observable } from 'mobx'

interface Config {
  canClose?: boolean
}

const defaultConfig = {
  canClose: false,
}

export class TwitterLoginDialogController {
  @observable show = false
  @observable isProcessing = false
  @observable config = defaultConfig

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
    const intervalId = await new Promise<NodeJS.Timer>((resolve) => {
      const id = setInterval(() => {
        // Resolve promise with populated local storage value
        if (localdata.jwt && localdata.user) {
          resolve(id)
        }
      }, 1000)
    })

    clearInterval(intervalId)
    this.isProcessing = false
    this.show = false

    // Perfom current tab
    delay(() => {
      location.reload()
    }, 500)
  }
}

export const twitterLoginDialogController = new TwitterLoginDialogController()
