import { localdata } from './../helpers/local-data'
import { action, computed, observable, runInAction } from 'mobx'
import { actionAsync, asyncAction } from 'mobx-utils'
import Application from '@/libs/models'
import Web3 from 'web3'
import { Subscription, timer } from 'rxjs'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { Zero } from '@/constants'
import { FixedNumber } from '@ethersproject/bignumber'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { bnHelper } from '@/helpers/bignumber-helper'

export class WalletStore {
  ethereum: any = (window as any).ethereum

  app = new Application({ mainnet: false })
  @observable web3: Web3 | null = null
  @observable account = ''
  @observable bnbBalance = Zero
  @observable z9Balance = Zero
  @observable chainId = ''
  @observable loaded = false

  @observable navigationDrawer = false
  @observable isMetamask = false
  @observable mobileDialog = false

  LPTokenContract?: any
  private _bnbBalanceSubscription: Subscription | undefined

  constructor() {
    //
  }

  @asyncAction *getBnbBalance() {
    const result = yield this.web3?.eth.getBalance(this.account!)
    this.bnbBalance = FixedNumber.from(this.web3?.utils.fromWei(result, 'ether'))
  }
  @asyncAction *getUserLPBalance() {
    this.LPTokenContract = new (this.web3 as any).eth.Contract(
      require('@/helpers/erc20.abi.json'),
      process.env.VUE_APP_TOKEN_ADDRESS
    )
    const balance = yield this.LPTokenContract.methods.balanceOf(this.account!).call()
    this.z9Balance = bnHelper.fromDecimals(balance, 6)
  }

  @asyncAction *start() {
    try {
      this.app.start()
      this.isMetamask = this.app.isMetamask
      // this.web3 = this.app.web3
      if (yield this.app.getAddress()) {
        yield this.connect()
      }
    } catch (error) {
      console.error(error)
    }
    this.loaded = true
  }

  @asyncAction *connect() {
    loadingController.increaseRequest()
    try {
      const ok = yield this.app.login()
      this.web3 = this.app.web3
      if (ok) {
        this.web3 = this.app.web3
        this.chainId = yield this.web3!.eth.getChainId()
        this.account = yield this.app.getAddress()
        this.ethereum.removeListener('accountsChanged', this.ethereumConfigChanged)
        this.ethereum.removeListener('chainChanged', this.ethereumConfigChanged)
        this.ethereum.once('accountsChanged', this.ethereumConfigChanged)
        this.ethereum.once('chainChanged', this.ethereumConfigChanged)
        if (this.isChainIdValid) {
          // this.getBnbBalance()
          // this.getUserLPBalance()
        }
        this._bnbBalanceSubscription?.unsubscribe()
        this._bnbBalanceSubscription = timer(0, 5000).subscribe(() => {
          if (this.isChainIdValid) {
            // this.getBnbBalance()
            // this.getUserLPBalance()
          }
        })
      }
      return ok
    } catch (error) {
      error.message && snackController.error(error.message)
      return false
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @action.bound setNavigationDrawer(val) {
    this.navigationDrawer = val
  }

  @action.bound setMobileDialog(val) {
    this.mobileDialog = val
  }

  ethereumConfigChanged = () => {
    window.location.reload()
  }

  async switchNetwork(chainId: number) {
    if (this.connected) {
      try {
        await this.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(chainId) }]
        })
      } catch (error) {
        if (error.message.includes('wallet_addEthereumChain')) {
          if (chainId === Number(process.env.VUE_APP_CHAIN_ID)) {
            this.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: Web3.utils.toHex(chainId),
                  chainName: 'BSC Mainnet',
                  nativeCurrency: {
                    name: 'BSC',
                    symbol: 'BNB',
                    decimals: 18
                  },
                  rpcUrls: [
                    'https://bsc-dataseed1.binance.org',
                    'https://bsc-dataseed2.binance.org',
                    'https://bsc-dataseed3.binance.org',
                    'https://bsc-dataseed4.binance.org',
                    'https://bsc-dataseed1.defibit.io',
                    'https://bsc-dataseed2.defibit.io',
                    'https://bsc-dataseed3.defibit.io',
                    'https://bsc-dataseed4.defibit.io',
                    'https://bsc-dataseed1.ninicoin.io',
                    'https://bsc-dataseed2.ninicoin.io',
                    'https://bsc-dataseed3.ninicoin.io',
                    'https://bsc-dataseed4.ninicoin.io',
                    'wss://bsc-ws-node.nariox.org'
                  ],
                  blockExplorerUrls: ['https://bscscan.com']
                }
              ]
            })
          } else if (Number(process.env.VUE_APP_CHAIN_ID)) {
            this.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: Web3.utils.toHex(chainId),
                  chainName: 'BSC Testnet',
                  nativeCurrency: {
                    name: 'BSC',
                    symbol: 'tBNB',
                    decimals: 18
                  },
                  rpcUrls: [
                    'https://data-seed-prebsc-1-s1.binance.org:8545/',
                    'https://data-seed-prebsc-2-s1.binance.org:8545/'
                  ],
                  blockExplorerUrls: ['https://bscscan.com']
                }
              ]
            })
          }
        }
      }
    }
  }

  //#region computed
  @computed get connected() {
    return !!this.account
  }

  @computed get shortAccount() {
    if (!this.account) return ''
    return this.account.substr(0, 3) + '...' + this.account.substr(this.account.length - 3)
  }

  @computed get isChainIdValid() {
    //TODO: change to mainnet
    return this.chainId && this.chainId + '' === Number(process.env.VUE_APP_CHAIN_ID).toString()
    // return this.chainId && this.chainId + "" === Number(process.env.VUE_APP_CHAIN_ID).toString();
  }

  //#endregion
}

export const walletStore = new WalletStore()
