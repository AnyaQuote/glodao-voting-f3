<template>
  <div v-if="vm.loading">
    <v-skeleton-loader type="image, image, image" />
  </div>
  <v-carousel
    v-else
    :height="carouselHeight"
    :hide-delimiters="$vuetify.breakpoint.smAndUp"
    delimiter-icon="mdi-minus"
    show-arrows-on-hover
    class="elevation-3 rounded-lg"
  >
    <template v-slot:prev="{ on, attrs }">
      <v-sheet
        class="ml-n4 mt-n16 px-2 py-10 d-flex justify-center rounded-lg rounded-l-0 neutral100--bg"
        v-ripple
        v-bind="attrs"
        v-on="on"
        outlined
      >
        <v-icon color="black">mdi-chevron-left</v-icon>
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
        <v-icon color="black">mdi-chevron-right</v-icon>
      </v-sheet>
    </template>
    <v-carousel-item v-for="(pool, index) in vm.approvedList" :key="index" eager>
      <voting-launch-item :pool="pool"></voting-launch-item>
    </v-carousel-item>
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

  get carouselHeight() {
    return this.$vuetify.breakpoint.mdAndUp ? '756' : this.$vuetify.breakpoint.xsOnly ? '700' : 'auto'
  }
}
</script>

<style lang="scss" scoped></style>
