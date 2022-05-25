<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip class="text-h6 font-weight-bold text-uppercase text-center ma-5 pa-6" color="bluePrimary" label outlined>
      Bounty pool Information
    </v-chip>

    <v-form ref="fund-info-form" v-model="valid" class="pa-6">
      <div class="blue--text font-18 font-weight-bold mt-6">Reward Information</div>
      <div class="font-18 font-weight-bold mt-6 mb-2">Token reward address</div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(vm.projectInfo, 'tokenAddress')"
        @input="vm.changeProjectInfo('tokenAddress', $event)"
        placeholder="Enter address"
      ></app-text-field>
      <div class="d-flex flex-column flex-sm-row">
        <div class="mt-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Reward token symbol</div>
          <app-text-field
            :rules="[$rules.required]"
            :value="$_get(vm.projectInfo, 'rewardToken')"
            @input="vm.changeProjectInfo('rewardToken', $event)"
            placeholder="Reward token symbol"
          />
        </div>
        <div class="pl-0 pl-sm-6 mt-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Total reward amount</div>
          <app-text-field
            :rules="[$rules.required, $rules.floatNumberOnly]"
            :value="$_get(vm.projectInfo, 'rewardAmount')"
            @input="vm.changeProjectInfo('rewardAmount', $event)"
            placeholder="Enter amount"
          ></app-text-field>
        </div>
      </div>

      <div class="blue--text font-18 font-weight-bold mt-6">Campaign Information</div>
      <div class="d-flex flex-column flex-sm-row mt-3">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Start date</div>
          <app-text-field
            :value="$_get(vm.projectInfo, 'startDate.date')"
            @input="vm.changeProjectInfo('startDate.date', $event)"
            placeholder="dd/mm/yyyy"
          ></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Start time</div>
          <app-text-field
            :value="$_get(vm.projectInfo, 'startDate.time')"
            @input="vm.changeProjectInfo('startDate.time', $event)"
            placeholder="hh:mm"
          ></app-text-field>
        </div>
      </div>

      <div class="d-flex flex-column flex-sm-row mt-6">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">End date</div>
          <app-text-field
            :value="$_get(vm.projectInfo, 'endDate.date')"
            @input="vm.changeProjectInfo('endDate.date', $event)"
            placeholder="dd/mm/yyyy"
          ></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">End time</div>
          <app-text-field
            :value="$_get(vm.projectInfo, 'endDate.time')"
            @input="vm.changeProjectInfo('endDate.time', $event)"
            placeholder="hh:mm"
          ></app-text-field>
        </div>
      </div>

      <div class="font-18 flex-grow-1 mt-6 mb-2">
        <span class="font-weight-bold">Total missions</span>
        <!-- <span class="ml-1">(Max is 10 mission)</span> -->
      </div>
      <app-text-field
        :rules="[$rules.required, $rules.integer, $rules.max(10), $rules.min(1)]"
        :value="$_get(vm.projectInfo, 'totalMissions')"
        @input="vm.changeProjectInfo('totalMissions', $event)"
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
