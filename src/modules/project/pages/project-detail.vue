<template>
  <v-container>
    <v-row>
      <!-- ---------------------------- BREADCRUMBS --------------------------------------- -->
      <v-col cols="12" class="mb-10">
        <div class="mt-5 d-flex align-center font-weight-medium">
          <span class="bluePrimary--text mr-5 cursor-pointer" @click="goToProjects">Your project</span>
          <v-icon class="mr-5" size="22">mdi-chevron-right</v-icon>
          <span class="neutral10--text">{{ vm.projectName }}</span>
        </div>
      </v-col>

      <!-- ---------------------------- LOADING SKELETON --------------------------------------- -->

      <v-col cols="12" v-if="vm.loading">
        <div class="row">
          <v-skeleton-loader class="col-12 mb-4" type="image" height="124" />
          <v-skeleton-loader v-for="i in 3" :key="i" class="col-4" type="image" />
        </div>
      </v-col>

      <v-row v-else>
        <!-- ---------------------------- PROJECT DETAIL HEADER ---------------------------- -->
        <v-col cols="12" class="mb-12">
          <v-sheet class="row rounded-lg blue lighten-5 mx-1 pa-6 align-center" elevation="3">
            <div class="col-md-6 col-12 d-flex align-center">
              <v-img max-height="76" max-width="76" :src="vm.projectLogo"></v-img>
              <div class="d-flex flex-column ml-4">
                <div class="text-h5 font-weight-bold mb-1">Dragon Gaming</div>
                <div class="neutral10--text d-flex align-center">
                  <div class="text-h6 font-weight-bold mr-1">$SB</div>
                  <v-chip class="text-capitalize" :class="statusColor">{{ vm.status }}</v-chip>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12 d-flex">
              <div class="flex-grow-1">
                <div class="neutral0--text">Total misstion</div>
                <div class="text-h6 font-weight-bold">100</div>
              </div>
              <div class="flex-grow-1">
                <div class="neutral0--text">Total reward</div>
                <div class="text-h6 font-weight-bold">1000 BUSD</div>
              </div>
              <v-btn
                width="162"
                height="48"
                class="linear-blue--bg neutral100--text text-subtitle-1 text-none"
                depressed
                @click="goToNewMission"
              >
                Create misstion
              </v-btn>
            </div>
          </v-sheet>
        </v-col>

        <!-- ---------------------------- MISSION CARDS ---------------------------- -->
        <v-col v-for="(mission, index) in vm.missions" :key="index" cols="4">
          <mission-card :mission="mission" />
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { ProjectDetailViewModel } from '../viewmodels/project-detail-viewmodel'
import { get } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'mission-card': () => import('../components/mission-card.vue'),
  },
})
export default class ProjectDetailPage extends Vue {
  @Provide() vm = new ProjectDetailViewModel(get(this.$route, 'params.code'))

  goToProjects() {
    this.$router.push(RoutePaths.project_list)
  }

  goToNewMission() {
    this.$router.push(RoutePaths.new_mission)
  }

  get statusColor() {
    return this.vm.status === 'approved' ? 'green ' : this.vm.status === 'rejected' ? 'red' : 'neutral100'
  }
}
</script>

<style scoped></style>
