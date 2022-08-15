<template>
  <v-form v-model="valid">
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">Mission setting</div>
    <!-- ---------------------------------------------------------------------------------------------------- -->

    <div class="font-weight-bold text-subtitle-1 my-2">Task description<span class="red--text">*</span></div>
    <app-textarea
      :value="taskDesciption"
      :rules="[$rules.required]"
      @change="vm.updateIatInfo('taskDescription', $event)"
      placeholder="Enter task description, guideline or developer notes..."
    />
    <i class="text-caption font-weight-regular"
      ><u>Notes:</u> Must include guideline on how to use can get their <strong>unique ID</strong>. We will ask users to
      send us their <strong>unique ID</strong> from your app, which plays as an identify key, to us so that we can
      recognize who has used your app and finished all the mission task's steps below.
    </i>

    <!-- ---------------------------------------------------------------------------------------------------- -->
    <div class="font-weight-bold text-subtitle-1 my-2">Task step setting</div>
    <iat-task-collector
      :rules="[$rules.required]"
      :value="vm.taskSetting"
      @onChange="vm.updateIatInfo('tasks', $event)"
    />

    <div class="d-flex mt-7">
      <v-btn class="flex-grow" depressed outlined height="40" color="neutral-10" @click="goBack">Cancel</v-btn>
      <div class="mx-4" />
      <v-btn
        class="flex-grow text-none"
        :class="{ 'linear-blue--bg white--text': valid }"
        :disabled="!valid"
        height="40"
        depressed
        :loading="vm.btnLoading"
        @click="createMission"
        >Create</v-btn
      >
    </div>
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </v-form>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewInAppTrialViewModel } from '../../viewmodels/new-iat-viewmodels'

@Observer
@Component({
  components: {
    'iat-task-collector': () => import('../common/iat-task-collector.vue'),
  },
})
export default class InAppTrialTaskSetting extends Vue {
  @Inject() vm!: NewInAppTrialViewModel

  valid = false

  goBack() {
    this.vm.changeStep(2)
  }
  createMission() {
    this.vm.createInAppTrialMission()
  }
}
</script>
<style scoped></style>
