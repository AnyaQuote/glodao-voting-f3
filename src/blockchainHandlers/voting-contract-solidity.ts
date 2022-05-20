/* eslint-disable @typescript-eslint/no-var-requires */
import { bnHelper } from '@/helpers/bignumber-helper'
import { promiseHelper } from '@/helpers/promise-helper'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { toNumber } from 'lodash-es'
import Web3 from 'web3'
import { blockchainHandler } from '.'

const web3 = blockchainHandler.getWeb3(process.env.VUE_APP_CHAIN_ID)!

export class VotingHandler {
  votingContract: any

  constructor() {
    try {
      this.votingContract = new web3.eth.Contract(require('./abis/voting.abi.json'), process.env.VUE_APP_VOTING_ADDRESS)
    } catch (error) {
      console.error(error)
    }
  }

  injectMetamask(web3: Web3) {
    if (web3) {
      this.votingContract = new web3.eth.Contract(require('./abis/voting.abi.json'), process.env.VUE_APP_VOTING_ADDRESS)
    }
  }

  async init(): Promise<void> {
    //
  }

  async createPool(rewardTokenAddress, account) {
    const f = this.votingContract.methods.createPool(3, rewardTokenAddress, bnHelper.toDecimalString('1'))
    await sendRequest(f, account, bnHelper.toDecimalString('0.1'))
  }

  // async approved(account, index = 3) {
  //   try {
  //     const allowance = await this.LPTokenContract.methods
  //       .allowance(account, process.env.VUE_APP_FARM_CONTRACT_ADDRESS)
  //       .call()
  //     return !!+Web3.utils.fromWei(allowance)
  //   } catch (error) {
  //     if (index) {
  //       await promiseHelper.delay(200)
  //       return await this.approved(account, --index)
  //     }
  //     console.error(error)
  //     return false
  //   }
  // }
  // async approve(account) {
  //   const f = this.LPTokenContract.methods.approve(
  //     process.env.VUE_APP_FARM_CONTRACT_ADDRESS,
  //     web3.utils.toWei(`${2 ** 64 - 1}`)
  //   )
  //   await sendRequest(f, account)
  // }
}

function sendRequest(fx, from, value): Promise<any> {
  return new Promise((resolve, reject) => {
    fx.send({ from, value })
      .on('receipt', () => resolve(''))
      .on('error', (error) => reject(error))
  })
}
