/* eslint-disable @typescript-eslint/no-var-requires */
import { Zero } from '@/constants'
import { bnHelper } from '@/helpers/bignumber-helper'
import { promiseHelper } from '@/helpers/promise-helper'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { chunk, toNumber } from 'lodash-es'
import Web3 from 'web3'
import { blockchainHandler } from '.'
import { IVotingContract } from './ido-contract-interface'

class PoolType {
  fee?: FixedNumber
  minTime?: string
  requiredErc20?: string
  stakeFee?: FixedNumber
  targetPercentShare?: FixedNumber
}

export class VotingHandler implements IVotingContract {
  votingContract: any
  stakingContract: any
  poolType: PoolType = {}
  web3: any

  _owner = ''
  _amount = Zero
  _poolType = '0'
  _votedWeight = Zero
  _votedPercent = Zero
  _createdAt = ''
  _completed = false
  _cancelled = false

  constructor(public address: string, web3: Web3) {
    this.web3 = web3
    try {
      this.votingContract = new web3.eth.Contract(require('./abis/voting.abi.json'), address)
      this.stakingContract = new web3.eth.Contract(
        require('./abis/stake.abi.json'),
        process.env.VUE_APP_STAKE_CONTRACT_ADDRESS
      )
    } catch (error) {
      console.error(error)
    }
  }

  async init() {
    await this.getPoolType()
  }

  injectProvider() {
    const web3 = walletStore.web3 as any
    this.web3 = web3
    this.votingContract = new web3.eth.Contract(require('./abis/voting.abi.json'), process.env.VUE_APP_VOTING_SOLIDITY)
    this.stakingContract = new web3.eth.Contract(
      require('./abis/stake.abi.json'),
      process.env.VUE_APP_STAKE_CONTRACT_ADDRESS
    )
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

  async getOwnerPools(poolIds) {
    const methods = this.votingContract.methods

    const group = chunk(poolIds, 10)
    const contractPoolInfors: any[] = []
    for (const ids of group) {
      const poolInfors: any[] = await blockchainHandler.etherBatchRequest(
        this.web3,
        ids.map((id) => methods.poolInfos(id))
      )
      contractPoolInfors.push(...poolInfors)
    }
  }

  async getPoolInfo(poolId) {
    const [votingPoolInfo, stakePoolInfo] = await blockchainHandler.etherBatchRequest(this.web3, [
      this.votingContract.methods.poolInfos(poolId),
      this.stakingContract.methods.poolInfo(0),
    ])

    const totalStaked = bnHelper.fromDecimals((stakePoolInfo as any).amount)
    this._owner = (votingPoolInfo as any).owner
    this._amount = bnHelper.fromDecimals((votingPoolInfo as any).amount)
    this._poolType = (votingPoolInfo as any).poolType
    this._votedWeight = bnHelper.fromDecimals((votingPoolInfo as any).votedWeight)
    this._votedPercent = this._votedWeight.divUnsafe(totalStaked).mulUnsafe(FixedNumber.from('100'))
    this._createdAt = (votingPoolInfo as any).createdAt
    this._completed = (votingPoolInfo as any).completed
    this._cancelled = (votingPoolInfo as any).cancelled
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
      const allowance = await erc20Contract.methods.allowance(account, process.env.VUE_APP_VOTING_SOLIDITY).call()
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
    const f = erc20Contract.methods.approve(process.env.VUE_APP_VOTING_SOLIDITY, web3.utils.toWei(`${2 ** 64 - 1}`))
    await sendRequest(f, account)
  }

  async checkUserVotedPool(account, poolId) {
    const voted = await this.votingContract.methods.userVotedPools(account, poolId).call()
    return voted
  }

  async getVotedUsers(poolId) {
    const users = await this.votingContract.methods.getVotedUsers(poolId).call()
    return users
  }

  get poolInfo() {
    return {
      owner: this._owner,
      amount: this._amount,
      poolType: this._poolType,
      votedWeight: this._votedWeight,
      votedPercent: this._votedPercent,
      createdAt: this._createdAt,
      completed: this._completed,
      cancelled: this._cancelled,
    }
  }

  async getTokenBalance(web3, address, account) {
    const contract = new web3.eth.Contract(require('./abis/erc20.abi.json'), address)
    const allowance = await contract.methods.balanceOf(account).call()
    return FixedNumber.from(`${web3.utils.fromWei(allowance)}`)
  }

  async getRewardTokenSymbol(web3, address) {
    const contract = new web3.eth.Contract(require('./abis/erc20.abi.json'), address)
    const symbol = await contract.methods.symbol().call()
    return symbol
  }

  async getUserStakeBalance(account) {
    const amount = await this.stakingContract.methods.getUserStakeBalance(0, account).call()
    return FixedNumber.from(`${this.web3.utils.fromWei(amount)}`)
  }
}

async function sendRequest(fx, from, value = '') {
  return await new Promise((resolve, reject) => {
    fx.send({ from, value })
      .on('receipt', (result) => resolve(result))
      .on('error', (error) => reject(error))
  })
}
