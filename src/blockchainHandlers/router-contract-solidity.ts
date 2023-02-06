import { walletStore } from '@/stores/wallet-store'
import { set } from 'lodash-es'
import { reaction } from 'mobx'
import Web3 from 'web3'
import { blockchainHandler } from '.'
import { tokenHelper } from './erc20-contract'

const contractAddresses = {
  '97': '0x1647FfFb7D6460291E7E6A7d1D9efc9eb8dEC92B',
  '56': '0x5f566E49acb8E754e3414627d47873d0Dd6029C5',
}
const cacheds: { [chainId: string]: RouterContract } = {}

export class RouterContract {
  approvedInfos = {}

  private constructor(public address: string, public chainId: string, public web3: Web3) {
    reaction(
      () => walletStore.web3,
      () => {
        this.injectProvider(walletStore.web3 as any)
      },
      { fireImmediately: true }
    )
  }

  injectProvider(web3?: Web3) {
    if (web3 && `${(web3 as any).chainId}` === `${(this.web3 as any).chainId}`) {
      this.web3 = web3
    }
  }

  static getInstance(chainId) {
    chainId = `${chainId}`
    let contract = cacheds[chainId]
    if (!contract) {
      cacheds[chainId] = contract = new RouterContract(
        contractAddresses[chainId],
        chainId,
        blockchainHandler.getWeb3(chainId)!
      )
      contract.initAsync()
    }
    return contract
  }

  _initTask: any
  _inited = false
  async initAsync() {
    if (this._inited) return
    if (this._initTask) {
      await this._initTask
    } else {
      this._initTask = this._initAsync()
      try {
        await this._initTask
        this._inited = true
      } catch (error) {
        this._initTask = undefined
      }
    }
  }

  private _initAsync() {
    return Promise.resolve(true)
  }

  async isApproved(token: string, account: string) {
    token = Web3.utils.toChecksumAddress(token)
    account = Web3.utils.toChecksumAddress(account)
    const erc20 = tokenHelper.getContract(token, +this.chainId)
    const result = await erc20.isApproved(account, this.address)
    set(this.approvedInfos, `${token}.${account}`, result)
    return this.approvedInfos[token][account]
  }

  async approve(token: string, account: string) {
    const erc20 = tokenHelper.getContract(token, +this.chainId)
    await erc20.approve(account, this.address)
    set(this.approvedInfos, `${token}.${account}`, true)
    return true
  }
}

function sendRequest(fx, from): Promise<any> {
  return new Promise((resolve, reject) => {
    fx.send({ from })
      .on('receipt', (receipt) => resolve(receipt))
      .on('error', (error) => reject(error))
  })
}
