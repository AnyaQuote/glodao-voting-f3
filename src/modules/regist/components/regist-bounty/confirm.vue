<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip
      label
      outlined
      color="app-blue"
      class="ma-5 neutral-0--text font-18 font-weight-bold text-center pa-6 text-uppercase"
    >
      Confirm
    </v-chip>

    <v-form ref="payment-form" class="pa-6">
      <div class="d-flex align-center">
        <img src="@/assets/icons/mock-crypto.svg" alt="currency" width="36" height="36" />
        <div class="text-h5 font-weight-bold text-capitalize line-height-1 ml-3" height="fit-content">
          {{ vm.projectInfo.projectName }}
        </div>
        <!-- <v-icon color="neutral10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">$HWD</div> -->
        <v-icon color="neutral-10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">{{ vm.rewardAmount }} {{ vm.projectInfo.tokenName }}</div>
      </div>

      <div class="ma-7">
        <div class="mb-2 font-18 font-weight-bold">Please send full amount of reward token to create pool</div>
        <div class="mb-7">
          <i>
            *Your token will be sent in contract and used for awarding to your all winning participant if your bounty
            project is approved. Otherwise, you can withdraw anytime.
          </i>
        </div>

        <div class="d-flex font-18 mb-2">
          <span class="mr-2">BNB balance:</span>
          <span class="font-weight-medium">{{ walletStore.bnbBalance | formatNumber }} BNB</span>
        </div>

        <div class="font-18 mb-2">
          <span class="mr-2">{{ vm.projectInfo.tokenName }} Balance:</span>
          <span class="font-weight-medium">
            {{ vm.rewardTokenBalance | formatNumber }} {{ vm.projectInfo.tokenName }}
          </span>
        </div>

        <div class="font-18">
          <span class="mr-2">Project reward token Balance:</span>
          <span class="font-weight-medium">
            {{ vm.optionalRewardTokenBalance | formatNumber }} {{ vm.projectInfo.optionalTokenName }}
          </span>
        </div>

        <v-sheet outlined class="pa-3 rounded-lg font-18 font-weight-600 mt-6">
          <div class="mb-3 d-flex">
            <span class="neutral10--text">Total campaign reward:</span>
            <span class="flex-grow-1 text-end"
              >{{ vm.projectInfo.optionalRewardAmount }} {{ vm.projectInfo.optionalTokenName }}</span
            >
          </div>
          <div class="mb-3 d-flex">
            <span class="neutral10--text">Total mission fees:</span>
            <span class="app-blue--text flex-grow-1 text-end">
              {{ vm.projectInfo.rewardAmount }} {{ vm.projectInfo.tokenName }}
            </span>
          </div>
          <div class="d-flex">
            <span class="neutral10--text">Creating pool fee:</span>
            <span class="app-blue--text flex-grow-1 text-end">{{ vm.bnbFee | formatNumber }} BNB</span>
          </div>
        </v-sheet>

        <!-- <ul class="mt-6">
          <li class="mb-2 font-weight-600"></li>
          <li class="font-weight-600">Project will be voted within 72 hours from creating time!</li>
        </ul> -->

        <v-btn
          v-if="!vm.approved"
          class="linear-blue--bg white--text font-weight-bold text-none mt-6"
          block
          height="40"
          depressed
          :loading="vm.approving || vm.approveChecking"
          @click="vm.approve()"
        >
          <span class="btn-font">{{ vm.projectInfo.tokenName }} approve contract</span>
        </v-btn>
        <v-btn
          v-else-if="$_get(vm.projectInfo, 'optionalTokenAddress') && !vm.optionalApproved"
          class="linear-blue--bg white--text font-weight-bold text-none mt-6"
          block
          height="40"
          depressed
          :loading="vm.optionalApproving || vm.approveChecking"
          @click="vm.optionalApprove()"
        >
          <span class="btn-font">{{ vm.projectInfo.optionalTokenName }} approve contract</span>
        </v-btn>
        <v-btn
          v-else
          class="linear-blue--bg white--text font-weight-bold text-none mt-6 text-subtitle-1"
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
