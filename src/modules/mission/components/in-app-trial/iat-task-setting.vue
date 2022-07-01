<template>
  <div>
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">Mission setting</div>

    <!-- ---------------------------------------------------------------------------------------------------- -->
    <iat-task-collector :value="$_get(vm.iatInfo, 'tasks', [])" @onChange="vm.updateIatInfo('tasks', $event)" />

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
@Component({
  components: {
    'iat-task-collector': () => import('../common/iat-task-collector.vue'),
  },
})
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
