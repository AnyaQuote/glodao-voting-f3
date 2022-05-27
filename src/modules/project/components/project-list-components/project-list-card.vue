<template>
  <v-sheet class="rounded-lg" outlined>
    <v-row no-gutters dense align="stretch" style="border-bottom: thin solid var(--v-neutral20-base)">
      <v-col cols="6" style="border-right: thin solid var(--v-neutral20-base)">
        <v-sheet height="124" class="pa-6 d-flex blue-2 rounded-tl-lg">
          <v-img class="d-flex justify-center align-center mr-4" max-width="76" max-height="78" :src="pool.projectLogo">
          </v-img>

          <v-spacer class="d-flex flex-column justify-center">
            <div class="text-h5 font-weight-bold">{{ pool.projectName }}</div>
            <div class="text-h6 neutral10--text">{{ pool.tokenSymbol }}</div>
          </v-spacer>
        </v-sheet>

        <v-divider></v-divider>

        <v-sheet class="pa-6">
          <div class="d-flex mb-2">
            <v-sheet class="mr-2">Voting start: </v-sheet>
            <!-- <v-sheet class="font-weight-bold">{{ pool.startDate | ddmmyyyyhhmma }}</v-sheet> -->
            24/05/2022 10:00 pm
          </div>
          <div class="d-flex mb-2">
            <div class="mr-2">Voting end:</div>
            <!-- <v-sheet class="font-weight-bold">{{ pool.endDate | ddmmyyyyhhmma }}</v-sheet> -->
            27/05/2022 10:00 pm
          </div>
          <div class="d-flex">
            <div class="mr-2">Total reward amount:</div>
            <div class="font-weight-bold">{{ pool.amount | formatNumber }} {{ pool.tokenName }}</div>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="6" class="d-flex flex-column">
        <v-sheet height="124" class="pa-6">
          <v-sheet class="mb-3 font-weight-bold">Final result</v-sheet>
          <v-sheet
            height="40"
            class="d-flex justify-center align-center rounded white--text font-weight-600 text-subtitle-1"
            :class="statusReport.color"
          >
            {{ statusReport.text }}
          </v-sheet>
        </v-sheet>

        <v-divider></v-divider>

        <div class="spacer pa-6">
          <v-sheet class="d-flex align-baseline mb-2">
            <v-sheet
              height="27"
              width="60"
              class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 app-green lighten-2"
            >
              👍 YES
            </v-sheet>
            <v-sheet class="text-subtitle-1 neutral-0--text">We want the project to launch </v-sheet>
          </v-sheet>
          <progress-bar :value="pool.votedPercent" class="mb-2" />
          <v-sheet class="d-flex justify-space-between text-subtitle-2 font-weight-400">
            <div class="neutral-0--text">{{ pool.votedPercent | formatNumber }}%</div>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
    <router-link
      :to="`/projects/${pool.unicodeName}`"
      class="d-block blue-2 rounded-lg rounded-t-0 d-flex align-center justify-center"
      style="height: 56px"
    >
      <span class="blue-diversity--text font-weight-600 text-subtitle-1 text-none">View detail</span>
    </router-link>
  </v-sheet>
</template>

<script lang="ts">
import { PoolStore } from '@/stores/pool-store'
import { get } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class ProjectCard extends Vue {
  @Prop({ required: true }) pool!: PoolStore

  upvoteCount = Math.floor(Math.random() * 1000) + 500
  downvoteCount = Math.floor(Math.random() * 500)
  totalVoteCount = this.upvoteCount + this.downvoteCount

  get upvote() {
    return (this.upvoteCount / this.totalVoteCount) * 100
  }

  get statusReport() {
    switch (this.pool.status) {
      case 'voting':
        return {
          color: 'app-blue',
          text: 'Your project is opening for vote',
        }
      case 'approved':
        return {
          color: 'app-green',
          text: 'Your project is approved',
        }
      case 'cancelled':
        return {
          color: 'app-red',
          text: 'Your project is cancelled',
        }
      default:
        return {
          color: 'red',
          text: 'Your project is rejected',
        }
    }
  }

  get projectLogo() {
    return get(this.pool, 'data.projectLogo', '')
  }
}
</script>

<style scoped>
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.clip-text {
  word-break: break-word;
  text-overflow: hidden;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
