<template>
  <v-sheet class="rounded-lg" outlined>
    <v-row no-gutters dense align="stretch" style="border-bottom: thin solid var(--v-neutral20-base)">
      <!------------------------------------------ CARD RIGHT -------------------------------------------------->
      <v-col cols="6" style="border-right: thin solid var(--v-neutral20-base)">
        <v-sheet height="124" class="pa-6 d-flex app-blue lighten-1 rounded-tl-lg">
          <v-img
            class="d-flex justify-center align-center mr-4"
            max-width="76"
            max-height="78"
            :src="$_get(pool, 'data.projectLogo')"
          >
          </v-img>

          <v-spacer class="d-flex flex-column justify-center">
            <div class="text-h5 font-weight-bold">{{ $_get(pool, 'projectName') }}</div>
            <div class="text-h6 neutral10--text">$SB</div>
          </v-spacer>
        </v-sheet>

        <v-divider></v-divider>

        <v-sheet height="140" class="pa-6 clip-text neutral10--text">
          {{ $_get(pool, 'data.shortDescription') }}
        </v-sheet>

        <v-divider></v-divider>

        <v-sheet class="pa-6">
          <v-sheet class="d-flex">
            <v-sheet class="mr-2">Voting start: </v-sheet>
            <v-sheet class="font-weight-bold">{{ $_get(pool, 'startDate') | ddmmyyyyhhmma }}</v-sheet>
          </v-sheet>
          <v-sheet class="d-flex">
            <v-sheet class="mr-2">Voting start: </v-sheet>
            <v-sheet class="font-weight-bold">{{ $_get(pool, 'endDate') | ddmmyyyyhhmma }}</v-sheet>
          </v-sheet>
        </v-sheet>
      </v-col>

      <!-------------------------------------------- CARD LEFT -------------------------------------------------->
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

        <v-sheet class="spacer pa-6 d-flex flex-column justify-space-between">
          <v-sheet>
            <v-sheet class="d-flex align-baseline mb-2">
              <v-sheet
                height="27"
                width="60"
                class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 green lighten-2"
              >
                👍 YES
              </v-sheet>
              <v-sheet class="text-subtitle-1">We want the project to launch </v-sheet>
            </v-sheet>
            <progress-bar :value="upvote" class="mb-2" />
            <v-sheet class="d-flex justify-space-between text-subtitle-2 font-weight-400">
              <v-sheet>{{ upvoteCount }} votes</v-sheet>
              <v-sheet>{{ upvote | formatNumber(2, 2) }}%</v-sheet>
            </v-sheet>
          </v-sheet>
          <v-sheet>
            <v-sheet class="d-flex align-baseline mb-2">
              <v-sheet
                height="27"
                width="60"
                class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 red"
              >
                👎 NO
              </v-sheet>
              <v-sheet class="text-subtitle-1">We don’t want the project to launch </v-sheet>
            </v-sheet>
            <progress-bar :value="100 - upvote" class="mb-2" />
            <v-sheet class="d-flex justify-space-between text-subtitle-2 font-weight-400">
              <v-sheet>{{ downvoteCount }} votes</v-sheet>
              <v-sheet> {{ (100 - upvote) | formatNumber(2, 2) }}% </v-sheet>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
    <router-link
      :to="`/projects/${pool.unicodeName}`"
      class="d-block app-blue lighten-1 rounded-lg rounded-t-0 d-flex align-center justify-center"
      style="height: 56px"
    >
      <span class="app-blue--text font-weight-600 text-subtitle-1 text-none">View detail</span>
    </router-link>
  </v-sheet>
</template>

<script lang="ts">
import { VotingPools } from '@/models/VotingModel'
import { get } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class ProjectCard extends Vue {
  @Prop({ required: true }) pool!: VotingPools

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
          color: 'green lighten-2',
          text: 'Your project is approved',
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
