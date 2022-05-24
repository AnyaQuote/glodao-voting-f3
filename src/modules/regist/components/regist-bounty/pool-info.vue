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
      <div class="d-flex flex-column flex-sm-row mt-3">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Start date</div>
          <app-text-field
            :rules="[$rules.required, $rules.yyyymmdd]"
            :value="$_get(vm.poolInfo, 'startDate.date')"
            @input="vm.changePoolInfo('startDate.date', $event)"
            placeholder="dd/mm/yyyy"
          ></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Start time</div>
          <app-text-field
            :rules="[$rules.required, $rules.hhmm]"
            :value="$_get(vm.poolInfo, 'startDate.time')"
            @input="vm.changePoolInfo('startDate.time', $event)"
            placeholder="hh:mm"
          ></app-text-field>
        </div>
      </div>

      <div class="d-flex flex-column flex-sm-row mt-6">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">End date</div>
          <app-text-field
            :rules="[$rules.required, $rules.yyyymmdd]"
            :value="$_get(vm.poolInfo, 'endDate.date')"
            @input="vm.changePoolInfo('endDate.date', $event)"
            placeholder="dd/mm/yyyy"
          ></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">End time</div>
          <app-text-field
            :rules="[$rules.required, $rules.hhmm]"
            :value="$_get(vm.poolInfo, 'endDate.time')"
            @input="vm.changePoolInfo('endDate.time', $event)"
            placeholder="hh:mm"
          ></app-text-field>
        </div>
      </div>

      <div class="font-18 flex-grow-1 mt-6 mb-2">
        <span class="font-weight-bold">Total missions</span>
        <span class="ml-1">(Max is 10 mission)</span>
      </div>
      <app-text-field
        :rules="[$rules.required, $rules.integer, $rules.max(10), $rules.min(1)]"
        :value="$_get(vm.poolInfo, 'totalMissions')"
        @input="vm.changePoolInfo('totalMissions', $event)"
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
    <confirm-campaign-dialog ref="confirm-dialog" />
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'

@Observer
@Component({
  components: {
    'confirm-campaign-dialog': () => import('../regist-bounty/confirm-campaign-dialog.vue'),
  },
})
export default class RaisingInfo extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('confirm-dialog') dialog
  @Ref('fund-info-form') form
  valid = false
  tokens = ['HWD', 'BNB']
  submit() {
    this.form.validate() && this.dialog.open()
  }
}
</script>

<style lang="scss" scoped></style>
