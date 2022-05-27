<template>
  <v-sheet v-if="smAndUp" class="rounded-lg" :class="backgroundColor">
    <v-sheet class="rounded-lg rounded-b-0">
      <v-img max-height="648" :src="pool.projectCover">
        <div class="d-flex flex-column white--text pt-7 px-9">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h6 font-weight-bold">Project launching soon</span>
            <voting-out-btn />
          </div>
          <div class="row justify-center mt-10">
            <div class="col-12 text-center">
              <div class="text-h3 font-weight-bold">{{ pool.projectName }}</div>
              <v-sheet width="500" class="mx-auto transparent--bg white--text mt-4 text-h5">
                {{ pool.shortDescription }}
              </v-sheet>
              <v-sheet max-width="456" class="row mx-auto my-10 rounded-lg blur-bg">
                <div class="col-6 text-center">
                  <span class="text-subtitle-2 neutral-10--text">Total reward </span>
                  <div class="text-h6 d-flex white--text align-center justify-center">
                    <span class="mr-1">{{ $_get(pool, 'amount', '0') }} {{ $_get(pool, 'tokenName', 'HWD') }}</span>
                    <v-img src="@/assets/icons/crypto.svg" max-width="24" max-height="24" />
                  </div>
                </div>
                <div class="col-6 text-center">
                  <span class="text-subtitle-2 neutral-10--text">Total missions </span>
                  <div class="text-h6 d-flex white--text align-center justify-center">
                    <span class="mr-1">{{ $_get(pool, 'totalMission', '0') }}</span>
                    <v-img src="@/assets/icons/bulleyes.svg" max-width="24" max-height="24" />
                  </div>
                </div>
                <div class="col-6 text-center">
                  <span class="text-subtitle-2 neutral-10--text">Total reward </span>
                  <div class="text-h6 d-flex white--text align-center justify-center">
                    <span class="mr-1">
                      {{ $_get(pool, 'rewardPerMission', '0') }} {{ $_get(pool, 'tokenName', 'HWD') }}
                    </span>
                    <v-img src="@/assets/icons/crypto.svg" max-width="24" max-height="24" />
                  </div>
                </div>
                <div class="col-6 text-center">
                  <span class="text-subtitle-2 neutral-10--text">Total reward </span>
                  <div class="text-h6 d-flex white--text align-center justify-center">
                    <!-- TODO: Hard code rewardValue -->
                    <span class="mr-1">{{ $_get(pool, 'rewardValue', '0') }}</span>
                    <v-img src="@/assets/icons/bsc-icon.svg" max-width="24" max-height="24" />
                  </div>
                </div>
              </v-sheet>
            </div>
          </div>
        </div>
      </v-img>
    </v-sheet>
    <div class="pa-5 px-9 d-flex justify-space-between justify-start align-center">
      <div class="d-flex justify-center align-center mt-2 text-h6 font-weight-bold flex-wrap">
        <div class="mr-4">Ended voting in:</div>
        <div>{{ $_get(pool, 'endDate') | ddmmyyyyhhmmss }}</div>
        <v-sheet v-show="$vuetify.breakpoint.mdAndUp" height="8" width="8" class="rounded-circle blue mx-4"> </v-sheet>
        <div>Launching soon on {{ platform }}</div>
      </div>
      <v-btn class="rounded-lg" color="blue" outlined :to="'#'">
        <span class="text-h6">Read more</span>
      </v-btn>
    </div>
  </v-sheet>
  <div v-else class="rounded-lg" :class="backgroundColor">
    <v-img max-height="244" :src="$_get(pool, 'projectCover', '')">
      <div class="text-end ma-4">
        <voting-out-btn />
      </div>
    </v-img>
    <div class="white d-flex flex-column align-center py-4" :class="cardColor">
      <div class="font-28 font-weight-bold mb-4">{{ $_get(pool, 'projectName') }}</div>
      <div class="mb-4 text-subtitle-1">
        <span class="font-weight-bold">{{ $_get(pool, 'upvote', '0') | formatNumber(2) }}%</span>
        <span>👍 YES votes</span>
      </div>
      <div class="text-subtitle-1">
        <span class="font-weight-bold">{{ $_get(pool, 'downvote', '0') | formatNumber(2) }}%</span>
        <span>👎 NO votes</span>
      </div>
    </div>
    <div class="d-flex flex-column align-center py-4 text-subtitle-1 font-weight-bold" :class="backgroundColor">
      <div class="mb-2">Ended voting in: {{ $_get(pool, 'endDate') | ddmmyyyyhhmmss }}</div>
      <div class="mb-4">Launching soon on {{ platform }}</div>
      <v-btn class="rounded-lg" color="blue" height="50" outlined :to="'#'">
        <span class="text-h6">Read more</span>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { PoolStore } from '@/stores/pool-store'

@Component({
  components: {
    'voting-out-btn': () => import('../common/voting-out-btn.vue'),
    'voting-progress-circle': () => import('../common/voting-progress-circle.vue'),
  },
})
export default class VotingLaunchItem extends Vue {
  @Prop({ required: true }) pool!: PoolStore
  platform = this.pool.type === 'bounty' ? 'Bounty Hunter' : 'Launchpad'

  get smAndUp() {
    return this.$vuetify.breakpoint.smAndUp
  }

  get backgroundColor() {
    return this.$vuetify.theme.dark ? 'neutral100--bg' : 'blue lighten-4'
  }

  get cardColor() {
    return this.$vuetify.theme.dark ? 'blue lighten-4 black--text' : 'white black--text'
  }
}
</script>

<style lang="scss" scoped>
.font-28 {
  font-size: 28px;
  line-height: 36.4px;
}
.blur-bg {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
