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
        <project-status :pool="vm.poolStore" />
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
        <progress-bar :value="$_get(vm.poolStore, 'votedYesPercent')" />
        <div class="d-flex justify-space-between text-subtitle-2 font-weight-600 mt-2">
          <span>{{ $_get(vm.poolStore, 'votedYesWeight') | formatNumber(0) }}</span
          ><span>{{ $_get(vm.poolStore, 'votedYesPercent') | formatNumber(2) }}%</span>
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
        <progress-bar :value="$_get(vm.poolStore, 'votedNoPercent')" />
        <div class="d-flex justify-space-between text-subtitle-2 font-weight-600 mt-2">
          <span>{{ $_get(vm.poolStore, 'votedNoWeight') | formatNumber(0) }}</span
          ><span>{{ $_get(vm.poolStore, 'votedNoPercent') | formatNumber(2) }}%</span>
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
@Component({
  components: {
    'project-status': () => import('./project-status.vue'),
  },
})
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel
}
</script>

<style scoped></style>
