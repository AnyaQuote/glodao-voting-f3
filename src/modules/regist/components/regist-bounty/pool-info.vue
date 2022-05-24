<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip class="text-h6 font-weight-bold text-uppercase text-center ma-5 pa-6" color="bluePrimary" label outlined>
      Bounty pool Information
    </v-chip>

    <v-form ref="fund-info-form" v-model="valid" class="pa-6">
      <div class="blue--text font-18 font-weight-bold mt-6">Reward Information</div>
      <div class="d-flex flex-column flex-sm-row">
        <div class="mt-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Reward token</div>
          <app-select
            :rules="[$rules.required]"
            :items="tokens"
            :value="$_get(vm.poolInfo, 'rewardToken')"
            @change="vm.changePoolInfo('rewardToken', $event)"
            placeholder="RewardToken"
          />
        </div>
        <div class="pl-0 pl-sm-6 mt-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Total reward amount</div>
          <app-text-field
            :rules="[$rules.required, $rules.floatNumberOnly]"
            :value="$_get(vm.poolInfo, 'rewardAmount')"
            @input="vm.changePoolInfo('rewardAmount', $event)"
            placeholder="Enter amount"
          ></app-text-field>
        </div>
      </div>
      <div class="font-18 font-weight-bold mt-6 mb-2">Token reward address</div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(vm.poolInfo, 'tokenAddress')"
        @input="vm.changePoolInfo('tokenAddress', $event)"
        placeholder="Enter amount"
      ></app-text-field>

      <div class="blue--text font-18 font-weight-bold mt-6">Campaign Information</div>
      <div class="font-18 font-weight-bold mt-4">Campaign duration</div>
      <v-radio-group
        :rules="[$rules.required]"
        :value="$_get(vm.poolInfo, 'campaignDuration')"
        @change="vm.changePoolInfo('campaignDuration', $event)"
        class="pa-0 ma-0 mt-2"
      >
        <div class="d-flex flex-column flex-md-row">
          <v-sheet outlined class="py-3 px-4 rounded mb-2 mb-md-0 flex-grow-1">
            <v-radio class="font-weight-bold" label="7 days" value="7" />
          </v-sheet>
          <v-sheet outlined class="ml-0 ml-md-6 py-3 px-4 rounded mb-2 mb-md-0 flex-grow-1">
            <v-radio class="font-weight-bold" label="15 days" value="15" />
          </v-sheet>
          <v-sheet outlined class="ml-0 ml-md-6 py-3 px-4 rounded flex-grow-1">
            <v-radio class="font-weight-bold" label="30 days" value="30" />
          </v-sheet>
        </div>
      </v-radio-group>

      <div class="d-flex flex-column flex-sm-row mt-3">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Start date</div>
          <app-text-field
            :rules="[$rules.required, $rules.yyyymmdd]"
            :value="$_get(vm.poolInfo, 'startDate.date')"
            @input="vm.changePoolInfo('startDate.date', $event)"
            placeholder="DD/MM/YYYY"
          ></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Start time</div>
          <app-text-field
            :rules="[$rules.required, $rules.hhmm]"
            :value="$_get(vm.poolInfo, 'startDate.time')"
            @input="vm.changePoolInfo('startDate.time', $event)"
            placeholder="00:00"
          ></app-text-field>
        </div>
      </div>

      <div class="font-18 flex-grow-1 mt-6 mb-2">
        <span class="font-weight-bold">Total mission</span>
        <span class="ml-1">(Max is 10 mission)</span>
      </div>
      <app-text-field
        :rules="[$rules.required, $rules.integer, $rules.max(10), $rules.min(1)]"
        :value="$_get(vm.poolInfo, 'totalMission')"
        @input="vm.changePoolInfo('totalMission', $event)"
        placeholder="Enter number of missions"
      ></app-text-field>

      <v-btn
        class="white--text font-weight-600 text-none elevation-0 mt-6"
        :class="valid && 'linear-blue--bg'"
        :disabled="!valid"
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
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'

@Component({
  components: {
    'duration-selector': () => import('../common/duration-selector.vue'),
  },
})
export default class RaisingInfo extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('fund-info-form') form
  valid = false
  tokens = ['HWD', 'BNB']
  submit() {
    this.form.validate() && this.vm.nextStep(2.1)
  }
}
</script>

<style lang="scss" scoped></style>
