<template>
  <div v-if="!vm.poolRejected">
    <v-sheet class="rounded-lg overflow-hidden" :outlined="!$vuetify.theme.dark">
      <div
        style="height: 40px"
        class="d-flex align-center justify-center white--text cursor-pointer"
        :class="vm.poolStore.onVoting ? 'app-red' : 'linear-blue--bg'"
        @click="vm.changeCancelDialog(true)"
        v-if="!vm.poolCancelled"
      >
        {{ vm.poolStore.onVoting ? 'Cancel project' : 'Withdraw' }}
      </div>

      <div class="pa-4 pa-md-6">
        <div class="font-weight-bold mb-3">Final result</div>
        <v-sheet
          height="40"
          class="mt-2 d-flex justify-center align-center rounded white--text font-weight-600 text-subtitle-1"
          :color="statusReport.color"
        >
          {{ statusReport.text }}
        </v-sheet>
      </div>
      <div class="pa-4 pa-md-6">
        <div class="d-flex align-baseline mb-2">
          <div
            style="height: 27px; width: 60px"
            class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 app-green lighten-1"
          >
            👍 YES
          </div>
          <div class="text-truncate">We want the project to launch</div>
        </div>
        <progress-bar :value="vm.poolStore.votedPercent" />
        <div class="d-flex justify-space-between text-subtitle-2 font-weight-600 mt-2">
          <span>---</span><span>{{ vm.poolStore.votedPercent }}%</span>
        </div>
      </div>
      <div class="pa-4 pa-md-6">
        <div class="d-flex align-baseline mb-2">
          <div
            style="height: 27px; width: 60px"
            class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 app-red"
          >
            👎 NO
          </div>
          <div class="text-truncate">We don't want the project to launch</div>
        </div>
        <progress-bar :value="vm.poolStore.votedPercent" />
        <div class="d-flex justify-space-between text-subtitle-2 font-weight-600 mt-2">
          <span>---</span><span>{{ vm.poolStore.votedPercent }}%</span>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  get statusReport() {
    if (this.vm.poolStore?.onVoting)
      return {
        color: 'app-blue',
        text: 'Your project is opening for vote',
      }
    if (this.vm.poolStore?.status === 'approved')
      return {
        color: 'app-green lighten-1',
        text: 'Project is approved',
      }
    if (this.vm.poolStore?.status === 'cancelled')
      return {
        color: 'app-red',
        text: 'Project is cancelled',
      }
    if (this.vm.poolStore?.voteEnded)
      return {
        color: 'app-red',
        text: 'Project is ended',
      }

    return {
      color: 'app-grey',
      text: this.vm.poolStore?.status,
    }
  }
}
</script>

<style scoped></style>
