<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip label outlined color="bluePrimary" class="ma-5 text-h6 font-weight-bold text-center pa-6">Confirm</v-chip>

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

        <div class="d-flex font-18 font-weight-bold">
          <span>Creating pool fee:</span>
          <span class="bluePrimary--text">&nbsp;0.2 BNB</span>
        </div>

        <div class="font-18 font-weight-bold mt-5">
          <span>Balance:</span>
          <span>&nbsp;20.68 BNB</span>
        </div>

        <ul class="mt-5">
          <li class="mb-2 font-weight-600">Project will published immediately after creating pool</li>
          <li class="font-weight-600">Project will be voted within 72 hours from creating time!</li>
        </ul>

        <v-btn
          class="linear-blue--bg white--text font-weight-bold text-none mt-6"
          width="100%"
          height="40"
          depressed
          @click="submit"
        >
          Confirm and pay fee
        </v-btn>
      </div>
    </v-form>
    <confirm-campaign-dialog ref="confirm-dialog" />
  </v-sheet>
</template>

<script lang="ts">
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

  submit() {
    this.form.validate() && this.dialog.open()
  }
}
</script>

<style lang="scss" scoped></style>
