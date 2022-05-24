/* eslint-disable @typescript-eslint/no-var-requires */
import { Zero } from '@/constants'
import { bnHelper } from '@/helpers/bignumber-helper'
import { promiseHelper } from '@/helpers/promise-helper'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { toNumber } from 'lodash-es'
import Web3 from 'web3'
import { blockchainHandler } from '.'

const web3 = blockchainHandler.getWeb3(process.env.VUE_APP_CHAIN_ID)!

class PoolType {
  fee?: FixedNumber
  minTime?: string
  requiredErc20?: string
  stakeFee?: FixedNumber
  targetPercentShare?: FixedNumber
}

export class VotingHandler {
  votingContract: any
  poolType: PoolType = {}

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

  async getPoolType() {
    const poolType = await this.votingContract.methods.poolTypeInfos(0).call()
    this.poolType = {
      fee: bnHelper.fromDecimals(poolType.fee),
      minTime: poolType.minTime,
      requiredErc20: poolType.requiredErc20,
      stakeFee: bnHelper.fromDecimals(poolType.stakeFee),
      targetPercentShare: bnHelper.fromDecimals(poolType.targetPercentShare),
    }
    return this.poolType
  }

  async getPoolInfo(poolId) {
    const poolInfo = await this.votingContract.methods.poolInfos(poolId).call()
    return {
      ...poolInfo,
      amount: bnHelper.fromDecimals(poolInfo.amount),
      votedWeight: bnHelper.fromDecimals(poolInfo.votedWeight),
    }
  }

  async createPool(rewardTokenAddress: string, rewardAmount: FixedNumber | string, account: string) {
    if (this.poolType.fee) {
      const bnbFee = bnHelper.toDecimalString(this.poolType.fee)
      const f = this.votingContract.methods.createPool(
        0,
        rewardTokenAddress,
        bnHelper.toDecimalString(rewardAmount.toString())
      )
      const res = await sendRequest(f, account, bnbFee)

      const poolCreatedEvent = (res as any).events['PoolCreated']
      const poolId = poolCreatedEvent.returnValues.id as string
      const ownerAddress = poolCreatedEvent.returnValues.owner as string
      const poolType = poolCreatedEvent.returnValues.poolType as string

      return { poolId, ownerAddress, poolType }
    } else {
      throw Error('Wrong fee')
    }
  }

  async cancelPool(poolId, account) {
    const f = this.votingContract.methods.cancelPool(poolId)
    await sendRequest(f, account)
  }

  async vote(poolId, account) {
    const f = this.votingContract.methods.vote(poolId)
    const res = await sendRequest(f, account)

    const userVotedEvent = (res as any).events['UserVoted']
    const completed = userVotedEvent.returnValues.completed as boolean
    return { completed }
  }

  async approved(rewardAddress, account, index = 3) {
    const web3 = walletStore.web3!
    try {
      const erc20Contract = new web3.eth.Contract(require('./abis/erc20.abi.json'), rewardAddress)
      const allowance = await erc20Contract.methods.allowance(account, process.env.VUE_APP_VOTING_ADDRESS).call()
      return !!+Web3.utils.fromWei(allowance)
    } catch (error) {
      if (index) {
        await promiseHelper.delay(200)
        return await this.approved(account, --index)
      }
      console.error(error)
      return false
    }
  }
  async approve(rewardAddress, account) {
    const web3 = walletStore.web3!
    const erc20Contract = new web3.eth.Contract(require('./abis/erc20.abi.json'), rewardAddress)
    const f = erc20Contract.methods.approve(process.env.VUE_APP_VOTING_ADDRESS, web3.utils.toWei(`${2 ** 64 - 1}`))
    await sendRequest(f, account)
  }
}

async function sendRequest(fx, from, value = '') {
  return await new Promise((resolve, reject) => {
    fx.send({ from, value })
      .on('receipt', (result) => resolve(result))
      .on('error', (error) => reject(error))
  })
}

export const votingHandler = new VotingHandler()
