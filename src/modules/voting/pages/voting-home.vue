<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <voting-launch-section class="mt-10"></voting-launch-section>
      </v-col>
      <v-col cols="12">
        <voting-trending-section class="mt-16"></voting-trending-section>
      </v-col>

      <v-col cols="12">
        <v-sheet class="rounded-lg pa-4 pa-sm-8 my-16" elevation="3" outlined>
          <div class="text-sm-h5 font-18 font-weight-bold mb-2">
            Vote for new projects launching on GLODAO (1 xGLD = 1 vote)
          </div>
          <div class="neutral10--text text-subtitle-2 font-weight-medium mb-6 mb-sm-5">
            Voting does not decrease your xGLD, it merely shows the weight of your vote.
          </div>
          <v-btn height="40" class="text-none linear-blue--bg" depressed>
            <span class="white--text mx-4 font-weight-bold">Learn more</span>
          </v-btn>
        </v-sheet>
      </v-col>

      <v-col cols="12">
        <!-- ------------------------------------- HEADER ----------------------------------------------- -->
        <div class="mb-4">
          <div class="d-flex flex-column flex-md-row align-md-center align-start">
            <span class="mr-5 text-h4 font-weight-bold text-uppercase">Nominatied project</span>
            <span class="neutral10--text text-h5 font-weight-medium">Vote for launch on GLODAO</span>
          </div>
        </div>
        <!-- -------------------------------------- RADIO GROUP ----------------------------------------- -->
        <v-radio-group row mandatory v-model="vm.filterOption">
          <v-radio class="text-subtitle-2 font-weight-bold" value="bounty" label="Bounty Project"> </v-radio>
          <v-radio class="text-subtitle-2 font-weight-bold" value="launchpad" label="Launching project"> </v-radio>
        </v-radio-group>
        <!-- --------------------------------------- CONTENT -------------------------------------------- -->
        <v-row>
          <v-scale-transition v-if="!vm.filteredVotingList.length" leave-absolute>
            <v-col class="d-flex justify-center">
              <div class="text-h6 pa-8">No nominated project of this type right now</div>
            </v-col>
          </v-scale-transition>
          <v-scale-transition v-else leave-absolute>
            <v-col cols="12" sm="6" md="4" v-for="(pool, index) in vm.filteredVotingList" :key="index">
              <live-voting-card :pool="pool" />
            </v-col>
          </v-scale-transition>
        </v-row>
        <!-- -------------------------------------------------------------------------------------------- -->
      </v-col>

      <v-col cols="12">
        <v-sheet outlined class="rounded-lg pa-8 my-16" elevation="3">
          <div class="text-sm-h5 font-weight-bold mb-2" style="font-size: 18px">
            FREE APPLY YOUR PROJECT FOR LAUNCHING AND MARKETING
          </div>
          <div class="box-subtitle text-subtitle-2 neutral10--text font-weight-medium mb-6">
            Voting does not decrease your xGLD, it merely shows the weight of your vote.
          </div>
          <v-btn width="155" height="40" class="linear-blue--bg text-none" depressed>
            <span class="white--text mx-4 text-subtitle-2 font-weight-bold">Submit your project</span>
          </v-btn>
        </v-sheet>
      </v-col>

      <v-col cols="12" class="mb-16">
        <!-- ------------------------------------- HEADER ----------------------------------------------- -->
        <div class="d-flex d-flex flex-column flex-md-row align-md-center align-start mb-4">
          <span class="mr-5 text-h4 font-weight-bold text-uppercase">ENDED VOTING</span>
          <span class="neutral10--text text-h5 font-weight-medium"
            >All potential projects are voted by Glodao user
          </span>
        </div>
        <!-- -------------------------------------- EMPTY PROJECTS --------------------------------------- -->
        <div v-if="!vm.endedList.length" class="text-center text-h6 pa-8">No ended project of this type yet</div>
        <!-- -------------------------------------- HAS PROJECTS ----------------------------------------- -->
        <v-row v-else>
          <v-col cols="12" sm="6" md="4" v-for="(pool, index) in vm.endedList" :key="index">
            <ended-voting-card :pool="pool" />
          </v-col>
          <v-col cols="12">
            <div class="text-center mb-9">
              <v-btn class="text-none font-weight-bold" depressed color="blue" outlined>View all pools</v-btn>
            </div>
          </v-col>
        </v-row>
        <!-- --------------------------------------------------------------------------------------------- -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { VotingListViewModel } from '../viewmodels/voting-list-viewmodel'

@Component({
  components: {
    'voting-launch-section': () => import('@/modules/voting/components/voting-launch-section.vue'),
    'voting-trending-section': () => import('@/modules/voting/components/voting-trending-section.vue'),
    'live-voting-card': () => import('@/modules/voting/components/common/live-voting-card.vue'),
    'ended-voting-card': () => import('@/modules/voting/components/common/ended-voting-card.vue'),
  },
})
export default class VotingHome extends Vue {
  @Provide() vm = new VotingListViewModel()
}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';
.mt-72 {
  margin-top: em(72);
}

.mb-72 {
  margin-bottom: em(72);
}
</style>
