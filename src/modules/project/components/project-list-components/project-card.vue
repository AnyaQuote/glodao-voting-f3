<template>
  <div class="project-card-form overflow-hidden">
    <v-row no-gutters dense align="stretch">
      <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6" :class="!$vuetify.breakpoint.mobile && 'border-right'">
        <div class="project-info pa-4 pa-sm-6 d-flex align-stretch blue-2">
          <div class="project-logo neutral-100 rounded d-flex justify-center align-center mr-4" style="padding: 6px">
            <v-img :src="$_get(pool, 'projectLogo')" contain max-height="100%" />
          </div>
          <div class="spacer text-truncate">
            <div class="text-h6 text-sm-h5 font-weight-bold text-truncate">{{ $_get(pool, 'projectName') }}</div>
            <div class="text-subtitle-1 text-sm-h6 neutral10--text font-weight-medium">
              ${{ $_get(pool, 'tokenBName') }}
            </div>
          </div>
        </div>
        <div class="border-bottom"></div>
        <div class="pa-4 text-subtitle-2 text-md-subtitle-1 neutral-10--text font-weight-regular">
          <span class="two-line">{{ $_get(pool, 'shortDescription') }}</span>
        </div>
        <div class="border-bottom"></div>
        <div class="pa-4 text-subtitle-1" :class="$vuetify.breakpoint.mobile && 'border-bottom'">
          <!-- PROJECT TIME -->
          <project-time :pool="pool" />
          <!--==========--->

          <!-- PROJECT TOTAL REWARD -->
          <div>
            <span class="neutral-10--text font-weight-medium">Total reward amount: </span>
            <span class="font-weight-600">{{ tokenBAmount | formatNumber(2) }} {{ $_get(pool, 'tokenBName') }}</span>
          </div>
          <!--======================-->
        </div>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6">
        <div class="pa-4 project-info">
          <div class="text-subtitle-1 font-weight-medium mb-3">Final result</div>
          <!-- PROJECT STATUS -->
          <project-status :pool="pool" />
          <!--================-->
        </div>
        <div class="border-bottom"></div>

        <div class="pa-4">
          <!-- VOTED YES  -->
          <div class="d-flex align-baseline">
            <div
              class="app-blue--text text--lighten-1 text-subtitle-2 rounded-lg d-flex justify-center align-center mr-4 mb-2 app-green lighten-1"
              style="height: 27px; width: 59px"
            >
              👍 YES
            </div>
            <div class="text-subtitle-2 text-md-subtitle-1 text-truncate">We want the project to launch</div>
          </div>
          <progress-bar :value="$_get(pool, 'votedYesPercent')" />
          <div class="d-flex justify-space-between text-subtitle-2 mt-2">
            <div>{{ $_get(pool, 'approvedUsers.length') | formatNumber(0) }}</div>
            <div>{{ $_get(pool, 'votedYesPercent') | formatNumber(2, 2) }} %</div>
          </div>
          <!--==========--->
        </div>

        <div class="pa-4">
          <!-- VOTED NO -->
          <div class="d-flex align-baseline">
            <div
              class="app-blue--text text--lighten-1 text-subtitle-2 rounded-lg d-flex justify-center align-center mr-4 mb-2 app-red"
              style="height: 27px; width: 59px"
            >
              👎 NO
            </div>
            <div class="text-subtitle-2 text-md-subtitle-1 text-truncate">We don't want the project to launch</div>
          </div>
          <progress-bar :value="$_get(pool, 'votedNoPercent')" />
          <div class="d-flex justify-space-between text-subtitle-2 mt-2">
            <div>{{ $_get(pool, 'rejectedUsers.length') | formatNumber(0) }}</div>
            <div>{{ $_get(pool, 'votedNoPercent') | formatNumber(2, 2) }} %</div>
          </div>
          <!--==========--->
        </div>
      </v-col>
    </v-row>
    <div class="border-bottom"></div>
    <!-- <router-link :to="`/projects/${pool.unicodeName}`"> -->
    <v-sheet
      v-ripple
      height="56"
      @click="goToProjectDetail"
      class="d-flex align-center justify-center cursor-pointer blue-2 blue-diversity--text font-weight-600"
    >
      View detail
    </v-sheet>
    <!-- </router-link> -->
  </div>
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { RouteName } from '@/router'
import { PoolStore } from '@/stores/pool-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'project-status': () => import('./project-status.vue'),
    'project-time': () => import('./project-time.vue'),
  },
})
export default class extends Vue {
  @Prop({ required: true }) pool!: PoolStore

  goToProjectDetail() {
    this.$router.push({
      name: RouteName.PROJECT_DETAIL,
      params: {
        unicodeName: this.pool.unicodeName || EMPTY_STRING,
      },
    })
  }

  // Display tokenBAmount manually (not through contract)
  get tokenBAmount() {
    return FixedNumber.from(this.pool.poolData.data?.optionalRewardAmount)
  }

  get tokenBSingleMissionAmount() {
    try {
      return this.tokenBAmount.divUnsafe(FixedNumber.from(this.pool.poolData.totalMission))
    } catch (_) {
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
.project-card-form {
  border: 1px solid var(--v-neutral-20-base);
  border-radius: 8px;
}
.project-info {
  @include breakpoint(tablet) {
    height: 124px;
  }
}

.project-logo {
  height: 56px;
  width: 56px;
  @include breakpoint(tablet) {
    height: 76px;
    width: 76px;
  }
}

.border-right {
  border-right: 1px solid var(--v-neutral-20-base);
}

.border-bottom {
  border-bottom: 1px solid var(--v-neutral-20-base);
}
</style>
