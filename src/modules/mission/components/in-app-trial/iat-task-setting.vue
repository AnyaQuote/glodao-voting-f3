<template>
  <div>
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">Mission setpting</div>

    <!-- ---------------------------------------------------------------------------------------------------- -->
    <div class="d-flex mt-6">
      <v-sheet width="79" height="79" class="rounded-lg blue-2 d-flex">
        <span class="ma-auto font-weight-bold text-h4">1</span>
      </v-sheet>
      <div class="flex-grow-1 ml-4">
        <div class="mb-2 font-weight-bold">Task name</div>
        <app-text-field height="45" placeholder="Enter task name" />
      </div>
    </div>
    <v-divider class="dashed-border mt-2" />
    <div class="d-flex mt-7">
      <v-sheet width="79" height="79" class="rounded-lg blue-2 d-flex">
        <span class="ma-auto font-weight-bold text-h4">2</span>
      </v-sheet>
      <div class="flex-grow-1 ml-4">
        <div class="mb-2 font-weight-bold">Task name</div>
        <app-text-field height="45" placeholder="Enter task name" />
      </div>
    </div>
    <v-divider class="dashed-border mt-2" />
    <v-sheet class="d-flex py-4 mt-7 align-center justify-center" outlined rounded="lg">
      <v-icon>mdi-plus-circle-outline</v-icon>
      <div class="neutral-10--text text-subtitle-1 font-weight-600 line-height-1 ml-3">
        Add more tasks. Maximum is 5 tasks
      </div>
    </v-sheet>

    <div class="d-flex mt-7">
      <v-btn class="flex-grow" depressed outlined height="40" color="neutral-10" @click="goBack">Cancel</v-btn>
      <div class="mx-4" />
      <v-btn class="flex-grow text-none linear-blue--bg white--text" height="40" depressed @click="createMission"
        >Create</v-btn
      >
    </div>
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewInAppTrialViewModel } from '../../viewmodels/new-iat-viewmodels'

@Observer
@Component
export default class InAppTrialTaskSetting extends Vue {
  @Inject() vm!: NewInAppTrialViewModel
  goBack() {
    this.vm.changeStep(2)
  }
  createMission() {
    this.vm.createInAppTrialMission()
  }
}
</script>

<style scoped></style>
