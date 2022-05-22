<template>
  <v-sheet class="rounded-lg" outlined>
    <v-row no-gutters dense align="stretch" style="border-bottom: thin solid var(--v-neutral20-base)">
      <!------------------------------------------ CARD RIGHT -------------------------------------------------->
      <v-col cols="6" style="border-right: thin solid var(--v-neutral20-base)">
        <v-sheet height="124" class="pa-6 d-flex blue lighten-3 rounded-tl-lg">
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

        <v-sheet class="pa-6"> {{ $_get(pool, 'data.shortDescription') }} </v-sheet>

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
            :class="statusClass"
          >
            {{ statusReport }}
          </v-sheet>
        </v-sheet>

        <v-divider></v-divider>

        <v-sheet class="spacer pa-6 d-flex flex-column justify-space-between">
          <v-sheet>
            <v-sheet class="d-flex align-baseline mb-2">
              <v-sheet
                height="27"
                width="60"
                class="d-flex justify-center align-center rounded-lg white--text subtitle-2 font-weight-400 mr-3 green lighten-1"
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
    <v-btn class="blue lighten-3 d-flex rounded-b-lg" height="56" block depressed @click="goToDetail">
      <span blue--text font-weight-600 text-subtitle-1>View detail</span>
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import { VotingPools } from '@/models/VotingModel'
import { RoutePaths } from '@/router'
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

  goToDetail() {
    this.$router.push(RoutePaths.project_detail + this.pool.unicodeName)
  }

  get upvote() {
    return (this.upvoteCount / this.totalVoteCount) * 100
  }

  get statusClass() {
    return this.pool.status === 'approved' ? 'green lighten-1' : 'redSenamatic'
  }

  get statusReport() {
    return this.pool.status === 'approved' ? 'Your project is approved' : 'Your project is rejected'
  }

  get projectLogo() {
    return get(this.pool, 'data.projectLogo', '')
  }
}
</script>

<style scoped></style>
