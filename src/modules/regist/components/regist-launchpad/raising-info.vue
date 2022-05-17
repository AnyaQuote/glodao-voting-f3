<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip class="text-h6 font-weight-bold text-uppercase text-center ma-5 pa-6" color="bluePrimary" label outlined>
      Raising Fund Information
    </v-chip>

    <v-form ref="fund-info-form" class="pa-6">
      <div class="d-flex align-center">
        <img src="@/assets/icons/mock-crypto.svg" alt="currency" width="36" height="36" />
        <div class="text-h5 font-weight-bold text-capitalize line-height-1 ml-3" height="fit-content">hydro wind</div>
        <v-icon color="neutral10">mdi-circle-small</v-icon>
        <div class="neutral10--text text-h5 font-weight-bold">$HWD</div>
      </div>
      <div class="d-flex flex-column flex-sm-row">
        <div class="mt-6 flex-grow-1">
          <div class="label font-weight-bold">Total raise</div>
          <app-text-field
            :value="$_get(vm.fundInfo, 'totalRaise')"
            @input="vm.changeFundInfo('totalRaise', $event)"
            placeholder="Enter amount"
          ></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 mt-6 flex-grow-1">
          <div class="label font-weight-bold">Total sale</div>
          <app-text-field
            :value="$_get(vm.fundInfo, 'totalSale')"
            @input="vm.changeFundInfo('totalSale', $event)"
            placeholder="Enter amount"
          ></app-text-field>
        </div>
      </div>
      <div class="label font-weight-bold mt-6">
        Price ratio
        <span class="neutral10--text"> (per 1 token) </span>
      </div>
      <app-text-field
        :value="$_get(vm.fundInfo, 'priceRatio')"
        @input="vm.changeFundInfo('priceRatio', $event)"
        placeholder="Enter amount"
      >
        <template #append>
          <div class="d-flex flex-nowrap align-center font-weiglt-light text-nowrap">
            <v-divider class="mx-3" vertical></v-divider>
            1 TPT = 0.24 BUSD
          </div>
        </template>
      </app-text-field>
      <div class="blue--text label font-weight-bold mt-6">Vesting Schedule</div>
      <div class="label font-weight-bold mt-6">How long does the token distribute?</div>
      <duration-selector @change="vm.changeFundInfo('distibuteDuration', $event)" />
      <div class="label font-weight-bold mt-6">First distribute time</div>
      <div class="d-flex flex-column flex-sm-row">
        <app-text-field
          :value="$_get(vm.fundInfo, 'distributeTime.date')"
          @input="vm.changeFundInfo('distributeTime.date', $event)"
          placeholder="DD/MM/YYYY"
        ></app-text-field>
        <app-text-field
          class="pl-0 pl-sm-6 mt-6 mt-sm-0"
          :value="$_get(vm.fundInfo, 'distributeTime.time')"
          @input="vm.changeFundInfo('distributeTime.time', $event)"
          placeholder="00:00"
        ></app-text-field>
      </div>
      <div class="blue--text label font-weight-bold mt-6">Time for lauching</div>
      <div class="d-flex flex-column flex-sm-row">
        <div class="mt-6 flex-grow-1">
          <div class="label font-weight-bold">Start date</div>
          <app-text-field
            :value="$_get(vm.fundInfo, 'startDate.date')"
            @input="vm.changeFundInfo('startDate.date', $event)"
            placeholder="DD/MM/YYYY"
          ></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 mt-6 flex-grow-1">
          <div class="label font-weight-bold">Start time</div>
          <app-text-field
            :value="$_get(vm.fundInfo, 'startDate.time')"
            @input="vm.changeFundInfo('startDate.time', $event)"
            placeholder="00:00"
          ></app-text-field>
        </div>
      </div>
      <v-btn
        class="linear-blue--bg white--text font-weight-600 text-none elevation-0 mt-6"
        width="100%"
        height="40"
        @click="submit"
      >
        Continue
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { LaunchpadFormViewModel } from '../../viewmodels/launchpad-form-viewmodel'

@Component({
  components: {
    'duration-selector': () => import('../common/duration-selector.vue'),
  },
})
export default class RaisingInfo extends Vue {
  @Inject() vm!: LaunchpadFormViewModel
  @Ref('fund-info-form') form

  submit() {
    this.form.validate() && this.vm.nextStep(2.1)
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-size: em(18);
  margin-bottom: em(8);
}
</style>
