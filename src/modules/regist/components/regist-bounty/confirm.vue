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
          After your application is submitted, create pool fee will be taken and not be refunded for any reason. You can
          still edit pool information after that.
        </div>

        <div class="d-flex label font-weight-bold">
          <span>Creating pool fee:</span>
          <span class="bluePrimary--text">&nbsp;0.2 BNB</span>
        </div>

        <div class="label font-weight-bold">
          <span>Balance:</span>
          <span>&nbsp;20.68 BNB</span>
        </div>

        <div class="label font-weight-bold">
          <span class="bluePrimary--text">Time for launch on DAO Voting</span>
          <v-checkbox
            :value="$_get(vm.paymentInfo, 'immediate')"
            @change="vm.changePaymentInfo('immediate', $event)"
            label="Publish project immediately after creating pool"
          ></v-checkbox>
          <div class="d-flex">
            <div class="mr-6 flex-grow-1">
              <span>Start date</span>
              <app-text-field
                :value="$_get(vm.paymentInfo, 'openDate.date')"
                @input="vm.changePaymentInfo('openDate.date', $event)"
                placeholder="DD/MM/YYYY"
              ></app-text-field>
            </div>
            <div class="flex-grow-1">
              <span>Start time</span>
              <app-text-field
                :value="$_get(vm.paymentInfo, 'openDate.time')"
                @input="vm.changePaymentInfo('openDate.time', $event)"
                placeholder="00:00"
              ></app-text-field>
            </div>
          </div>
        </div>
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
  </v-sheet>
</template>

<script lang="ts">
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { BountyFormViewModel } from '../../viewmodels/bounty-form-viewmodel'

@Component
export default class ConfirmPayment extends Vue {
  @Inject() vm!: BountyFormViewModel
  @Ref('payment-form') form

  submit() {
    this.form.validate() && this.vm.submit()
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-size: em(18) !important;
  margin-bottom: em(20);
}
.blue-border {
  border: thin solid var(--v-bluePrimary-base);
}
</style>
