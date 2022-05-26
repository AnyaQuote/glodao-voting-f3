<template>
  <v-container>
    <v-row class="mb-72">
      <v-col cols="12" class="mb-10">
        <div class="mt-5 d-flex align-center font-weight-medium">
          <span class="bluePrimary--text mr-5 cursor-pointer" @click="goToVotingList">Your project</span>
          <v-icon class="mr-5" size="22">mdi-chevron-right</v-icon>
          <span class="neutral10--text">{{ vm.projectName }}</span>
        </div>
      </v-col>

      <v-col cols="12">
        <voting-detail-overview></voting-detail-overview>
      </v-col>

      <v-col cols="12">
        <div class="row mt-72">
          <v-sheet class="col-12 rounded-lg pa-4 d-flex align-center justify-space-between mb-6">
            <div class="text-h5 neutral100--bg font-weight-bold">USER VOTE ({{ vm.votedUsers.length }})</div>
            <!-- <v-btn icon>
              <v-icon large>mdi-information</v-icon>
            </v-btn> -->
          </v-sheet>

          <div class="col-12" v-for="address in vm.votedUsers" :key="address">
            <v-sheet v-bind="$attrs" class="row align-center rounded pa-4" elevation="3">
              <div class="col-12 col-md-4">
                <div class="font-weight-bold">{{ address | shortAddress(12, 6) }}</div>
                <div>GLD Staker</div>
              </div>
              <div class="col-12 col-md-4 d-flex align-center">
                <v-chip color="green mr-2">👍YES</v-chip>
                <span class="font-weight-medium"> We want to join in this project </span>
              </div>
              <div
                class="col-12 col-md-4 d-flex flex-row flex-md-column align-md-end justify-space-between text-subtitle-2"
              >
                <span class="neutral10--text">Time voted</span>
                <span class="font-weight-bold">---</span>
              </div>
            </v-sheet>
            <!-- <voting-list-item class="mb-4 pa-2" elevation="3" v-for="address in vm.votedUsers" :key="address" /> -->
          </div>

          <!-- <div class="col-12">
            <v-pagination prev-icon="mdi-arrow-left" :length="4" next-icon="mdi-arrow-right" />
          </div> -->
        </div>
      </v-col>

      <v-col cols="12">
        <div class="nominated-section mt-72">
          <div class="header mr-5 font-weight-bold text-uppercase">SIMILIAR NOMINATED PROJECT</div>
        </div>
        <div v-if="$vuetify.breakpoint.mdAndUp" class="app-slide-group">
          <v-slide-group class="ma-n1 px-1">
            <live-compact-card v-for="(pool, i) in vm.votingList" :key="i" class="ma-1" :pool="pool" />
          </v-slide-group>
        </div>
        <v-row v-else class="row">
          <v-col cols="12" v-for="(pool, i) in vm.votingList" :key="i">
            <live-compact-card :pool="pool" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../viewmodels/voting-detail-viewmodel'
import { get } from 'lodash-es'
import { RoutePaths } from '@/router'

@Component({
  components: {
    'voting-detail-overview': () => import('../components/voting-detail-overview.vue'),
    'voting-list-item': () => import('../components/common/voting-list-item.vue'),
    'live-compact-card': () => import('../components/common/live-compact-card.vue'),
  },
})
export default class VotingDetail extends Vue {
  @Provide() vm = new VotingDetailViewModel(get(this.$route, 'params.code'))

  goToVotingList() {
    this.$router.push(RoutePaths.voting_list)
  }
}
</script>

<style lang="scss" scoped>
.mt-72 {
  margin-top: em(72);
}
.mb-72 {
  margin-bottom: em(72);
}
.nominated-section {
  .header {
    font-size: em(28);
    line-height: em(36.4);
  }
}
</style>
