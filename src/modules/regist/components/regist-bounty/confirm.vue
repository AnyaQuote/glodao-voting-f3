<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip font-18 outlined color="bluePrimary" class="ma-5 text-h6 font-weight-bold text-center pa-6">Confirm</v-chip>

    <v-form ref="payment-form" class="pa-6">
      <div class="d-flex align-center">
        <img src="@/assets/icons/mock-crypto.svg" alt="currency" width="36" height="36" />
        <div class="text-h5 font-weight-bold text-capitalize line-height-1 ml-3" height="fit-content">
          {{ vm.projectInfo.projectName }}
        </div>
        <!-- <v-icon color="neutral10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">$HWD</div> -->
        <v-icon color="neutral10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">
          {{ vm.projectInfo.rewardAmount }} {{ vm.projectInfo.tokenName }}
        </div>
      </div>

      <div class="ma-7">
        <div class="mb-2 font-18 font-weight-bold">Please send full amount of reward token to create pool</div>
        <div class="mb-7">
          <i
            >After your application is submitted, create pool fee will be taken and not be refunded for any reason. You
            can still edit pool information after that.</i
          >
        </div>

        <div class="d-flex font-18 mb-2">
          <span class="mr-2">BNB balance:</span>
          <span class="font-weight-medium">{{ walletStore.bnbBalance | formatNumber }} BNB</span>
        </div>

        <div class="font-18">
          <span class="mr-2">Reward Token Balance:</span>
          <span class="font-weight-medium"
            >{{ vm.rewardTokenBalance | formatNumber }} {{ vm.projectInfo.tokenName }}</span
          >
        </div>

        <v-sheet outlined class="pa-3 rounded-lg font-18 font-weight-600 mt-6">
          <div class="mb-3 d-flex">
            <span class="neutral10--text">Total campaign reward:</span>
            <span class="flex-grow-1 text-end">{{ vm.projectInfo.rewardAmount }} {{ vm.projectInfo.tokenName }}</span>
          </div>
          <div class="mb-3 d-flex">
            <span class="neutral10--text">Total send:</span>
            <span class="app-blue--text flex-grow-1 text-end"
              >{{ vm.projectInfo.rewardAmount }} {{ vm.projectInfo.tokenName }}</span
            >
          </div>
          <div class="d-flex">
            <span class="neutral10--text">Creating pool fee:</span>
            <span class="app-blue--text flex-grow-1 text-end">{{ vm.bnbFee | formatNumber }} BNB</span>
          </div>
        </v-sheet>

        <ul class="mt-6">
          <li class="mb-2 font-weight-600">Project will published immediately after creating pool</li>
          <li class="font-weight-600">Project will be voted within 72 hours from creating time!</li>
        </ul>

        <v-btn
          v-if="!vm.approved"
          class="linear-blue--bg white--text font-weight-bold text-none mt-6"
          block
          height="40"
          depressed
          :loading="vm.approving || vm.approveChecking"
          @click="vm.approve()"
        >
          <span class="btn-font">Approve</span>
        </v-btn>
        <v-btn
          v-else
          class="linear-blue--bg white--text font-weight-bold text-none mt-6"
          width="100%"
          height="40"
          depressed
          @click="submit"
          :loading="vm.creating"
        >
          Confirm and pay fee
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { walletStore } from '@/stores/wallet-store'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'

@Component
export default class ConfirmPayment extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('payment-form') form
  walletStore = walletStore

  mounted() {
    this.vm.loadConfirmData()
  }

  submit() {
    this.form.validate() && this.vm.submit()
  }
}
</script>

<style lang="scss" scoped></style>
