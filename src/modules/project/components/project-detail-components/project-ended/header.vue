<template>
  <v-sheet elevation="3" class="rounded-lg">
    <!-- --------------------------------------------- TOP --------------------------------------------- -->
    <v-row dense class="blue-2 rounded-t-lg pa-6 ma-0">
      <v-col cols="12" md="6" class="d-flex align-center">
        <v-sheet max-width="80" max-height="80" class="neutral-100 rounded-lg pa-1 mr-4">
          <v-img :src="$_get(vm.poolStore, 'projectLogo')" />
        </v-sheet>
        <div class="d-flex flex-column justify-center text-truncate">
          <div class="text-h5 font-weight-bold mb-1 text-truncate">{{ $_get(vm.poolStore, 'projectName') }}</div>
          <div class="d-flex align-center">
            <span class="text-h6 font-weight-bold">${{ $_get(vm.poolStore, 'tokenName') }}</span>
            <v-chip class="text-capitalize ml-2 white--text" color="app-green lighten-1">{{
              $_get(vm.poolStore, 'status')
            }}</v-chip>
          </div>
        </div>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <div class="text-subtitle-1 neutral-10--text">Total reward amount</div>
        <div class="text-h6 font-weight-bold">
          {{ $_get(vm.poolStore, 'requiredAmount') | formatNumber(2, 2) }}
          {{ $_get(vm.poolStore, 'tokenName') }}
        </div>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <div class="text-subtitle-1 neutral-10--text">Total mission</div>
        <div class="text-h6 font-weight-bold">{{ $_get(vm.poolStore, 'totalMission') }}</div>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <div class="text-subtitle-1 neutral-10--text">Reward/mission</div>
        <div class="text-h6 font-weight-bold">
          {{ $_get(vm.poolStore, 'rewardPerMission') | formatNumber(2, 2) }} {{ $_get(vm.poolStore, 'tokenName') }}
        </div>
      </v-col>
    </v-row>
    <!-- --------------------------------------------- BOTTOM ------------------------------------------ -->
    <v-row dense class="pa-6">
      <v-col cols="12" md="6">
        <div class="text-subtitle-1 neutral-10--text">Campaign time</div>
        <div class="text-h6 font-weight-bold mb-2 mb-md-0">
          {{ $_get(vm.poolStore, 'startDate') | ddmmyyyyhhmma }}
          <span class="mx-2">-</span>
          {{ $_get(vm.poolStore, 'endDate') | ddmmyyyyhhmma }}
        </div>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <div class="text-subtitle-1 neutral-10--text">Created</div>
        <div class="text-h6 font-weight-bold">
          {{ $_get(vm, 'missions.length') }} {{ $_get(vm, 'missions.length') > 0 ? 'missions' : 'mission' }}
        </div>
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <div class="text-subtitle-1 neutral-10--text">Remaining</div>
        <div class="text-h6 font-weight-bold">
          {{ remainingMission }} {{ remainingMission > 1 ? 'missions' : 'mission' }}
        </div>
      </v-col>
      <v-col cols="6" sm="4" md="2" align-self="center">
        <v-btn
          class="text-none white--text text-subtitle-1"
          :class="remainingMission > 0 && 'linear-blue--bg'"
          :disabled="remainingMission === 0"
          @click="openSelectMissionDialog"
          height="48"
          depressed
        >
          Create mission
        </v-btn>
      </v-col>
    </v-row>
    <select-mission-type-dialog ref="select-dialog" />
  </v-sheet>
  <!-- ------------------------------------------------------------------------------------------------- -->
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { RoutePaths } from '@/router'
import { toNumber, get } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'select-mission-type-dialog': () => import('../dialogs/select-mission-type-dialog.vue'),
  },
})
export default class ProjectEndedHeader extends Vue {
  @Inject() vm!: ProjectDetailViewModel
  @Ref('select-dialog') dialog

  openSelectMissionDialog() {
    // this.$router.push(RoutePaths.project_detail + get(this.vm.poolStore, 'unicodeName', null) + RoutePaths.new_mission)
    this.dialog.open()
  }

  get remainingMission() {
    return toNumber(get(this.vm.poolStore, 'totalMission')) - toNumber(get(this.vm, 'missions.length')) || 0
  }
}
</script>

<style scoped></style>
