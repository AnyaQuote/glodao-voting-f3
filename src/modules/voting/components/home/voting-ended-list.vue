<template>
  <v-sheet>
    <div class="d-flex rounded-lg blue-2 rounded-b-0 overflow-hidden neutral-10--text font-weight-600">
      <div
        v-ripple
        class="pa-4 cursor-pointer"
        :class="activeTab('bounty')"
        @click="vm.changeEndedFilterOption('bounty')"
      >
        Bounty project
      </div>
      <div
        v-ripple
        class="pa-4 cursor-pointer"
        :class="activeTab('launchpad')"
        @click="vm.changeEndedFilterOption('launchpad')"
      >
        Launchpad project
      </div>
    </div>
    <!-- --------------------------------------- IS LOADING --------------------------------------- -->
    <template v-if="vm.isPaging">
      <v-progress-linear indeterminate color="blue-diversity" />
      <v-sheet height="300" class="d-flex align-center justify-center">.</v-sheet>
    </template>
    <!-- --------------------------------------- EMPTY PAGING LIST -------------------------------- -->
    <template v-else-if="!vm.isPaging && !vm.totalEndedPoolPage">
      <v-slide-x-transition hide-on-leave>
        <v-sheet height="300" class="d-flex flex-column align-center justify-center">
          <img width="80" height="80" src="@/assets/icons/project/empty-icon.svg" class="mb-4" />
          <div class="font-weight-600 neutral-10--text text-h6">No ended {{ vm.endedFilterOption }} projects</div>
        </v-sheet>
      </v-slide-x-transition>
    </template>
    <!-- --------------------------------------- HAS PAGING LIST ----------------------------------- -->
    <template v-else>
      <v-slide-x-transition group hide-on-leave>
        <voting-ended-list-item v-for="(item, index) in vm.endedPoolPagingList" :pool="item" :key="index" />
        <v-divider />
      </v-slide-x-transition>
    </template>
    <!-- ------------------------------------------------------------------------------------------- -->
    <v-pagination
      v-show="vm.totalEndedPoolPage"
      :disabled="vm.isPaging"
      :length="vm.totalEndedPoolPage"
      :value="vm.currentEndedPoolPage"
      @input="vm.changeEndedCurrentPage"
    />
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { VotingListViewModel } from '../../viewmodels/voting-list-viewmodel'

@Observer
@Component({
  components: {
    'voting-ended-list-item': () => import('./voting-ended-list-item.vue'),
  },
})
export default class VotingEndedList extends Vue {
  @Inject() vm!: VotingListViewModel

  get activeTab() {
    return (tabName: string) => (this.vm.endedFilterOption === tabName ? 'blue-diversity white--text' : '')
  }
}
</script>

<style scoped></style>
