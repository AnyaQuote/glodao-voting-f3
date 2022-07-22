import { loadingController } from '@/components/global-loading/global-loading-controller'
import { ERROR_MSG_LOGIN_TIMEOUT, ERROR_MSG_TIMEOUT, TIME_OUT_SETTING } from '@/constants'
import { walletStore } from '@/stores/wallet-store'
import { isEmpty } from 'lodash-es'
import { localdata } from './local-data'

const TEMP_TIMEOUT = 15000

export const promiseHelper = {
  delay: (miniseconds: number) => new Promise((resolve) => setTimeout(resolve, miniseconds)),
  handle: (promise: any) => promise.then((res) => [undefined, res]).catch((err) => [err, undefined]),
}

/**
 * Watch the change in local storage
 * Use to notify dialog when sign in completed
 * @param delay miliseconds to repeat checking interval
 * @returns resolve localdata or reject when timeout
 */
export const waitForLocalStorage = (delay = 1000) =>
  new Promise<Array<any>>((resolve, reject) => {
    const startTime = new Date().getTime()

    const intervalId = setInterval(() => {
      if (localdata.jwt && !isEmpty(localdata.user)) {
        clearInterval(intervalId)
        resolve([localdata.jwt, localdata.user])
      }

      // Time out when reach 15 seconds
      if (new Date().getTime() - startTime > TEMP_TIMEOUT) {
        clearInterval(intervalId)
        reject(ERROR_MSG_LOGIN_TIMEOUT)
      }
    }, delay)
  })

/**
 * Watch for wallet account
 * If wallet account continue to be empty, re-call function after 30ms timeout
 * Use to wait for wallet account value when browser reload
 * @param delay miliseconds to repeat checking interval
 * @returns resolved wallet account or reject when timeout
 */
export const waitForWalletAccount = (delay = 200) =>
  new Promise<string>((resolve, reject) => {
    const startTime = new Date().getTime()

    const intervalId = setInterval(() => {
      if (walletStore.account) {
        clearInterval(intervalId)
        resolve(walletStore.account)
      }

      if (new Date().getTime() - startTime > TIME_OUT_SETTING) {
        clearInterval(intervalId)
        reject(ERROR_MSG_TIMEOUT)
      }
    }, delay)
  })

/**
 * Wait until loading controller stops requesting
 * @param delay miliseconds to repeat checking interval
 * @returns resolve as loading has stop or reject when process is timeout
 */
export const waitForGlobalLoadingFinished = (delay = 500) =>
  new Promise<string | void>((resolve, reject) => {
    const intervalId = setInterval(() => {
      const startTime = new Date().getTime()

      if (!loadingController.requesting) {
        clearInterval(intervalId)
        resolve()
      }

      if (new Date().getTime() - startTime > TIME_OUT_SETTING) {
        clearInterval(intervalId)
        reject(ERROR_MSG_TIMEOUT)
      }
    }, delay)
  })
