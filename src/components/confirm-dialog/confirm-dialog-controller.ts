import { action, observable } from 'mobx'
import _ from 'lodash'
import { actionAsync } from 'mobx-utils'

export interface ConfirmDialogConfig {
  content?: string
  title?: string
  doneText?: string
  cancelText?: string
  hideCancel?: boolean
  hideDone?: boolean
  doneCallback?: any
  cancelCallback?: any
}

export class ConfirmDialogController {
  @observable config: ConfirmDialogConfig = {
    hideCancel: false,
    hideDone: false,
    doneText: 'Done',
    cancelText: 'Cancel',
  }
  @observable dialog = false
  private resolver?: (args: any) => void

  @action.bound done() {
    if (this.config.doneCallback) this.config.doneCallback()
    this.dialog = false
    if (this.resolver) this.resolver(true)
  }
  @action.bound cancel() {
    if (this.config.cancelCallback) this.config.cancelCallback()
    this.dialog = false
    if (this.resolver) this.resolver(false)
  }
  @action.bound confirm(config) {
    this.config = { ...this.config, ...config }
    this.dialog = true
  }

  @action.bound openAsync(config) {
    this.config = { ...this.config, ...config }
    this.dialog = true
    return new Promise((resolve) => (this.resolver = resolve))
  }
}

export const confirmDialogController = new ConfirmDialogController()
