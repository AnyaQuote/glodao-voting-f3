import { blockchainHandler, ChainType } from '@/blockchainHandlers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { Zero } from '@/constants'
import { localdata } from '@/helpers/local-data'
import Application from '@/libs/models'
import { FixedNumber } from '@ethersproject/bignumber'
import { Provider } from '@project-serum/anchor'
import { CLUSTER_SLUGS, ENV as SOL_CHAINID } from '@solana/spl-token-registry'
import {
  MessageSignerWalletAdapter,
  SignerWalletAdapter,
  WalletAdapter,
  WalletAdapterNetwork,
  WalletNotConnectedError,
  WalletNotFoundError,
  WalletSignTransactionError,
  WalletTimeoutError,
  WalletWindowClosedError,
} from '@solana/wallet-adapter-base'
import {
  getPhantomWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
  Wallet,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl, ConfirmOptions, Connection, PublicKey, Transaction } from '@solana/web3.js'
import { action, computed, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { Subscription, timer } from 'rxjs'
import Web3 from 'web3'

export class WalletStore {
  ethereum: any = window.ethereum

  network = WalletAdapterNetwork.Mainnet
  @observable showConnectDialog = false

  @observable solWalletItems = [
    getSolletExtensionWallet(),
    getSolletWallet(),
    getPhantomWallet(),
    getSolflareWallet(),
    // getLedgerWallet({ derivationPath: getDerivationPath() }),
  ]

  app = new Application({ mainnet: true })
  @observable web3: Web3 | null = null
  @observable account = ''
  @observable bnbBalance = Zero
  @observable chainId = 97

  @observable loaded = false

  @observable chainType: ChainType | null = localdata.lastChain

  @observable selectedWallet: Wallet | null = null
  @observable selectedAdapter: WalletAdapter | SignerWalletAdapter | MessageSignerWalletAdapter | null = null

  //TODO: remove this
  @observable telegramLoginDialog = false
  @observable isLoggingInTelegram = false
  @observable jwt = ''

  @observable navigationDrawer = false

  private _bnbBalanceSubscription: Subscription | undefined

  constructor() {
    reaction(
      () => this.chainType,
      (x) => {
        localdata.lastChain = x as any
      }
    )
  }

  @action.bound changeShowConnectDialog(value: boolean) {
    this.showConnectDialog = value
    if (!value) {
      this.requestingChain = undefined
    }
  }
  @action.bound changeTelegramLoginDialog(value: boolean) {
    this.telegramLoginDialog = value
  }
  @action.bound changeJwt(value: string) {
    this.jwt = value
  }
  @action.bound resetJwt() {
    this.jwt = ''
  }

  @action.bound setNavigationDrawer(val: boolean) {
    this.navigationDrawer = val
  }

  @asyncAction *start() {
    try {
      if (this.chainType === 'bsc' || this.chainType === 'eth') {
        this.app.start()
        this.web3 = this.app.web3
        if (yield this.app.getAddress()) {
          yield this.connectSolidity()
        }
      }
    } catch (error) {
      console.error(error)
    }
    this.loaded = true
  }

  @asyncAction *connectSolidity() {
    loadingController.increaseRequest()
    try {
      this.disconnectSolana()
      if ((this.chainType === 'eth' || this.chainType === 'bsc') && this.account) {
        // connected
        return
      }

      this.account = ''
      const ok = yield this.app.login()
      this.web3 = this.app?.web3
      if (ok && this.web3) {
        this.chainId = +(yield this.web3.eth.getChainId())
        ;(this.web3 as any).chainId = this.chainId
        switch (this.chainId) {
          case 1:
          case 3:
            this.chainType = 'eth'
            break
          case 56:
          case 97:
          default:
            this.chainType = 'bsc'
            break
        }
        this.account = yield this.app.getAddress()
        this.ethereum.removeListener('accountsChanged', this.ethereumConfigChanged)
        this.ethereum.removeListener('chainChanged', this.ethereumConfigChanged)
        this.ethereum.once('accountsChanged', this.ethereumConfigChanged)
        this.ethereum.once('chainChanged', this.ethereumConfigChanged)
        this._bnbBalanceSubscription?.unsubscribe()
        this._bnbBalanceSubscription = timer(0, 5000).subscribe(() => {
          this.getBnbBalance()
        })
      }
      this.changeShowConnectDialog(false)
      return ok
    } catch (error: any) {
      error.message && snackController.error(error.message)
      return false
    } finally {
      loadingController.decreaseRequest()
    }
  }

  // @asyncAction *signMessage() {
  //   if (!this.account) return
  //   const message = `https://app.waggle.network/projects wants to:\n
  //     Sign message with account \n ${this.account}`
  //   if (this.chainType === 'eth' || this.chainType === 'bsc') {
  //     this.disconnectSolana()
  //     const request = { method: 'personal_sign', params: [message, this.account] }
  //     return yield this.ethereum.request(request)
  //   } else {
  //     const data = new TextEncoder().encode(message)
  //     const a = this.selectedAdapter as any
  //     if (a.signMessage) {
  //       return yield a.signMessage(data)
  //     } else {
  //       return yield a._wallet.signMessage(data)
  //     }
  //   }
  // }

  @asyncAction *connectSolana(wallet: Wallet) {
    try {
      loadingController.increaseRequest()
      this.account = ''
      this.web3 = null
      this.ethereum?.removeListener('accountsChanged', this.ethereumConfigChanged)
      this.ethereum?.removeListener('chainChanged', this.ethereumConfigChanged)
      this._bnbBalanceSubscription?.unsubscribe()

      yield this.disconnectSolana()
      const adapter = wallet.adapter()
      if (!adapter) return
      if (!adapter.connected) yield adapter.connect()
      this.selectedWallet = wallet
      this.selectedAdapter = adapter
      this.chainType = 'sol'
      this.chainId = CLUSTER_SLUGS[this.network]
      this.account = adapter.publicKey?.toString() || ''
      ;(adapter as any).on('disconnect', () => this.disconnectSolana())
      ;(adapter as any).on('error', (err) => snackController.error(`${err.name} ${err.message}`))
      this.changeShowConnectDialog(false)
      return true
    } catch (error) {
      if (error instanceof WalletNotFoundError) {
        snackController.error(`Plugin ${wallet.name} is not installed!`)
      } else if (error instanceof WalletWindowClosedError) {
        snackController.error(`The wallet window is closed!`)
      } else if (error instanceof WalletTimeoutError) snackController.error('Wallet timeout error!')
      else snackController.error(error as any)
      console.error(error)
      return false
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @asyncAction *disconnectSolana() {
    const adapter = this.selectedAdapter
    if (adapter) {
      this.account = ''
      this.chainType = null
      this.selectedAdapter = null
      this.selectedWallet = null
      adapter.removeAllListeners('disconnect')
      adapter.removeAllListeners('error')
      adapter.removeAllListeners()
      yield adapter.disconnect().catch()
    }
  }

  @asyncAction *disconnectAccount() {
    try {
      loadingController.increaseRequest()
      this.account = ''
      this.web3 = null
      this.ethereum?.removeListener('accountsChanged', this.ethereumConfigChanged)
      this.ethereum?.removeListener('chainChanged', this.ethereumConfigChanged)
      this._bnbBalanceSubscription?.unsubscribe()
      yield this.disconnectSolana()
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @observable requestingChain: ChainType | undefined = undefined;

  @asyncAction *switchNetwork(chain: ChainType, chainId: number) {
    switch (chain) {
      case 'bsc':
      case 'eth':
        if (this.solidityConnected) {
          try {
            yield this.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: Web3.utils.toHex(chainId) }],
            })
          } catch (error) {
            if (error.message.includes('wallet_addEthereumChain')) {
              if (chainId === 56) {
                this.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: Web3.utils.toHex(chainId),
                      chainName: 'Binance Smart Chain Mainnet',
                      nativeCurrency: {
                        name: 'Binance Chain Native Token',
                        symbol: 'BNB',
                        decimals: 18,
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
                        'wss://bsc-ws-node.nariox.org',
                      ],
                      blockExplorerUrls: ['https://bscscan.com'],
                    },
                  ],
                })
              } else if (chainId === 97) {
                this.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: Web3.utils.toHex(chainId),
                      chainName: 'Binance Smart Chain Testnet',
                      nativeCurrency: {
                        name: 'Binance Chain Native Token',
                        symbol: 'tBNB',
                        decimals: 18,
                      },
                      rpcUrls: [
                        'https://data-seed-prebsc-1-s1.binance.org:8545',
                        'https://data-seed-prebsc-2-s1.binance.org:8545',
                        'https://data-seed-prebsc-1-s2.binance.org:8545',
                        'https://data-seed-prebsc-2-s2.binance.org:8545',
                        'https://data-seed-prebsc-1-s3.binance.org:8545',
                        'https://data-seed-prebsc-2-s3.binance.org:8545',
                      ],
                      blockExplorerUrls: ['https://testnet.bscscan.com'],
                    },
                  ],
                })
              }
            }
          }
        } else {
          this.requestingChain = chain
          this.changeShowConnectDialog(true)
        }
        break
      case 'sol': {
        let network = WalletAdapterNetwork.Mainnet
        if (chainId === SOL_CHAINID.Testnet) network = WalletAdapterNetwork.Testnet
        if (chainId === SOL_CHAINID.Devnet) network = WalletAdapterNetwork.Devnet
        if (network != this.network) {
          yield this.disconnectSolana()
          this.network = network
          this.solWalletItems = [
            getSolletExtensionWallet({ network }),
            getSolletWallet({ network }),
            getPhantomWallet(),
            getSolflareWallet(),
          ]
        }
        this.requestingChain = chain
        this.changeShowConnectDialog(true)
        break
      }
    }
  }

  ethereumConfigChanged = () => {
    window.location.reload()
  };

  @asyncAction *getBnbBalance() {
    const result = yield this.web3?.eth.getBalance(this.account as any)
    this.bnbBalance = FixedNumber.from(this.web3?.utils.fromWei(result, 'ether'))
  }

  //#region computed
  @computed get solidityConnected() {
    return (this.chainType === 'bsc' || this.chainType === 'eth') && this.walletConnected
  }

  @computed get solanaConnected() {
    return this.chainType === 'sol' && this.walletConnected
  }

  @computed get connectedSolProvider() {
    const [wallet, adapter] = [this.selectedWallet, this.selectedAdapter]
    if (wallet && adapter) {
      let anchorWallet: MyAnchorWallet | undefined = undefined
      const opts: ConfirmOptions = {
        preflightCommitment: 'recent',
        commitment: 'recent',
      }
      const connection = new Connection(
        this.network === WalletAdapterNetwork.Mainnet
          ? blockchainHandler.getSolanaMainNetRpc()
          : clusterApiUrl(this.network),
        opts.preflightCommitment
      )
      anchorWallet = new MyAnchorWallet(adapter as SignerWalletAdapter)
      return new Provider(connection, anchorWallet, opts)
    }
    return null
  }

  @computed get chainProvider() {
    return this.web3 || this.connectedSolProvider
  }

  @computed get walletConnected() {
    return !!this.account
  }

  @computed get hasEthereumPlugin() {
    return !!this.ethereum
  }

  @computed get shortAccount() {
    if (!this.account) return ''
    return this.account.substr(0, 5) + '...' + this.account.substr(this.account.length - 3)
  }

  @computed get chainIcon() {
    switch (this.chainId) {
      case 1:
      case 3:
        return 'eth-icon.svg'

      case 101:
      case 102:
      case 103:
        return 'sol-icon.svg'
      case 56:
      case 97:
      default:
        return 'bsc-icon.svg'
    }
  }
  //#endregion
}

export const walletStore = new WalletStore()

export class MyAnchorWallet {
  constructor(readonly adatper: SignerWalletAdapter | undefined) {
    //
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    try {
      return (await this.adatper?.signTransaction(tx)) as any
    } catch (error: any) {
      if (error instanceof WalletNotConnectedError) {
        snackController.error('Wallet disconnected, reloading...')
        window.location.reload()
      } else if (error instanceof WalletSignTransactionError) {
        snackController.error('You might change wallet, please connect again!')
        walletStore.disconnectSolana()
      }
      throw error
    }
  }
  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    try {
      return (await this.adatper?.signAllTransactions(txs)) as any
    } catch (error: any) {
      if (error instanceof WalletNotConnectedError) {
        snackController.error('Wallet disconnected, reloading...')
        window.location.reload()
      } else if (error instanceof WalletSignTransactionError) {
        snackController.error('You might change wallet, please connect again!')
        walletStore.disconnectSolana()
      }
      throw error
    }
  }
  get publicKey(): PublicKey {
    return this.adatper?.publicKey as any
  }
}
