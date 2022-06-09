import { walletStore } from '@/stores/wallet-store'
import { localdata } from './local-data'

export const promiseHelper = {
  delay: (miniseconds: number) => new Promise((resolve) => setTimeout(resolve, miniseconds)),
  handle: (promise: any) => promise.then((res) => [undefined, res]).catch((err) => [err, undefined]),
  waitForLocalStorage: () =>
    new Promise<void>((resolve) => {
      ;(function checkLocalStorage() {
        if (localdata.jwt && localdata.user) resolve()
        else setTimeout(checkLocalStorage, 1000)
      })()
    }),
  waitForWalletAccount: () =>
    new Promise<void>((resolve) => {
      ;(function checkWalletAccount() {
        if (walletStore.account) resolve()
        else setTimeout(checkWalletAccount, 30)
      })()
    }),
}
