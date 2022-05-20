<template>
  <v-row>
    <v-col cols="12">
      <!-- VOTING LAUNCHING SOON START -->
      <voting-launch-section></voting-launch-section>
      <!-- VOTING LAUNCHING SOON END -->
    </v-col>
    <v-col cols="12">
      <!-- VOTING TRENDING SECTION START -->
      <voting-trending-section class="mt-72"></voting-trending-section>
      <!-- VOTING TRENDING SECTION END -->
    </v-col>

    <v-col cols="12">
      <!-- HINT BOX START -->
      <v-sheet class="box rounded-lg pa-4 pa-sm-8" elevation="3">
        <div class="text-sm-h5 neutral0--text font-weight-bold mb-2" style="font-size: 18px">
          Vote for new projects launching on GLODAO (1 xGLD = 1 vote)
        </div>
        <div class="neutral10--text text-subtitle-2 font-weight-medium mb-6 mb-sm-5">
          Voting does not decrease your xGLD, it merely shows the weight of your vote.
        </div>
        <v-btn width="105" height="40" class="text-none linear-blue--bg" depressed>
          <span class="white--text mx-4 font-weight-bold">Learn more</span>
        </v-btn>
      </v-sheet>
      <!-- HINT BOX END -->
    </v-col>

    <v-col cols="12">
      <!-- HEADER START -->
      <div class="nominated-section mt-72">
        <div class="header d-flex align-center">
          <span class="mr-5 font-weight-bold text-uppercase">Nominatied project</span>
          <span class="neutral10--text font-weight-medium">Vote for launch on GLODAO</span>
        </div>
      </div>
      <!-- HEADER END -->

      <!-- RADIO GROUP SECTION START -->
      <v-radio-group row mandatory v-model="vm.filterOption">
        <v-radio class="text-subtitle-2 font-weight-bold" value="bounty" label="Bounty Project"> </v-radio>
        <v-radio class="text-subtitle-2 font-weight-bold" value="launchpad" label="Launching project"> </v-radio>
      </v-radio-group>
      <!-- RADIO GROUP SECTION END -->

      <!-- CARDS SECTION START -->
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(item, i) in vm.filteredVotingList" :key="i">
          <live-voting-card
            :projectName="item.projectName"
            :data="item.data"
            :type="item.type"
            :endDate="item.endDate"
            :unicode="item.unicode"
          />
        </v-col>
      </v-row>
      <!-- CARDS SECTION END -->
    </v-col>

    <v-col cols="12" class="mb-16">
      <v-sheet class="box rounded-lg pa-8" elevation="3">
        <div class="text-sm-h5 font-weight-bold mb-2" style="font-size: 18px">
          FREE APPLY YOUR PROJECT FOR LAUNCHING AND MARKETING
        </div>
        <div class="box-subtitle text-subtitle-2 neutral10--text font-weight-medium mb-6">
          Voting does not decrease your xGLD, it merely shows the weight of your vote.
        </div>
        <v-btn width="155" height="40" class="linear-blue--bg text-none" depressed>
          <span class="white--text mx-4 text-subtitle-2">Submit your project</span>
        </v-btn>
      </v-sheet>
    </v-col>

    <v-col cols="12">
      <div class="nominated-section mt-72">
        <div class="header d-flex align-center">
          <span class="mr-5 font-weight-bold text-uppercase">ENDED VOTING</span>
          <span class="neutral10--text font-weight-medium">All potential projects are voted by Glodao user </span>
        </div>
      </div>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(item, i) in vm.endedList" :key="i">
          <ended-voting-card
            :projectName="item.projectName"
            :data="item.data"
            :type="item.type"
            :status="item.status"
            :unicode="item.unicode"
          />
        </v-col>
        <v-col cols="12">
          <div class="text-center mb-9">
            <v-btn class="text-none font-weight-bold" depressed color="blue" outlined>View all pools</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
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

  mounted() {
    this.vm.fetchVotingPools()
  }
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

.box {
  @extend .mt-72;
  .box-subtitle {
    font-size: em(16);
    line-height: em(24);
  }
}

.nominated-section {
  .header {
    font-size: em(28);
    line-height: em(36.4);
  }
}
</style>
