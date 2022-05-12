<template>
  <div>
    <v-sheet class="banner rounded-lg rounded-b-0">
      <div class="banner-top rounded-lg">
        <v-img class="banner-img rounded-lg rounded-b-0" src="@/assets/images/voting-home--background.png" />
        <voting-out-btn class="banner-link-btn" width="51" height="51" />
        <div class="banner-content white--text rounded-lg">
          <div class="text-h5 text-center font-weight-bold mb-10 debug">Current result</div>
          <!-- CENTER CONTENT BOX START -->
          <div class="d-flex my-10">
            <div class="d-flex">
              <voting-progress-circle class="flex-shrink-0" value="90" color="green" />
              <div class="d-flex flex-column justify-space-around flex-grow-1">
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
          </div>
          <!-- CENTER CONTENT BOX END -->
        </div>
      </div>

      <!-- BOTTOM BUTTON START -->
      <v-sheet v-ripple height="80" color="bluePrimary" class="d-flex justify-center align-center">
        <v-icon large color="white" class="mt-n1 mr-1">mdi-star-outline</v-icon>
        <span class="text-h5 white--text">VOTE NOW</span>
      </v-sheet>
      <!-- BOTTOM BUTTON END -->
    </v-sheet>
    <!-- BANNER SECTION END -->

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
              <v-sheet class="reward-card rounded-lg pa-6 neutral10--text font-weight-medium" elevation="3">
                <div>Total reward</div>
                <div class="d-flex align-center">
                  <span class="text-h6 black--text mr-2">100,000 TPB</span>
                  <div
                    class="d-inline-block"
                    style="width: 24px; height: 24px;  border-radius: 50%; background: #B95567;"
                  ></div>
                </div>
                <div>$1,000.00</div>
              </v-sheet>
            </div>
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
          <v-chip class="ma-1" color="orangeSemantic" label>Bounty poject</v-chip>
          <v-chip class="ma-1" label>Bounty poject</v-chip>
          <v-chip class="ma-1" label>Bounty poject</v-chip>
          <v-chip class="ma-1" label>Bounty poject</v-chip>
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
          <v-btn icon class="bluePrimary">
            <v-icon small>fab git-book</v-icon>
          </v-btn>
        </div>
      </div>
    </v-sheet>
    <!-- CONTENT SECTION END -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    'voting-out-btn': () => import('../components/common/voting-out-btn.vue'),
    'voting-progress-circle': () => import('../components/common/voting-progress-circle.vue'),
    countdown: () => import('../components/common/countdown.vue')
  }
})
export default class extends Vue {}
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
