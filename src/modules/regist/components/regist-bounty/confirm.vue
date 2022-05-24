<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip font-18 outlined color="bluePrimary" class="ma-5 text-h6 font-weight-bold text-center pa-6">Confirm</v-chip>

    <v-form ref="payment-form" class="pa-6">
      <div class="d-flex align-center">
        <img src="@/assets/icons/mock-crypto.svg" alt="currency" width="36" height="36" />
        <div class="text-h5 font-weight-bold text-capitalize line-height-1 ml-3" height="fit-content">hydro wind</div>
        <v-icon color="neutral10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">$HWD</div>
        <v-icon color="neutral10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">100,000 HWD reward</div>
      </div>

      <div class="ma-7">
        <div class="mb-7">
          <i
            >After your application is submitted, create pool fee will be taken and not be refunded for any reason. You
            can still edit pool information after that.</i
          >
        </div>

        <div class="d-flex label font-weight-bold">
          <span>Creating pool fee:</span>
          <span class="bluePrimary--text">{{ vm.bnbFee | formatNumber }} BNB</span>
        </div>

        <div class="label font-weight-bold">
          <span>Balance:</span>
          <span> {{ walletStore.bnbBalance | formatNumber }} BNB</span>
        </div>

        <ul class="mt-5">
          <li class="mb-2 font-weight-600">Project will published immediately after creating pool</li>
          <li class="font-weight-600">Project will be voted within 72 hours from creating time!</li>
        </ul>

        <v-btn
          v-if="!vm.approved"
          class="linear-blue--bg white--text font-weight-bold text-none mt-6"
          block
          depressed
          :loading="vm.approving"
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
    <confirm-campaign-dialog ref="confirm-dialog" />
  </v-sheet>
</template>

<script lang="ts">
import { walletStore } from '@/stores/wallet-store'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'

@Component({
  components: {
    'confirm-campaign-dialog': () => import('../regist-bounty/confirm-campaign-dialog.vue'),
  },
})
export default class ConfirmPayment extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('confirm-dialog') dialog
  @Ref('payment-form') form
  walletStore = walletStore

  submit() {
    this.form.validate() && this.vm.submit()
  }
}
</script>

<style lang="scss" scoped></style>
