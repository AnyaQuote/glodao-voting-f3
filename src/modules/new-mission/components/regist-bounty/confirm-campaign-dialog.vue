<template>
  <app-dialog ref="dialog">
    <v-card class="neutral-100">
      <v-card-title class="font-weight-bold">
        Confirm campaign information
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-card-title>

      <v-card-text>
        <div class="font-18 d-flex mt-4 mb-2">
          <span class="font-weight-600">Total reward:</span>
          <v-spacer />
          <span class="font-weight-bold neutral-0--text"
            >{{ $_get(vm.projectInfo, 'optionalRewardAmount') }} {{ vm.tokenName }}</span
          >
        </div>

        <div class="font-18 d-flex mb-2">
          <span class="font-weight-600">Total missions:</span>
          <v-spacer />
          <span class="font-weight-bold neutral-0--text">{{ $_get(vm.projectInfo, 'totalMissions') }}</span>
        </div>

        <div class="font-18 d-flex mb-2">
          <span class="font-weight-600">Reward per mission:</span>
          <v-spacer />
          <span class="font-weight-bold neutral-0--text">
            {{ vm.rewardPerMission | formatNumber(2) }} {{ vm.tokenName }}
          </span>
        </div>

        <div class="font-18 d-flex mb-2">
          <span class="font-weight-600">Start in:</span>
          <v-spacer />
          <span class="font-weight-bold neutral-0--text">{{ vm.projectInfo.startDate | MMDoYYYY }}</span>
        </div>

        <div class="font-18 d-flex mb-4">
          <span class="font-weight-600">End in:</span>
          <v-spacer />
          <span class="font-weight-bold neutral-0--text">{{ vm.projectInfo.endDate | MMDoYYYY }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="linear-blue--bg text-none white--text mb-2" block depressed> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </app-dialog>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Ref, Inject } from 'vue-property-decorator'
import { GeneralInformationViewModel } from '@/modules/new-mission/viewmodels/general-information-viewmodel'

@Observer
@Component
export default class ConfirmCampaignDialog extends Vue {
  @Inject() vm!: GeneralInformationViewModel
  @Ref('dialog') dialog

  close() {
    this.dialog.close()
  }
  open() {
    this.dialog.open()
  }
}
</script>

<style scoped></style>
