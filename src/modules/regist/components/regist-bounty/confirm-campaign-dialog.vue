<template>
  <app-dialog ref="dialog">
    <v-card>
      <v-card-title>
        Confirm campaign dialog
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
          <span class="font-weight-bold neutral0--text">{{ startDate | MMDoYYYY }}</span>
        </div>

        <div class="font-18 d-flex mb-4">
          <span>End in:</span>
          <v-spacer />
          <span class="font-weight-bold neutral0--text">{{ endDate | MMDoYYYY }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="linear-blue--bg text-none white--text mb-2" block depressed @click="submit"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </app-dialog>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Ref, Inject } from 'vue-property-decorator'
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'
import { toISO } from '@/helpers/date-helper'
import { toNumber } from 'lodash'

@Observer
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
    this.vm.nextStep(2.1)
  }

  get rewardPerMission() {
    return toNumber(this.vm.poolInfo.rewardAmount) / toNumber(this.vm.poolInfo.totalMissions)
  }

  get startDate() {
    return toISO(this.vm.poolInfo.endDate)
  }

  get endDate() {
    return toISO(this.vm.poolInfo.endDate)
  }
}
</script>

<style scoped></style>
