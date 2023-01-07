import { bnHelper } from '@/helpers/bignumber-helper'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { toNumber } from 'lodash'
import { reaction } from 'mobx'
import Web3 from 'web3'
import { blockchainHandler } from '.'
import erc20Abi from './abis/erc20.abi.json'

const cacheds: {
  bsc: { [id: string]: Erc20Contract }
  eth: { [id: string]: Erc20Contract }
} = { bsc: {}, eth: {} }

export const tokenHelper = {
  getContract: (tokenAddress: string, chainId: number | 'bsc' | 'eth'): Erc20Contract => {
    const web3 = blockchainHandler.getWeb3(chainId)
    tokenAddress = Web3.utils.toChecksumAddress(tokenAddress)

    let cacheContainer = {} as any
    if (+chainId === 1 || chainId === 'eth') cacheContainer = cacheds.eth
    else if (+chainId === 56 || chainId === 'bsc') cacheContainer = cacheds.bsc

    if (!cacheContainer[tokenAddress]) {
      cacheContainer[tokenAddress] = new Erc20Contract(tokenAddress, web3 as any)
    }
    return cacheContainer[tokenAddress]
  },
}

export class Erc20Contract {
  contract: any
  private _decimals: any = null
  constructor(public address: string, public web3: Web3, decimal: any = null) {
    try {
      if (decimal) this._decimals = toNumber(decimal)
    } catch (error) {
      //
    }
    this.contract = new web3.eth.Contract(erc20Abi as any, address)

    reaction(
      () => walletStore.web3,
      () => {
        this.injectProvider(walletStore.web3 as any)
      },
      { fireImmediately: true }
    )
  }

  injectProvider(web3: Web3) {
    if (web3 && `${(web3 as any).chainId}` === `${(this.web3 as any).chainId}`) {
      this.web3 = web3
      this.contract = new web3.eth.Contract(erc20Abi as any, this.address)
    }
  }

  async decimals() {
    const result = this._decimals || (await this.contract.methods.decimals().call())
    this._decimals = result
    return result
  }

  async isApproved(account, spenderAddress) {
    const approvedAmount = bnHelper.fromDecimals(
      await this.contract.methods.allowance(account, spenderAddress).call(),
      await this.decimals()
    )
    return bnHelper.gt(approvedAmount, FixedNumber.from(`999999`))
  }

  async approve(account, spenderAddress) {
    const amountWithDecimals = bnHelper.toDecimalString(`${2 ** 64 - 1}`, await this.decimals())
    return await sendRequest(this.contract.methods.approve(spenderAddress, amountWithDecimals), account)
  }

  async transfer(account, spenderAddress, amount) {
    const amountWithDecimals = bnHelper.toDecimalString(amount, await this.decimals())
    return await sendRequest(this.contract.methods.transfer(spenderAddress, amountWithDecimals), account)
  }

  async getTokenAmount(account) {
    return bnHelper.fromDecimals(await this.contract.methods.balanceOf(account).call(), await this.decimals())
  }
}
function sendRequest(fx, from): Promise<any> {
  return new Promise((resolve, reject) => {
    fx.send({ from })
      .on('receipt', (receipt) => resolve(receipt))
      .on('error', (error) => reject(error))
  })
}
