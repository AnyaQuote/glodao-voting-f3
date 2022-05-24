<template>
  <app-dialog ref="dialog">
    <v-card>
      <v-card-title>
        Confirm campaing dialog
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-card-title>

      <v-card-text>
        <div class="font-18 d-flex mt-4 mb-2">
          <span>Total reward:</span>
          <v-spacer />
          <span class="font-weight-bold neutral0--text"
            >{{ $_get(vm.poolInfo, 'rewardAmount') }} {{ $_get(vm.poolInfo, 'rewardToken') }}</span
          >
        </div>

        <div class="font-18 d-flex mb-2">
          <span>Total missions:</span>
          <v-spacer />
          <span class="font-weight-bold neutral0--text">{{ $_get(vm.poolInfo, 'totalMissions') }}</span>
        </div>

        <div class="font-18 d-flex mb-2">
          <span>Reward per mission:</span>
          <v-spacer />
          <span class="font-weight-bold neutral0--text"
            >{{ rewardPerMission }} {{ $_get(vm.poolInfo, 'rewardToken') }}</span
          >
        </div>

        <div class="font-18 d-flex mb-2">
          <span>Start in:</span>
          <v-spacer />
          <span class="font-weight-bold neutral0--text">{{ startDate }}</span>
        </div>

        <div class="font-18 d-flex mb-4">
          <span>End in:</span>
          <v-spacer />
          <span class="font-weight-bold neutral0--text">{{ endDate }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="linear-blue--bg text-none white--text mb-2" block @click="submit"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </app-dialog>
</template>

<script lang="ts">
import { Component, Vue, Ref, Inject } from 'vue-property-decorator'
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'
import { toNumber } from 'lodash-es'
import { toMoment } from '@/helpers/date-helper'
@Component
export default class ConfirmCampaignDialog extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('dialog') dialog
  close() {
    this.dialog.close()
  }
  open() {
    this.dialog.open()
  }
  submit() {
    this.vm.nextStep(2.2)
  }
  get rewardPerMission() {
    return toNumber(this.vm.poolInfo.rewardAmount) / toNumber(this.vm.poolInfo.totalMissions)
  }
  get startDate() {
    return toMoment(this.vm.poolInfo.startDate).toISOString()
  }
  get endDate() {
    return toMoment(this.vm.poolInfo.startDate).add(this.vm.poolInfo.campaignDuration, 'days').toISOString()
  }
}
</script>

<style scoped></style>
