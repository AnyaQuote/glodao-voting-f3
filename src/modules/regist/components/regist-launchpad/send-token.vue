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
      <div class="label font-weight-600 mt-6">
        Total sale:
        <span class="blue--text font-weight-bold ml-1">1,000,000 HWD</span>
      </div>
      <div class="label font-weight-600 mt-3">
        Balance:
        <span class="font-weight-bold ml-1">765,680,000 HWD</span>
      </div>
      <div class="neutral10--text label font-weight-bold mt-6">Lock token</div>
      <app-text-field
        :value="$_get(vm.sendToken, 'lockToken')"
        @input="vm.changeSendTokenInfo('lockToken', $event)"
        class="blue-border"
        placeholder="Enter amount"
      >
        <template #append>
          <div class="label mt-2 neutral10--text font-weight-bold">HWD</div>
        </template>
      </app-text-field>
      <div class="font-weight-light font-italic mt-6">
        *Your token will be locked in contract and use for distribution to your all investors if your project is
        approved. Otherwise, you can withdraw anytime.
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
.label {
  font-size: em(18);
  margin-bottom: em(8);
}
.blue-border {
  border: thin solid var(--v-bluePrimary-base);
}
</style>
