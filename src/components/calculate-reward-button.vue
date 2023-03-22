<template>
  <div>
    <v-btn class="white--text linear-blue--bg" @click="toggleDialog" :disabled="!canSendReward">
      Send rewards to users
    </v-btn>
    <v-dialog v-model="dialog" max-width="600" class="overflow-hidden" persistent>
      <v-sheet color="neutral100" class="pa-4">
        <v-form ref="form">
          <div class="d-flex justify-space-between align-center">
            <div class="text-h5 font-weight-bold">Send your rewards</div>
            <v-btn icon @click="cancel" small :disabled="!canClose">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="d-flex mt-4">
            <div class="font-weight-bold">Token address:</div>
            <div class="ml-2">{{ tokenBAddress }}</div>
          </div>
          <div class="d-flex mt-2">
            <div class="font-weight-bold">Send amount:</div>
            <div class="ml-2">{{ totalAmount | formatNumber(2) }} TOKEN</div>
          </div>

          <div>
            <div v-if="transactionSent">
              <div class="mt-3 error--text">You have sent rewards with below transaction(s):</div>
              <div style="font-size: 13px" class="mb-3" v-html="lastTransactionsText"></div>
            </div>
            <v-sheet outlined rounded="lg" v-for="(tx, index) of txs" :key="index" class="pa-2 my-2 text-caption">
              <v-row>
                <v-col cols="1" class="font-weight-bold">{{ index + 1 }}</v-col>
                <v-col cols="9" class="d-flex flex-column">
                  <div class="d-flex flex-row">
                    <div class="flex-grow-1">
                      To: <span class="font-weight-bold">{{ tx.accounts.length }}</span> users
                    </div>
                    <div class="flex-grow-1">
                      Total: <span class="font-weight-bold">{{ tx.totalAmount | formatNumber(2) }}</span> tokens
                    </div>
                  </div>
                  <div style="font-size: 10px">Hash: {{ tx.hash }}</div>
                  <div>
                    <div v-if="tx.status === 'pending'">
                      Please wait then click <span class="text-body-1 font-weight-medium">"Send"</span> to distribute
                      rewards
                      <div v-if="tx.error" class="error--text">{{ tx.error }}</div>
                    </div>
                    <div v-else-if="tx.status === 'loading'">mining</div>
                    <div v-else-if="tx.status === 'error'" class="error--text">{{ tx.error }}</div>
                    <div v-else-if="tx.status === 'success'">Completed</div>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div v-if="tx.status === 'pending'">
                    <v-btn color="primary" depressed :disabled="!tx.canSend" @click="sendTransaction(tx)"> Send </v-btn>
                  </div>
                  <div v-else-if="tx.status === 'loading'">
                    <v-progress-circular size="16" width="3" indeterminate></v-progress-circular>
                  </div>
                  <div v-else-if="tx.status === 'error'">
                    <v-icon color="error">mdi-alert-circle-outline</v-icon>
                  </div>
                  <div v-else-if="tx.status === 'success'">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
          </div>

          <div class="mt-4 d-flex justify-center">
            <v-btn color="primary" v-if="!claimerCreated" @click="createClaimer" :loading="loading">
              Create Claimer
            </v-btn>
            <v-btn color="primary" v-else-if="!routerApproved" @click="approveRouter" :loading="loading">
              Approve Router
            </v-btn>
          </div>

          <div v-if="initing" class="my-4">
            <v-progress-circular indeterminate size="16" width="3" />
            calculating...
          </div>

          <div class="text-caption font-weight-medium">
            <div>
              There will be some transactions, just like the bulksender tool, plz complete all of them<br />
              Do not <span class="error--text">REFRESH</span> the page.<br />
            </div>
          </div>
        </v-form>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop, Ref } from 'vue-property-decorator'
import { chunk, first, get, isEmpty, sumBy, uniq, uniqBy } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'
import { EMPTY_STRING, Zero } from '@/constants'
import { ClaimerEvmContract, claimerMasterEvm } from '@/blockchainHandlers/claimer-contract-solidity'
import { IDetailViewmodel } from '@/modules/mission-detail/viewmodels/base-detail-viewmodel'
import { toJS } from 'mobx'
import { appProvider } from '@/app-providers'
import { walletStore } from '@/stores/wallet-store'
import { snackController } from './snack-bar/snack-bar-controller'
import { FixedNumber } from '@ethersproject/bignumber'
import { Erc20Contract, tokenHelper } from '@/blockchainHandlers/erc20-contract'
import { bnHelper } from '@/helpers/bignumber-helper'
import { promiseHelper } from '@/helpers/promise-helper'
import { apiService } from '@/services/api-service'
import { alertController } from './alert/alert-controller'
import { nextTick } from 'vue/types/umd'
import moment from 'moment'

interface RewardInfo {
  account: string
  amount: FixedNumber
  amountWithDecimals: string
}

interface TransactionInfo {
  rewards: RewardInfo[]
  accounts: string[]
  amountWithDeciamals: string[]
  totalAmount: FixedNumber
  totalAccount: number
  status: 'pending' | 'loading' | 'error' | 'success'
  nonce?: number
  hash?: string
  error?: string
  canSend: boolean
}

@Component
export default class CalculateRewardButtonContainer extends Vue {
  @Ref('form') readonly form!: HTMLFormElement
  @Prop() vm!: IDetailViewmodel

  dialog = false
  claimerCreated = true
  routerApproved = true
  claimerContract?: ClaimerEvmContract
  erc20Contract?: Erc20Contract

  loading = false
  started = false

  userRewards: RewardInfo[] = []
  txs: TransactionInfo[] = []
  lastTransactions?: any = null
  transactionSent = false

  tokenDecimals = 18

  initing = false

  toggleDialog() {
    this.dialog = !this.dialog
    if (this.dialog && !this.userRewards.length) {
      this.loadRewards()
    }
  }

  cancel() {
    this.dialog = false
  }

  async loadRewards() {
    try {
      this.transactionSent = !isEmpty(this.vm.mission.transactions)
      this.lastTransactions = toJS(this.vm.mission.transactions)
      this.initing = true

      this.erc20Contract = tokenHelper.getContract(this.tokenBAddress!, process.env.VUE_APP_CHAIN_ID as any)
      this.tokenDecimals = await this.erc20Contract!.decimals()

      await claimerMasterEvm.initAsync()
      await this.loadClaimerContract()
      const result = await appProvider.api.getTaskUserReport(this.vm.mission.id!, 'rewards')

      // result.forEach((e) => {
      //   e.rewardAmount = `${20 * Math.random()}`
      // })

      this.userRewards = result.map((x) => ({
        account: x.walletAddress,
        amount: FixedNumber.from(`${x.rewardAmount}`),
        amountWithDecimals: bnHelper.toDecimalString(x.rewardAmount, this.tokenDecimals),
      }))
      this.setupTransactions()
    } catch (error) {
      console.error(error)
    }
    this.initing = false
  }

  setupTransactions() {
    const checkUniq = uniqBy(this.userRewards, (x) => x.account)
    if (checkUniq.length !== this.userRewards.length) {
      snackController.error('Reward list has problem, plz contact admin')
      throw new Error('Reward list has problem, plz contact admin')
    }
    const chunks = chunk(this.userRewards, 1)
    this.txs = chunks.map((rewards, index) => {
      const totalUser = rewards.length
      // const totalAmount = Fixe
      return {
        rewards: rewards,
        accounts: rewards.map((x) => x.account),
        amountWithDeciamals: rewards.map((x) => x.amountWithDecimals),
        totalAmount: rewards.reduce((prev, cur) => prev.addUnsafe(cur.amount), Zero),
        totalAccount: rewards.length,
        canSend: index === 0 && this.routerApproved && this.claimerCreated && !this.lastTransactionsText,
        status: 'pending',
      }
    })
  }

  async loadClaimerContract() {
    this.claimerContract = await claimerMasterEvm.getClaimer(this.tokenBAddress!, true)
    this.claimerCreated = !!this.claimerContract
    this.routerApproved = await this.claimerContract.router.isApproved(this.tokenBAddress!, walletStore.account)
    const firstTx = first(this.txs)
    if (firstTx && !firstTx.nonce && !firstTx.canSend && !this.lastTransactionsText) {
      firstTx.canSend = true
    }
  }

  async createClaimer() {
    try {
      this.loading = true
      await claimerMasterEvm.createClaimer(this.tokenBAddress!, walletStore.account)
      this.loadClaimerContract()
    } catch (error) {
      snackController.blockchainError(error)
    }
    this.loading = false
  }

  async approveRouter() {
    try {
      this.loading = true
      await this.claimerContract!.router.approve(this.tokenBAddress!, walletStore.account)
      this.routerApproved = true
      this.loadClaimerContract()
    } catch (error) {
      snackController.blockchainError(error)
    }
    this.loading = false
  }

  userNonce = -1

  // Transaction ITEM START
  async sendTransaction(tx: TransactionInfo) {
    if (tx.error) {
      const result = await alertController.confirm(
        'Confirm resend transaction!',
        `
Please make sure this transaction is not duplicated, or sent before.
<br/>
Contact admin if need.
      `,
        'confirm',
        'cancel'
      )
      if (!result) return
    }
    tx.canSend = false
    tx.status = 'loading'
    const index = this.txs.indexOf(tx)
    const web3 = walletStore.web3!
    const account = walletStore.account
    if (this.userNonce === -1) {
      await this.getUserNonce(web3, account)
    }
    tx.nonce = this.userNonce++
    const contract = this.claimerContract!
    const func = contract.contract.methods.addRewardsFromVoting(
      this.vm.pool.poolId,
      tx.accounts,
      tx.amountWithDeciamals
    )
    func
      .send({ from: account, nonce: tx.nonce })
      .once('transactionHash', (hash) => {
        tx.hash = hash
        if (index < this.txs.length - 1) {
          this.txs[index + 1].canSend = true
        }
        this.updateMissionTransaction()
        this.getTxStatus(tx)
      })
      .once('error', async (err) => {
        tx.status = 'error'
        tx.error = 'Plz contact admin if need, error=' + (err.msg || err.message || err)
        if (!tx.hash) {
          await this.getUserNonce(web3, account)
          tx.canSend = true
          tx.status = 'pending'
        }
      })
  }

  private async getUserNonce(web3, account: string) {
    const [transCount, transPendingCount] = await Promise.all([
      await web3.eth.getTransactionCount(account),
      await web3.eth.getTransactionCount(account, 'pending'),
    ])
    this.userNonce = transPendingCount || transCount
  }

  updateMissionTransaction() {
    const transactionInfos = this.txs
      .filter((x) => x.hash)
      .reduce(
        (prev, cur, index) => ({
          ...prev,
          [index]: {
            hash: cur.hash,
            accounts: cur.accounts.length,
            amounts: cur.totalAmount.toString(),
          },
        }),
        {}
      )
    apiService.updateTask({ ...this.vm.mission, transactions: transactionInfos })
    this.vm.mission.transactions = transactionInfos
    this.lastTransactions = toJS(transactionInfos)
  }

  async getTxStatus(tx: TransactionInfo) {
    const web3 = walletStore.web3!
    const account = walletStore.account
    try {
      const res = await web3.eth.getTransactionReceipt(tx.hash!)
      if (res) {
        if (res.status) {
          tx.status = 'success'
        } else {
          tx.status = 'error'
          tx.error = 'Mined but transaction failed, please contact admin'
        }
      } else {
        await promiseHelper.delay(3000)
        this.getTxStatus(tx)
      }
    } catch (error) {
      console.log('Fetch hash receipt error', tx.hash, error)
      await promiseHelper.delay(3000)
      this.getTxStatus(tx)
    }
  }
  // ======================

  get totalAmount() {
    return this.userRewards.reduce((prev, cur) => prev.addUnsafe(cur.amount), Zero)
  }

  get canClose() {
    if (!this.txs.length) return true
    if (this.txs.every((x) => x.status === 'pending')) return true
    return this.txs.every((x) => x.status === 'success')
  }

  get lastTransactionsText() {
    return Object.values(this.lastTransactions || {})
      .map((x: any) => x.hash)
      .join('<br />')
  }

  get canSendReward() {
    const pool = this.vm.pool
    const mission = this.vm.mission
    return this.tokenBAddress && mission.endTime && moment().isAfter(mission.endTime)
  }

  get tokenBAddress() {
    return this.vm.pool.data?.optionalTokenAddress ?? ''
  }
}
</script>

<style></style>
