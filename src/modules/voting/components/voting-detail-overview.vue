<template>
  <v-sheet class="neutral100-bg rounded-lg" elevation="3" outlined>
    <!-- ------------------------------------------------------------------------------------------------------------- -->
    <v-sheet class="banner">
      <div class="banner-top rounded-lg">
        <v-img class="banner-img rounded-lg rounded-b-0" src="@/assets/images/voting-home--background.png" />
        <voting-out-btn class="banner-link-btn" width="51" height="51" />
        <div class="banner-content  rounded-lg py-10">
          <div class="text-h5 text-center font-weight-bold mb-10 white--text">Current result</div>
          <!-- CENTER CONTENT BOX START -->
          <v-sheet width="600" class="d-flex justify-center transparent white--text">
            <div class="d-flex">
              <voting-progress-circle class="flex-shrink-0" value="90" color="green" />
              <div class="d-flex flex-column justify-space-around flex-grow-1 mr-4">
                <span class="text-h6">👍YES</span>
                <span class="font-weight-bold font-14">1000 votes</span>
              </div>
            </div>
            <div class="mx-7"></div>
            <div class="d-flex">
              <voting-progress-circle class="flex-shrink-0 mr-4" value="10" color="error" />
              <div class="d-flex flex-column justify-space-around flex-grow-1">
                <span class="text-h6">👍NO</span>
                <span class="font-weight-bold font-14">1000 votes</span>
              </div>
            </div>
          </v-sheet>
          <!-- CENTER CONTENT BOX END -->
        </div>
      </div>
      <voting-detail-button @buttonClick="openDialog" />
    </v-sheet>
    <!-- BANNER SECTION END -->
    <!-- --------------------------------------------------------------------------------------------------------------------- -->
    <!-- CONTENT SECTION START -->
    <v-sheet class="pa-6 rounded-lg rounded-t-0">
      <div class="row">
        <div class="col-8">
          <div class="text-h4 font-weight-bold">Hydro Wind Energy</div>
        </div>
        <div class="col-4">
          <countdown to="2022-06-08T00:00:00.000Z" class="text-h5" />
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-3" v-for="i in [1, 2, 3]" :key="i">
              <reward-card class="reward-card" />
            </div>
            <!-- TOOLTIP SECTION START -->
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="align-stretch mt-2" color="grey2">mdi-information</v-icon>
              </template>
              <span>Token rewards are calculated according to the price at the time of pool closing</span>
            </v-tooltip>
            <!-- TOOLTIP SECTION END -->
          </div>
        </div>
        <div class="col-12">
          <ul class="mb-n4">
            <li v-for="i in [1, 2, 3]" :key="i" class="mb-4">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Velit officia consequat duis enim
              velit mollit. Exercitation veniam consequat sunt nostrud amet.
            </li>
          </ul>
        </div>

        <div class="col-8 ma-n1">
          <v-chip class="ma-1" color="orange lighten-4" text-color="orange" label>Bounty poject</v-chip>
          <v-chip class="ma-1" label>Faming</v-chip>
          <v-chip class="ma-1" label>NFT</v-chip>
          <v-chip class="ma-1" label>Finance</v-chip>
        </div>

        <div class="col-4 d-flex justify-end align-center">
          <v-btn icon color="bluePrimary">
            <v-icon small>fab fa-medium</v-icon>
          </v-btn>
          <v-btn icon color="bluePrimary">
            <v-icon small>fab fa-twitter</v-icon>
          </v-btn>
          <v-btn icon color="bluePrimary">
            <v-icon small>fab fa-twitter</v-icon>
          </v-btn>
          <v-btn icon color="bluePrimary">
            <v-icon small>fab fa-telegram</v-icon>
          </v-btn>
          <v-btn icon color="bluePrimary">
            <icon-git-book />
          </v-btn>
        </div>
      </div>
    </v-sheet>
    <!-- --------------------------------------------------------------------------------------------------------------- -->
    <!-- CONTENT SECTION END -->
    <vote-prep-dialog ref="vote-prep-dialog" />
    <vote-confirm-dialog ref="vote-confirm-dialog" />
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

@Component({
  components: {
    'voting-out-btn': () => import('../components/common/voting-out-btn.vue'),
    'voting-progress-circle': () => import('../components/common/voting-progress-circle.vue'),
    countdown: () => import('../components/common/countdown.vue'),
    'icon-git-book': () => import('@/assets/icons/icon-git-book.vue'),
    'reward-card': () => import('../components/common/reward-card.vue'),
    'voting-detail-button': () => import('../components/detail/voting-detail-button.vue'),
    'vote-prep-dialog': () => import('../components/detail/vote-prep-dialog.vue'),
    'vote-confirm-dialog': () => import('../components/detail/vote-confirm-dialog.vue')
  }
})
export default class VotingDetailOverview extends Vue {
  @Ref('vote-prep-dialog') votePrepDialog
  @Ref('vote-confirm-dialog') voteConfirmDialog

  openDialog() {
    this.votePrepDialog.open()
  }
}
</script>

<style lang="scss" scoped>
.font-14 {
  font-size: em(14);
}
.banner {
  position: relative;
  .banner-top {
    position: relative;
    .banner-img {
      position: relative;
      background: var(--v-neutral10-base);
    }
    .banner-link-btn {
      position: absolute;
      bottom: em(23);
      left: em(43);
    }
  }
  .banner-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }
}

.reward-card {
  @extend .font-14;
}
</style>
