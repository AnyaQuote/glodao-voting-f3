<template>
  <div class="project-card-form overflow-hidden">
    <v-row no-gutters dense align="stretch">
      <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6" :class="!$vuetify.breakpoint.mobile && 'border-right'">
        <div class="project-info pa-4 pa-sm-6 d-flex align-stretch blue-2">
          <div class="project-logo neutral-100 rounded d-flex justify-center align-center mr-4" style="padding: 6px">
            <v-img :src="pool.projectLogo" contain max-height="100%" />
          </div>
          <div class="spacer text-truncate">
            <div class="text-h6 text-sm-h5 font-weight-bold text-truncate">{{ pool.projectName }}</div>
            <div class="text-subtitle-1 text-sm-h6 neutral10--text font-weight-medium">$SB</div>
          </div>
        </div>
        <div class="border-bottom"></div>
        <div class="pa-4 text-subtitle-2 text-md-subtitle-1 neutral-10--text font-weight-regular">
          {{ pool.shortDescription }}
        </div>
        <div class="border-bottom"></div>
        <div class="pa-4 text-subtitle-1" :class="$vuetify.breakpoint.mobile && 'border-bottom'">
          <div>
            <span class="neutral-10--text font-weight-medium">Voting start: </span>
            <span class="font-weight-600">{{ pool.startDate | ddmmyyyyhhmma }}</span>
          </div>
          <div>
            <span class="neutral-10--text font-weight-medium">Voting start: </span>
            <span class="font-weight-600">{{ pool.endDate | ddmmyyyyhhmma }}</span>
          </div>
          <div>
            <span class="neutral-10--text font-weight-medium">Total reward amount: </span>
            <span class="font-weight-600">{{ pool.requiredAmount | formatNumber }} {{ pool.tokenName }}</span>
          </div>
        </div>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6">
        <div class="pa-4 project-info">
          <div class="text-subtitle-1 font-weight-medium mb-3">Final result</div>
          <div
            style="height: 40px"
            class="rounded app-blue--text text--lighten-1 font-weight-medium d-flex align-center justify-center text-subtitle-1"
            :class="statusReport.color"
          >
            {{ statusReport.text }}
          </div>
        </div>
        <div class="border-bottom"></div>

        <div class="pa-4">
          <div class="d-flex align-baseline">
            <div
              class="app-blue--text text--lighten-1 text-subtitle-2 rounded-lg d-flex justify-center align-center mr-4 mb-2 app-green lighten-1"
              style="height: 27px; width: 59px"
            >
              👍 YES
            </div>
            <div class="text-subtitle-2 text-md-subtitle-1 text-truncate">We want the project to launch</div>
          </div>
          <progress-bar :value="pool.votedPercent" />
          <div class="d-flex justify-space-between text-subtitle-2 mt-2">
            <div>---</div>
            <div>{{ pool.votedPercent | formatNumber(2, 2) }} %</div>
          </div>
        </div>

        <div class="pa-4">
          <div class="d-flex align-baseline">
            <div
              class="app-blue--text text--lighten-1 text-subtitle-2 rounded-lg d-flex justify-center align-center mr-4 mb-2 app-red"
              style="height: 27px; width: 59px"
            >
              👍 NO
            </div>
            <div class="text-subtitle-2 text-md-subtitle-1 text-truncate">We don't want the project to launch</div>
          </div>
          <progress-bar :value="pool.votedPercent" />
          <div class="d-flex justify-space-between text-subtitle-2 mt-2">
            <div>---</div>
            <div>{{ pool.votedPercent | formatNumber(2, 2) }} %</div>
          </div>
        </div>
      </v-col>
    </v-row>
    <div class="border-bottom"></div>
    <router-link :to="`/projects/${pool.unicodeName}`">
      <div class="d-flex align-center justify-center blue-2 blue-diversity--text font-weight-600" style="height: 56px">
        View detail
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { PoolStore } from '@/stores/pool-store'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Prop({ required: true }) pool!: PoolStore

  get statusReport() {
    if (this.pool.onVoting)
      return {
        color: 'app-blue',
        text: 'Your project is opening for vote',
      }
    if (this.pool.status === 'approved')
      return {
        color: 'app-green lighten-1',
        text: 'Project is approved',
      }
    if (this.pool.status === 'cancelled')
      return {
        color: 'app-red',
        text: 'Project is cancelled',
      }
    if (this.pool.voteEnded)
      return {
        color: 'app-red',
        text: 'Project is ended',
      }

    return {
      color: 'app-grey',
      text: this.pool.status,
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
