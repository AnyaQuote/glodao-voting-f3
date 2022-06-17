<template>
  <v-container>
    <v-row class="mb-72">
      <v-col cols="12" class="mb-10">
        <div class="mt-5 d-flex align-center font-weight-medium">
          <span class="bluePrimary--text mr-5 cursor-pointer font-weight-bold text-truncate" @click="goToVotingList"
            >DAO Voting</span
          >
          <v-icon class="mr-5" size="22">mdi-chevron-right</v-icon>
          <span class="neutral-10--text text-truncate">{{ $_get(vm.poolStore, 'projectName') }}</span>
        </div>
      </v-col>

      <v-col cols="12">
        <!-- ------------------------------------- LOADING ------------------------------------- -->
        <v-skeleton-loader v-if="vm.dataLoading" type="image, article, actions" />
        <!-- ------------------------------------- CONTENT ------------------------------------- -->
        <voting-detail-overview v-else></voting-detail-overview>
        <!-- ----------------------------------------------------------------------------------- -->
      </v-col>

      <v-col cols="12">
        <!-- ------------------------------------- HEADER -------------------------------------- -->
        <v-sheet class="rounded-lg pa-4 d-flex align-center justify-space-between mb-6 mt-72" outlined elevation="3">
          <div class="text-h5 neutral100--bg font-weight-bold">
            USER VOTE ({{ $_get(vm.poolStore, 'votedUsers.length', 0) }})
          </div>
          <v-btn icon @click="openGuideDialog">
            <v-icon large>mdi-information</v-icon>
          </v-btn>
        </v-sheet>
        <!-- ------------------------------------ LOADING ------------------------------------ -->
        <div v-if="vm.dataLoading">
          <v-skeleton-loader class="mb-2" v-for="index in 3" :key="index" height="80" type="image" />
        </div>
        <!-- ------------------------------------ EMPTY -------------------------------------- -->
        <div v-else-if="!vm.dataLoading && !vm.votedUserPagingList.length" class="text-h6 text-center rounded-lg">
          No users has voted yet. Be the first to support this project
        </div>

        <!-- ------------------------------------ CONTENT ------------------------------------ -->
        <div v-else>
          <v-slide-x-transition group hide-on-leave>
            <voting-list-item v-for="(voter, index) in vm.votedUserPagingList" :prop="voter" :key="index" />
          </v-slide-x-transition>
          <v-pagination
            prev-icon="mdi-arrow-left"
            next-icon="mdi-arrow-right"
            :value="vm.votedUserPage"
            :length="vm.votedUserTotalPage"
            @input="vm.changeVotedUserPage"
          />
        </div>
        <!-- -------------------------------------------------------------------------------- -->
      </v-col>

      <v-col cols="12">
        <div class="mt-72 mb-4 font-28 mr-5 font-weight-bold text-uppercase">SIMILIAR NOMINATED PROJECT</div>
        <!-- ------------------------------------------ LOADING ------------------------------------------------ -->
        <div v-if="vm.dataLoading" class="row">
          <v-skeleton-loader v-for="index in 3" :key="index" class="col-4" type="image, article" />
        </div>
        <!-- ------------------------------------------ EMPTY PROJECTS ----------------------------------------- -->
        <div v-else-if="!vm.dataLoading && $_empty(vm.votingList.length)" class="text-h6 text-center">
          No projects similar of this type right now
        </div>
        <!-- ------------------------------------------ HAS PROJECTS ------------------------------------------ -->
        <div v-else class="app-slide-group">
          <v-slide-group>
            <template v-slot:next>
              <v-sheet width="36" class="py-10 rounded-lg d-flex justify-center" elevation="3" outlined>
                <v-icon>mdi-chevron-right</v-icon>
              </v-sheet>
            </template>
            <template v-slot:prev>
              <v-sheet width="36" class="py-10 rounded-lg d-flex justify-center" elevation="3" outlined>
                <v-icon>mdi-chevron-left</v-icon>
              </v-sheet>
            </template>
            <v-slide-item v-for="(pool, index) in vm.votingList" :key="index">
              <live-compact-card class="mr-4" :pool="pool" />
            </v-slide-item>
          </v-slide-group>
        </div>
        <!-- ------------------------------------------------------------------------------------------------- -->
      </v-col>
    </v-row>
    <vote-guide-dialog ref="guide-dialog" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Provide, Ref } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../viewmodels/voting-detail-viewmodel'
import { get } from 'lodash-es'
import { RoutePaths } from '@/router'

@Component({
  components: {
    'voting-detail-overview': () => import('../components/voting-detail-overview.vue'),
    'voting-list-item': () => import('../components/common/voting-list-item.vue'),
    'live-compact-card': () => import('../components/common/live-compact-card.vue'),
    'vote-guide-dialog': () => import('../components/detail/vote-guide-dialog.vue'),
  },
})
export default class VotingDetail extends Vue {
  @Provide() vm = new VotingDetailViewModel(get(this.$route, 'params.code'))
  @Ref('guide-dialog') dialog

  goToVotingList() {
    this.$router.push(RoutePaths.voting_list)
  }

  openGuideDialog() {
    this.dialog.open()
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
</style>
