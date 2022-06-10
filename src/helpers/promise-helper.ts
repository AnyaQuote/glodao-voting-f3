import { ERROR_MSG_LOGIN_TIMEOUT, ERROR_MSG_TIMEOUT, TIME_OUT_SETTING } from '@/constants'
import { walletStore } from '@/stores/wallet-store'
import { isEmpty } from 'lodash-es'
import { localdata } from './local-data'

export const promiseHelper = {
  delay: (miniseconds: number) => new Promise((resolve) => setTimeout(resolve, miniseconds)),
  handle: (promise: any) => promise.then((res) => [undefined, res]).catch((err) => [err, undefined]),
}

/**
 * Watch the change in local storage
 * Use to notify dialog when sign in completed
 * @returns resolve localdata or reject when timeout
 */
export const waitForLocalStorage = () =>
  new Promise<Array<any>>((resolve, reject) => {
    const startTime = new Date().getTime()

    const intervalId = setInterval(() => {
      if (localdata.jwt && !isEmpty(localdata.user)) {
        clearInterval(intervalId)
        resolve([localdata.jwt, localdata.user])
      }

      // Time out when reach 10 seconds
      if (new Date().getTime() - startTime > TIME_OUT_SETTING) {
        clearInterval(intervalId)
        reject(ERROR_MSG_LOGIN_TIMEOUT)
      }
    }, 1000)
  })

/**
 * Watch for wallet account
 * If wallet account continue to be empty, re-call function after 30ms timeout
 * Use to wait for wallet account value when browser reload
 * @returns resolved wallet account or reject when timeout
 */
export const waitForWalletAccount = () =>
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
    }, 200)
  })
