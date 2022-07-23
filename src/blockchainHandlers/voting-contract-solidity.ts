/* eslint-disable @typescript-eslint/no-var-requires */
import { appProvider } from '@/app-providers'
import { ETHER_ZERO_ADDRESS, HUNDRED, Zero } from '@/constants'
import { bnHelper } from '@/helpers/bignumber-helper'
import { promiseHelper } from '@/helpers/promise-helper'
import { ProjectInfo } from '@/models/VotingModel'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { chunk, get } from 'lodash-es'
import Web3 from 'web3'
import { blockchainHandler } from '.'
import { IVotingContract, PoolInfo } from './ido-contract-interface'

class PoolType {
  creationFee?: FixedNumber
  feePerMission?: FixedNumber
  cancelationFeePercent?: FixedNumber
  minTime?: string
  maxTime?: string
  targetPercentShare?: FixedNumber
}

export class VotingHandler implements IVotingContract {
  votingContract: any
  stakingContract: any
  poolType: PoolType = {}
  web3: any

  _owner = ''
  _tokenAAmount = Zero
  _tokenBAmount = Zero
  _poolType = '0'
  _votedPercent = Zero
  _createdAt = ''
  _completed = false
  _cancelled = false

  _approvedUsers: any
  _rejectedUsers: any

  _votedYesPercent = Zero
  _votedYesWeight = Zero
  _votedNoPercent = Zero
  _votedNoWeight = Zero

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
      creationFee: bnHelper.fromDecimals(poolType.creationFee),
      feePerMission: bnHelper.fromDecimals(poolType.feePerMission),
      minTime: poolType.minTime,
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
    const votingPools = await appProvider.api.voting.find(
      {
        poolId,
      },
      { _limit: 1 }
    )
    const votingPool: any = votingPools[0]
    const tokenADecimals = get(votingPool, 'data.decimals', 18)
    const tokenBDecimals = get(votingPool, 'data.optionalRewardTokenDecimals', 18)

    const [votingPoolInfo, approvedUsers, rejectedUsers, stakePoolInfo] = await blockchainHandler.etherBatchRequest(
      this.web3,
      [
        this.votingContract.methods.poolInfos(poolId),
        this.votingContract.methods.getApproveds(poolId),
        this.votingContract.methods.getRejects(poolId),
        this.stakingContract.methods.poolInfo(0),
      ]
    )

    // get weight
    let votedYesWeight = Zero
    const approvedUserList = approvedUsers as Array<string>
    if (approvedUserList && approvedUserList.length) {
      const approvedUserInfos: Array<any> = await blockchainHandler.etherBatchRequest(
        this.web3,
        approvedUserList.map((address) => this.votingContract.methods.poolUserInfos(poolId, address))
      )

      for (let index = 0; index < approvedUserInfos.length; index++) {
        const info = approvedUserInfos[index]
        votedYesWeight = votedYesWeight.addUnsafe(bnHelper.fromDecimals(info.votedWeight))
      }
    }
    let votedNoWeight = Zero
    const rejectedUserList = rejectedUsers as Array<string>
    if (rejectedUserList && rejectedUserList.length) {
      const rejectedUserInfos: Array<any> = await blockchainHandler.etherBatchRequest(
        this.web3,
        rejectedUserList.map((address) => this.votingContract.methods.poolUserInfos(poolId, address))
      )

      for (let index = 0; index < rejectedUserInfos.length; index++) {
        const info = rejectedUserInfos[index]
        votedNoWeight = votedNoWeight.addUnsafe(bnHelper.fromDecimals(info.votedWeight))
      }
    }

    this._owner = (votingPoolInfo as any).owner
    this._tokenAAmount = bnHelper.fromDecimals((votingPoolInfo as PoolInfo).tokenAAmount, tokenADecimals)
    this._tokenBAmount = bnHelper.fromDecimals((votingPoolInfo as PoolInfo).tokenBAmount, tokenBDecimals)
    this._poolType = (votingPoolInfo as PoolInfo).poolType!
    this._votedYesPercent = bnHelper.fromDecimals((votingPoolInfo as PoolInfo).votedYesPercent).mulUnsafe(HUNDRED)
    this._votedYesWeight = votedYesWeight
    this._votedNoPercent = bnHelper.fromDecimals((votingPoolInfo as PoolInfo).votedNoPercent).mulUnsafe(HUNDRED)
    this._votedNoWeight = votedNoWeight
    this._createdAt = (votingPoolInfo as PoolInfo).createdAt!
    this._completed = (votingPoolInfo as PoolInfo).completed!
    this._cancelled = (votingPoolInfo as PoolInfo).cancelled!

    this._approvedUsers = approvedUsers
    this._rejectedUsers = rejectedUsers
  }

  async createPool(
    poolInfo: ProjectInfo,
    account: string,
    requiredTokenDecimals = 18,
    optionalTokenDecimals = 18,
    missionLength
  ) {
    if (!this.poolType.creationFee) {
      await this.getPoolType()
    }

    if (this.poolType.creationFee) {
      const bnbFee = bnHelper.toDecimalString(this.poolType.creationFee)
      const f = this.votingContract.methods.createPool(
        0,
        poolInfo.tokenAddress,
        bnHelper.toDecimalString(poolInfo.rewardAmount!.toString(), requiredTokenDecimals),
        missionLength,
        poolInfo.optionalTokenAddress ? poolInfo.optionalTokenAddress : ETHER_ZERO_ADDRESS,
        poolInfo.optionalTokenAddress
          ? bnHelper.toDecimalString(poolInfo.optionalRewardAmount!.toString(), optionalTokenDecimals)
          : 0,
        true
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

  async vote(poolId, result, account) {
    const f = this.votingContract.methods.vote(poolId, result)
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

  get poolInfo() {
    return {
      owner: this._owner,
      tokenAAmount: this._tokenAAmount,
      tokenBAmount: this._tokenBAmount,
      poolType: this._poolType,
      votedYesPercent: this._votedYesPercent,
      votedYesWeight: this._votedYesWeight,
      votedNoPercent: this._votedNoPercent,
      votedNoWeight: this._votedNoWeight,
      createdAt: this._createdAt,
      completed: this._completed,
      cancelled: this._cancelled,
      approvedUsers: this._approvedUsers,
      rejectedUsers: this._rejectedUsers,
    }
  }

  async getTokenInfo(web3, address, account) {
    const contract = new web3.eth.Contract(require('./abis/erc20.abi.json'), address)
    const [symbol, decimals, balance] = await blockchainHandler.etherBatchRequest(web3, [
      contract.methods.symbol(),
      contract.methods.decimals(),
      contract.methods.balanceOf(account),
    ])
    const info = {
      symbol,
      decimals,
      balance: bnHelper.fromDecimals(balance, decimals),
    }
    return info
  }

  async getPoolUserInfos(poolId, account) {
    const { voted, votedYes, votedWeight, totalStakedAmount } = await this.votingContract.methods
      .poolUserInfos(poolId, account)
      .call()
    return { voted, votedYes, votedWeight, totalStakedAmount }
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
