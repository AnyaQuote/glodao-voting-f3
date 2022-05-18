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
      <v-sheet class="box rounded-lg pa-8" elevation="3">
        <div class="text-h5 font-weight-bold mb-2">Vote for new projects launching on GLODAO (1 xGLD = 1 vote)</div>
        <div class="box-subtitle neutral10--text font-weight-medium mb-5">
          Voting does not decrease your xGLD, it merely shows the weight of your vote.
        </div>
        <v-btn class="btnA text-none" height="40" depressed>
          <span class="white--text mx-4">Learn more</span>
        </v-btn>
      </v-sheet>
      <!-- HINT BOX END -->
    </v-col>

    <v-col cols="12">
      <!-- HEADER START -->
      <div class="nominated-section mt-72">
        <div class="header d-flex align-center">
          <span class="header-title mr-5 font-weight-bold text-uppercase">Nominatied project</span>
          <span class="header-subtitle neutral10--text font-weight-medium">Vote for launch on GLODAO</span>
        </div>
      </div>
      <!-- HEADER END -->

      <!-- RADIO GROUP SECTION START -->
      <v-radio-group row>
        <v-radio value="1">
          <template v-slot:label>
            <span class="text-subtitle-2 font-weight-bold">Bounty project</span>
          </template>
        </v-radio>
        <v-radio value="2">
          <template v-slot:label>
            <span class="text-subtitle-2 font-weight-bold">Launching project</span>
          </template>
        </v-radio>
      </v-radio-group>
      <!-- RADIO GROUP SECTION END -->

      <!-- CARDS SECTION START -->
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(item, i) in vm.votingList" :key="i">
          <live-voting-card
            :projectName="item.projectName"
            :data="item.data"
            :type="item.type"
            :endDate="item.endDate"
          />
        </v-col>
      </v-row>
      <!-- CARDS SECTION END -->
    </v-col>

    <v-col cols="12">
      <v-sheet class="box rounded-lg pa-8" elevation="3">
        <div class="text-h5 font-weight-bold mb-2">FREE APPLY YOUR PROJECT FOR LAUNCHING AND MARKETING</div>
        <div class="box-subtitle neutral10--text font-weight-medium mb-5">
          Voting does not decrease your xGLD, it merely shows the weight of your vote.
        </div>
        <v-btn class="linear-blue--bg text-none" height="40" depressed>
          <span class="white--text mx-4">Submit your project</span>
        </v-btn>
      </v-sheet>
    </v-col>

    <v-col cols="12">
      <div class="nominated-section mt-72">
        <div class="header d-flex align-center">
          <span class="header-title mr-5 font-weight-bold text-uppercase">ENDED VOTING</span>
          <span class="header-subtitle neutral10--text font-weight-medium"
            >All potential projects are voted by Glodao user
          </span>
        </div>
      </div>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(item, i) in vm.endedList" :key="i">
          <ended-voting-card
            :projectName="item.projectName"
            :data="item.data"
            :type="item.type"
            :status="item.status"
          />
        </v-col>
        <v-col cols="12">
          <div class="text-center mb-72">
            <v-btn class="text-none" depressed color="blue" outlined>View all pools</v-btn>
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
    .header-title {
    }
    .header-subtitle {
    }
  }
}
</style>
