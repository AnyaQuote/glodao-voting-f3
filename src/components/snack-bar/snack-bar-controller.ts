import _ from 'lodash'
import { action, observable } from 'mobx'

export interface SnakBarConfig {
  icon?: string
  message?: string
  color?: string
  timeout?: number
}

export class SnackBarController {
  @observable config: SnakBarConfig = {
    timeout: 5000,
  }
  @observable show = false

  @action commonError(err: any) {
    let message
    if (err && typeof err === 'string') message = err
    else {
      message = err?.message || err?.msg || 'Please try again'
    }
    // strapi error
    const apiError = _.get(err, 'response.data.message')
    console.error(apiError, err)
    if (apiError) {
      if (apiError instanceof Array) {
        let errMsg = _.first(apiError)
        if (errMsg) errMsg = errMsg.messages
        if (errMsg) errMsg = _.first(errMsg)
        if (errMsg) errMsg = errMsg.message
        if (errMsg) message = errMsg
      } else if (apiError instanceof String || typeof apiError === 'string') {
        message = apiError as string
      }
    }
    this.error(message)
  }

  @action blockchainError(err: any) {
    this.error(err.msg || err.message || err)
  }

  @action success(message: string) {
    this.config = {
      icon: 'check_circle',
      message,
      color: 'success',
      timeout: 4000,
    }
    this.show = true
  }

  @action addSuccess() {
    this.success('Insert successfully')
  }

  @action updateSuccess() {
    this.success('Update successfully')
  }

  @action deleteSuccess() {
    this.success('Delete successfully')
  }

  @action error(message: string) {
    this.config = {
      icon: 'error',
      message,
      color: 'error',
      timeout: 5000,
    }
    this.show = true
  }

  @action close() {
    this.show = false
  }
}

export const snackController = new SnackBarController()
