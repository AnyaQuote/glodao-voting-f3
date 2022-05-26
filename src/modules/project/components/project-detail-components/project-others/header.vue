<template>
  <v-sheet elevation="4" class="rounded-lg">
    <!-- TOP -->
    <v-row no-gutters dense class="app-blue lighten-1 rounded-t-lg pa-6">
      <v-col cols="6" class="d-flex align-stretch">
        <v-sheet height="76" width="76" class="white pa-1 rounded-lg d-flex justify-center mr-6">
          <img :src="$_get(vm.poolStore, 'projectLogo', '')" height="100%" />
        </v-sheet>
        <div class="d-flex flex-column justify-center">
          <div class="text-h5 font-weight-bold neutral0--text mb-1">{{ $_get(vm.poolStore, 'projectName') }}</div>
          <div class="text-h6 font-weight-bold neutral10--text">{{ $_get(vm.poolStore, 'tokenName', '') }}</div>
        </div>
      </v-col>
      <v-col cols="6" class="d-flex align-center">
        <v-row dense no-gutters align="center">
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Total reward amount</div>
            <div class="text-h6 neutral0--text font-weight-bold">
              {{ $_get(vm.poolStore, 'rewardAmount', '0') | formatNumber(2, 2) }}
              {{ $_get(vm.poolStore, 'tokenName', '') }}
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Total mission</div>
            <div class="text-h6 neutral0--text font-weight-bold">{{ $_get(vm.poolStore, 'totalMission', '0') }}</div>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Reward/mission</div>
            <div class="text-h6 neutral0--text font-weight-bold">
              {{ $_get(vm.poolStore, 'rewardPerMission') | formatNumber(2, 2) }} BUSD
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- BOTTOM -->
    <v-row no-gutters dense class="pa-6">
      <v-col cols="6">
        <div class="text-subtitle-1 neutral0--text">Campaign time</div>
        <div class="text-h6 neutral0--text font-weight-bold">Jan 21st, 10:00 pm</div>
      </v-col>
      <v-col cols="6">
        <v-row dense no-gutters align="center">
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Created</div>
            <div class="text-h6 neutral0--text font-weight-bold">{{ $_get(vm, 'missions.length') }} missions</div>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Remaining</div>
            <div class="text-h6 neutral0--text font-weight-bold">{{ remainingMission }} missions</div>
          </v-col>
          <v-col cols="4">
            <v-btn
              class="linear-blue--bg text-none white--text text-subtitle-1"
              :disabled="maxMissionReached"
              style="letter-spacing: 0"
              @click="goToNewMission"
              height="48"
              elevation="0"
              block
            >
              Create mission
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { RoutePaths } from '@/router'
import { toNumber, get, isEqual } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  goToNewMission() {
    this.$router.push(RoutePaths.project_detail + get(this.vm.poolStore, 'unicodeName', null) + RoutePaths.new_mission)
  }

  get remainingMission() {
    return toNumber(get(this.vm.poolStore, 'totalMission')) - toNumber(get(this.vm, 'missions.length')) || 0
  }

  get maxMissionReached() {
    return isEqual(this.vm.poolStore?.totalMission, this.vm.missions.length.toString)
  }
}
</script>

<style scoped></style>
