import { walletStore } from '@/stores/wallet-store'
import { localdata } from './local-data'

export const promiseHelper = {
  delay: (miniseconds: number) => new Promise((resolve) => setTimeout(resolve, miniseconds)),
  handle: (promise: any) => promise.then((res) => [undefined, res]).catch((err) => [err, undefined]),
  /**
   * Set interval to watch for localStorage changes
   * Use to notify when sign in with completed
   * @returns resolve promise
   */
  waitForLocalStorage: () =>
    new Promise<void>((resolve) => {
      ;(function checkLocalStorage() {
        if (localdata.jwt && localdata.user) resolve()
        else setTimeout(checkLocalStorage, 1000)
      })()
    }),
  /**
   * Recursion to watch for wallet account
   * If wallet account continue to be empty, re-call function after 30ms timeout
   * Use to wait for wallet account value when browser reload
   * @returns resolved promise
   */
  waitForWalletAccount: () =>
    new Promise<void>((resolve) => {
      ;(function checkWalletAccount() {
        if (walletStore.account) resolve()
        else setTimeout(checkWalletAccount, 30)
      })()
    }),
}
