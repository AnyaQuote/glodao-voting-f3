<template>
  <v-sheet elevation="4" class="rounded-lg">
    <!-- TOP -->
    <v-row no-gutters dense class="app-blue lighten-1 rounded-t-lg pa-6">
      <v-col cols="6" class="d-flex align-stretch">
        <v-sheet height="76" width="76" class="white pa-1 rounded-lg d-flex justify-center mr-6">
          <img :src="require('@/assets/icons/voting-trending--logo.png')" height="100%" />
        </v-sheet>
        <div class="d-flex flex-column justify-center">
          <div class="text-h5 font-weight-bold neutral0--text mb-1">{{ vm.poolStore.projectName }}</div>
          <div class="text-h6 font-weight-bold neutral10--text">${{ vm.poolStore.tokenName }}</div>
        </div>
      </v-col>
      <v-col cols="6" class="d-flex align-center">
        <v-row dense no-gutters align="center">
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Total reward amount</div>
            <div class="text-h6 neutral0--text font-weight-bold">{{ 10000 | formatNumber(2, 2) }} HWD</div>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Total mission</div>
            <div class="text-h6 neutral0--text font-weight-bold">100</div>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Reward/mission</div>
            <div class="text-h6 neutral0--text font-weight-bold">{{ 1000 | formatNumber(2, 2) }} BUSD</div>
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
            <div class="text-h6 neutral0--text font-weight-bold">{{ !vm.missions.length ? 0 : 10 }} missions</div>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-1 neutral0--text">Remaining</div>
            <div class="text-h6 neutral0--text font-weight-bold">{{ !vm.missions.length ? 0 : 5 }} misstions</div>
          </v-col>
          <v-col cols="4">
            <v-btn
              class="linear-blue--bg text-none white--text text-subtitle-1"
              style="letter-spacing: 0"
              block
              elevation="0"
              height="48"
              @click="goToNewMission"
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
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  goToNewMission() {
    this.$router.push(RoutePaths.new_mission)
  }
}
</script>

<style scoped></style>
