<template>
  <!-- ---------------------------------- LOADING ------------------------------------------------------------ -->
  <div v-if="vm.loading">
    <v-skeleton-loader type="image, image, image" />
  </div>
  <!-- ---------------------------------- EMPTY PROJECTS --------------------------------------------------------- -->

  <v-sheet v-else-if="!vm.loading && !vm.approvedList.length" class="pa-8 rounded-lg" elevation="3">
    <div class="text-h4 blue-diversity--text font-weight-bold">Launching soon</div>
    <div class="font-weight-bold text-h6">No projects are avalible for launching right now</div>
  </v-sheet>

  <!-- ---------------------------------- HAS PROJECTS ---------------------------------------------------------- -->
  <v-carousel
    v-else
    height="auto"
    hide-delimiters
    cycle
    delimiter-icon="mdi-minus"
    show-arrows-on-hover
    continuous
    class="rounded-lg transparent--bg elevation-3"
  >
    <template v-slot:prev="{ on, attrs }">
      <v-sheet
        class="ml-n4 mt-n16 px-2 py-10 d-flex justify-center rounded-lg rounded-l-0 neutral100--bg"
        v-ripple
        v-bind="attrs"
        v-on="on"
        outlined
      >
        <v-icon color="primary">mdi-chevron-left</v-icon>
      </v-sheet>
    </template>
    <template v-slot:next="{ on, attrs }">
      <v-sheet
        class="mr-n4 mt-n16 px-2 py-10 d-flex justify-center rounded-lg rounded-r-0 neutral100--bg"
        v-ripple
        v-bind="attrs"
        v-on="on"
        outlined
      >
        <v-icon color="primary">mdi-chevron-right</v-icon>
      </v-sheet>
    </template>
    <div v-if="vm.approvedList && vm.approvedList.length">
      <v-carousel-item v-for="(pool, index) in vm.approvedList" :key="index" eager>
        <voting-launch-item :pool="pool"></voting-launch-item>
      </v-carousel-item>
    </div>
  </v-carousel>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { VotingListViewModel } from '../viewmodels/voting-list-viewmodel'

@Component({
  components: {
    'voting-launch-item': () => import('../components/home/voting-launch-item.vue'),
  },
})
export default class VotingLaunchSection extends Vue {
  @Inject() vm!: VotingListViewModel
}
</script>

<style lang="scss" scoped></style>
