<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip color="bluePrimary" label outlined class="text-h6 ma-5 font-weight-bold text-center pa-6"
      >Send token</v-chip
    >

    <v-form ref="send-token-form" class="pa-6">
      <div class="d-flex align-center">
        <img src="@/assets/icons/mock-crypto.svg" alt="currency" width="36" height="36" />
        <div class="text-h5 font-weight-bold text-capitalize line-height-1 ml-3" height="fit-content">hydro wind</div>
        <v-icon color="neutral10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">$HWD</div>
      </div>
      <!-- ----------------------------- BILL CONTENT ----------------------------- -->
      <div class="font-18 font-weight-600 mt-6 d-flex">
        <span>Total campaign reward:</span>
        <span class="font-weight-bold flex-grow-1 text-end">1,000,000 HWD</span>
      </div>
      <div class="font-18 font-weight-600 mt-3 d-flex">
        <span>Balance:</span>
        <span class="font-weight-bold flex-grow-1 text-end">765,680,000 HWD</span>
      </div>
      <div class="font-18 font-weight-600 mt-3 d-flex">
        <span>Total send:</span>
        <span class="font-weight-bold blue--text flex-grow-1 text-end">765,680,000 HWD</span>
      </div>
      <!-- ------------------------------------------------------------------------- -->
      <div class="font-weight-light font-italic text-center mt-6">
        *Your token will be sent in contract and used for awarding to your all winning participant if your bounty
        project is approved. Otherwise, you can withdraw anytime.
      </div>
      <v-btn
        class="linear-blue--bg white--text font-weight-bold text-none mt-6"
        width="100%"
        height="40"
        depressed
        @click="submit"
      >
        Send
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Inject, Vue, Ref } from 'vue-property-decorator'
import { LaunchpadFormViewModel } from '../../viewmodels/launchpad-form-viewmodel'

@Component
export default class SendToken extends Vue {
  @Inject() vm!: LaunchpadFormViewModel
  @Ref('send-token-form') form
  submit() {
    this.form.validate() && this.vm.submit()
  }
}
</script>

<style lang="scss" scoped>
.blue-border {
  border: thin solid var(--v-bluePrimary-base);
}
</style>
