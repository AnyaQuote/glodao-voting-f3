<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip
      class="font-18 font-weight-bold neutral-0--text text-uppercase text-center ma-5 pa-6"
      color="app-blue"
      label
      outlined
    >
      Bounty Pool Information
    </v-chip>

    <v-form ref="fund-info-form" v-model="valid" class="pa-6">
      <div class="blue--text font-18 font-weight-bold">Reward Information</div>
      <!-- <div class="font-18 font-weight-bold mb-2">Token reward address</div>
      <app-text-field
        :rules="[$rules.required, $rules.isAddress]"
        :value="$_get(vm.projectInfo, 'tokenAddress')"
        @input="vm.changeProjectInfo('tokenAddress', $event)"
        placeholder="Enter address"
      ></app-text-field> -->
      <div class="d-flex flex-column flex-sm-row">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Reward amount</div>
          <app-text-field
            :rules="[$rules.required, $rules.floatNumberOnly]"
            :value="$_get(vm.projectInfo, 'rewardAmount')"
            @input="vm.changeProjectInfo('rewardAmount', $event)"
            placeholder="Enter amount"
            class="pb-0"
          ></app-text-field>
        </div>
        <div class="pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Token reward</div>
          <v-autocomplete
            item-text="tokenName"
            item-value="tokenAddress"
            :items="vm.tokenList"
            solo
            outlined
            flat
            :value="$_get(vm.projectInfo, 'tokenAddress')"
            :rules="[$rules.required]"
            @input="vm.changeProjectInfo('tokenAddress', $event)"
          ></v-autocomplete>
        </div>
      </div>

      <div>
        <span class="font-18 font-weight-bold blue-diversity--text">Project reward</span>
        <i class="neutral-10--text ml-2">(optional)</i>
      </div>
      <div class="font-18 font-weight-bold mb-2">Token reward address</div>
      <app-text-field
        :rules="[$rules.isAddress]"
        :value="$_get(vm.projectInfo, 'optionalTokenAddress')"
        @input="vm.changeProjectInfo('optionalTokenAddress', $event)"
        placeholder="Enter address"
      ></app-text-field>
      <div class="d-flex flex-column flex-sm-row">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Reward amount</div>
          <app-text-field
            :rules="[$rules.floatNumberOnly]"
            :value="$_get(vm.projectInfo, 'optionalRewardAmount')"
            @input="vm.changeProjectInfo('optionalRewardAmount', $event)"
            placeholder="Enter amount"
          ></app-text-field>
        </div>
        <div class="pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Reward token symbol</div>
          <app-text-field
            :value="$_get(vm.projectInfo, 'optionalTokenName')"
            :loading="vm.tokenInfoLoading"
            disabled
            placeholder="Token symbol"
          />
        </div>
      </div>

      <div>
        <span class="font-18 font-weight-bold blue-diversity--text">Voting duration</span>
        <i class="neutral-10--text ml-2">(Locale time)</i>
      </div>
      <div class="font-italic text-subtitle-1 neutral-10--text mb-2">
        *Voting duration is 3 days counting from the project creation date. The time is mark when you begin creating
        this project.
      </div>
      <div class="mb-1 font-18">
        <span class="font-weight-bold">Your project voting will start in: </span>
        <span>{{ $_get(vm.projectInfo, 'votingStart') | ddmmyyyy }}</span>
      </div>
      <div class="mb-7 font-18">
        <span class="font-weight-bold">Your project voting will ends in: </span>
        <span>{{ $_get(vm.projectInfo, 'votingEnd') | ddmmyyyy }}</span>
      </div>

      <div>
        <span class="font-18 font-weight-bold blue-diversity--text">Campaign Information</span>
        <i class="neutral-10--text ml-2">(Locale time)</i>
      </div>
      <app-datetime-picker
        class="font-18"
        dateLabel="Start date"
        timeLabel="Start time"
        :rules="[$rules.required]"
        :maxDate="$_get(vm.projectInfo, 'endDate')"
        :value="$_get(vm.projectInfo, 'startDate')"
        @change="vm.changeProjectInfo('startDate', $event)"
      />
      <app-datetime-picker
        class="font-18"
        dateLabel="End date"
        timeLabel="End time"
        :rules="[$rules.required]"
        :disabled="!$_get(vm.projectInfo, 'startDate')"
        :minDate="$_get(vm.projectInfo, 'startDate')"
        :value="$_get(vm.projectInfo, 'endDate')"
        @change="vm.changeProjectInfo('endDate', $event)"
      />

      <div class="flex-grow-1 mb-2">
        <span class="font-weight-bold font-18 mr-1">Total missions</span>
      </div>
      <app-text-field
        class="font-18"
        :rules="[$rules.required, $rules.integer, $rules.min(1)]"
        :value="$_get(vm.projectInfo, 'totalMissions')"
        @input="vm.changeProjectInfo('totalMissions', $event)"
        placeholder="Enter number of missions"
      ></app-text-field>

      <v-btn
        class="white--text font-weight-600 text-none elevation-0 text-subtitle-1"
        :class="valid && !vm.tokenInfoLoading && 'linear-blue--bg'"
        :disabled="!valid || vm.tokenInfoLoading"
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
    'app-datetime-picker': () => import('@/components/app-datetime-picker.vue'),
  },
})
export default class RaisingInfo extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('confirm-dialog') dialog
  @Ref('fund-info-form') form
  valid = false
  tokens = ['GLD', 'BUSD', 'USDT']
  submit() {
    this.form.validate() && this.dialog.open()
  }
}
</script>

<style lang="scss" scoped></style>
