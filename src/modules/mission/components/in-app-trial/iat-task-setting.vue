<template>
  <v-form v-model="valid">
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">Mission setting</div>

    <!-- ---------------------------------------------------------------------------------------------------- -->
    <iat-task-collector
      :rules="[$rules.required]"
      :value="$_get(vm.iatInfo, 'tasks', [])"
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
