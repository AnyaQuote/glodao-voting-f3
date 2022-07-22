<template>
  <div v-if="vm.missionInfo.type === 'social'" class="d-flex flex-column mt-7">
    <div class="title font-weight-bold blue-diversity--text">Reward information</div>
    <div class="font-18 font-weight-bold mt-4">
      <span>Reward mission: {{ vm.rewardPerMission | formatNumber(2) }} {{ vm.tokenName }}</span>
    </div>
    <div class="mt-4 row no-gutters">
      <div class="col-12 col-md-6 pa-0 pr-md-4 pr-0">
        <span class="font-18 font-weight-bold">Priority amount (30%)</span>
        <v-sheet class="rounded px-3 d-flex justify-space-between mt-2 py-14px" height="56" outlined>
          <span class="font-weight-600">{{ vm.priorityAmount | formatNumber(2) }} {{ vm.tokenName }}</span>
        </v-sheet>
      </div>

      <!-- ---------------- MAX PARTICIPANTS FIELD START ----------------- -->
      <div class="col-12 col-md-6 pa-0">
        <span class="font-18 font-weight-bold">
          Max participant in priority pool<span class="app-red--text">*</span>
        </span>
        <app-text-field
          class="mt-2"
          type="number"
          :rules="[$rules.required, $rules.integer, $rules.min(1)]"
          :value="$_get(vm.missionInfo, 'maxPriorityParticipants')"
          @change="vm.changeMissionInfo('maxPriorityParticipants', $event)"
          placeholder="Enter participants"
        />
      </div>
      <!-- ---------------- MAX PARTICIPANTS FIELD END ------------------ -->

      <div class="col-12 col-md-6 pa-0 pr-md-4 pr-0">
        <v-sheet class="rounded px-3 d-flex justify-space-between py-14px" height="56" outlined>
          <span>Community amount:</span>
          <span class="font-weight-600">{{ vm.communityAmount | formatNumber(2) }} {{ vm.tokenName }}</span>
        </v-sheet>
      </div>
      <div class="col-12 col-md-6 pa-0">
        <v-sheet class="rounded px-3 d-flex justify-space-between py-14px" height="56" outlined>
          <span>Personal priority reward:</span>
          <span class="font-weight-600"> {{ vm.personalReward | formatNumber(2) }} {{ vm.tokenName }} </span>
        </v-sheet>
      </div>
    </div>
  </div>

  <div v-else class="mt-7">
    <div class="title font-weight-bold blue-diversity--text">Reward information</div>
    <div class="font-18 font-weight-bold mt-4">
      <span>Reward mission: {{ vm.rewardPerMission | formatNumber(2) }} {{ vm.tokenName }}</span>
    </div>
    <div class="mt-4 row no-gutters">
      <div class="col-12">
        <span class="font-18 font-weight-bold">Max participants<span class="app-red--text">*</span></span>
        <app-text-field
          class="mt-2"
          type="number"
          :rules="[$rules.required, $rules.integer, $rules.min(1)]"
          :value="$_get(vm.missionInfo, 'maxParticipants')"
          @input="vm.changeMissionInfo('maxParticipants', $event)"
          placeholder="Enter participants"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'

@Observer
@Component
export default class RewardInfoForm extends Vue {
  @Inject() vm!: NewMissionViewModel
}
</script>

<style scoped>
.py-14px {
  padding: 14px 0;
}
</style>
