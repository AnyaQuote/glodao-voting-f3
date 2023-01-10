import { bnHelper } from '@/helpers/bignumber-helper'
import { walletStore } from '@/stores/wallet-store'
import { keyBy } from 'lodash-es'
import { reaction } from 'mobx'
import Web3 from 'web3'
import { blockchainHandler } from '.'
import claimerMasterAbi from './abis/claimer-master.abi.json'
import claimerAbi from './abis/claimer.abi.json'
import { Erc20Contract } from './erc20-contract'
import { RouterContract } from './router-contract-solidity'

const MASTER_ADDRESS = '0x8E358Ff175fDBB51e95aff903A65412aD8189C64' // process.env.VUE_APP_CHAIN_ID === '97'

export class ClaimerEvmContract {
  contract: any
  web3: Web3
  router: RouterContract

  constructor(
    public readonly token: string,
    public readonly contractAddress: string,
    web3 = blockchainHandler.getWeb3(process.env.VUE_APP_CHAIN_ID)
  ) {
    this.web3 = web3!
    this.router = RouterContract.getInstance((web3 as any).chainId)
    this.contract = new this.web3.eth.Contract(claimerAbi as any, contractAddress)
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

  private async _initAsync() {
    // this.tokenDecimals = await this.tokenContract.decimals()
    // const methods = this.contract.methods
    // const availableTokens = await methods.getAvailableTokens()
    // const claimerAddresses = await methods.getClaimerFromTokens(availableTokens)
  }

  injectProvider(web3: Web3): void {
    if (web3 && `${(web3 as any).chainId}` === `${(this.web3 as any).chainId}`) {
      this.web3 = web3
      this.contract = new this.web3.eth.Contract(claimerAbi as any, this.contractAddress)
    }
  }
}

export class ClaimerMasterEvmContract {
  contract: any
  tokenDecimals!: number
  web3: Web3
  claimers: { [tokenAddress: string]: ClaimerEvmContract } = {}

  constructor() {
    this.web3 = blockchainHandler.getWeb3(process.env.VUE_APP_CHAIN_ID)!
    this.contract = new this.web3.eth.Contract(claimerMasterAbi as any, MASTER_ADDRESS)
    reaction(
      () => walletStore.web3,
      () => {
        this.injectProvider(walletStore.web3 as any)
      },
      { fireImmediately: true }
    )
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
        console.error('init', error)
        this._initTask = undefined
      }
    }
  }

  private async _initAsync() {
    console.log('_initAsync')
    // this.tokenDecimals = await this.tokenContract.decimals()
    const methods = this.contract.methods
    const availableTokens = await methods.getAvailableTokens().call()
    const claimerAddresses: string[] = await methods.getClaimerFromTokens(availableTokens).call()
    this.claimers = keyBy(
      claimerAddresses.map((x, index) => new ClaimerEvmContract(availableTokens[index], x, this.web3)),
      (x) => x.token
    )
  }

  injectProvider(web3?: Web3) {
    if (web3 && `${(web3 as any).chainId}` === `${(this.web3 as any).chainId}`) {
      this.web3 = web3
      this.contract = new this.web3.eth.Contract(claimerMasterAbi as any, MASTER_ADDRESS)
      Object.values(this.claimers).forEach((x) => x.injectProvider(web3))
    }
  }

  async createClaimer(token: string, from: string) {
    const methods = this.contract.methods
    await sendRequest(methods.createClaimer(token), from)
    const claimer = await methods.claimerContracts(token)
    this.claimers[token] = new ClaimerEvmContract(token, claimer, this.web3)
    return this.claimers[token]
  }

  async getClaimer(token: string) {
    await this.initAsync()
    token = Web3.utils.toChecksumAddress(token)
    return this.claimers[token]
  }

  async isCreatedClaimer(token: string) {
    token = Web3.utils.toChecksumAddress(token)
    await this.initAsync()
    return !!this.claimers[token]
  }

  async getUserInfo(address: string) {
    const methods = this.contract.methods
    const { amount, claimedAmount } = await methods.userInfos(address).call()
    return {
      amount: bnHelper.fromDecimals(amount, this.tokenDecimals),
      claimedAmount: bnHelper.fromDecimals(claimedAmount, this.tokenDecimals),
    }
  }

  claim(address: string) {
    const methods = this.contract.methods
    return sendRequest(methods.claim(), address)
  }
}

function sendRequest(fx, from): Promise<any> {
  return new Promise((resolve, reject) => {
    fx.send({ from })
      .on('receipt', (receipt) => resolve(receipt))
      .on('error', (error) => reject(error))
  })
}

export const claimerMasterEvm = new ClaimerMasterEvmContract()
