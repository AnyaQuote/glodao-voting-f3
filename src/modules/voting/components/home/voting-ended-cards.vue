<template>
  <v-row v-if="vm.loading">
    {{ vm.loading }}
    <v-col cols="4" v-for="index in 3" :key="index">
      <v-skeleton-loader type="image, list-item-avatar, list-item-two-line" class="neutral-100" />
    </v-col>
  </v-row>
  <!-- -------------------------------------- EMPTY PROJECTS --------------------------------------- -->
  <div v-else-if="!vm.loading && !vm.lastedEndedPools.length" class="text-center text-h6 pa-8">
    No ended project of this type yet
  </div>
  <!-- -------------------------------------- HAS PROJECTS ----------------------------------------- -->
  <v-row v-else>
    <v-col cols="12" sm="6" md="4" v-for="(pool, index) in vm.lastedEndedPools" :key="index">
      <ended-voting-card :pool="pool" />
    </v-col>
    <v-col cols="12">
      <div class="text-center mb-9">
        <v-btn depressed outlined color="blue-diversity" @click="vm.toggleEndedList" class="text-none font-weight-bold">
          View all pools
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { VotingListViewModel } from '../../viewmodels/voting-list-viewmodel'

@Observer
@Component({
  components: {
    'ended-voting-card': () => import('../common/ended-voting-card.vue'),
  },
})
export default class VotingEndedCards extends Vue {
  @Inject() vm!: VotingListViewModel
}
</script>

<style scoped></style>
