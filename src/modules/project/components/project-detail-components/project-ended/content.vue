<template>
  <!-- --------------------------------------- HAS MISSIONS --------------------------------------- -->
  <v-row v-if="vm.missions.length">
    <v-col cols="12" md="4" sm="6" v-for="(mission, index) in vm.missions" :key="index">
      <v-sheet
        @click="goToMissionDetail(mission.type, mission.id)"
        class="rounded-lg scale-on-hover"
        elevation="3"
        v-ripple
      >
        <v-img max-height="239" aspect-ratio="1" :src="$_get(mission, 'metadata.coverImage')" class="rounded-t-lg">
          <div
            class="d-inline-block rounded pa-2 mt-2 ml-2 text-subtitle-2 text-uppercase black--text"
            :class="$_get(mission, 'status') === 'ended' ? 'neutral-100' : 'app-green lighten-1'"
          >
            {{ $_get(mission, 'status') }}
          </div>
        </v-img>
        <div class="pa-6">
          <div class="font-weight-600 text-h5 mb-2 text-truncate">
            {{ mission.name }} #<span>{{ index + 1 }}</span>
          </div>
          <div class="text-subtitle-1">
            <div class="d-flex justify-space-between mb-2">
              <div class="neutral10--text">Total reward</div>
              <div class="font-weight-bold">
                {{ $_get(mission, 'rewardAmount') | formatNumber(2) }} {{ $_get(mission, 'metadata.rewardToken') }}
              </div>
            </div>

            <div v-if="mission.type === 'learn' || mission.type === 'iat'" class="d-flex justify-space-between mb-2">
              <div class="neutral10--text">Max participants</div>
              <div class="font-weight-bold">{{ $_get(mission, 'maxParticipants', 0) }}</div>
            </div>
            <div v-else class="d-flex justify-space-between mb-2">
              <div class="neutral10--text">Priority reward</div>
              <div class="font-weight-bold">
                {{ $_get(mission, 'priorityRewardAmount', 0) | formatNumber(2) }}
                {{ $_get(mission, 'metadata.rewardToken') }}
              </div>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <div class="neutral10--text">Start time</div>
              <div class="font-weight-bold">{{ $_get(mission, 'startTime') | ddmmyyyyhhmma }}</div>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <div class="neutral10--text">End time</div>
              <div class="font-weight-bold">{{ $_get(mission, 'endTime') | ddmmyyyyhhmma }}</div>
            </div>
          </div>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
  <!-- ------------------------------------- EMPTY MISSIONS --------------------------------------- -->
  <v-sheet v-else height="320" class="d-flex rounded-lg" elevation="3">
    <div class="ma-auto text-center">
      <div class="mb-4 text-h6 font-weight-bold">Congratulations! Your bounty project is approved.</div>
      <p>
        Your project is voted by GloDAO investor successfully. So now<br />
        you can create and manage all missions for your project here!
      </p>
    </div>
  </v-sheet>
  <!-- -------------------------------------------------------------------------------------------- -->
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { MissionType } from '@/models/MissionModel'
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { RouteName } from '@/router'
import { get } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class ProjectEndedContent extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  goToMissionDetail(missionType?: string, missionId?: string) {
    const type = missionType || EMPTY_STRING
    const id = missionId || EMPTY_STRING
    const unicodeName = get(this.vm.poolStore, 'unicodeName', EMPTY_STRING)
    if (type === MissionType.APP_TRIAL) {
      this.$router.push({
        name: RouteName.MISSION_IAT_DETAIL,
        params: { unicodeName, id },
      })
    } else {
      this.$router.push({
        name: RouteName.MISSION_DETAIL,
        params: { unicodeName, id },
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scale-on-hover:hover {
  transform: scale(105%);
  transition: transform 300ms;
}
</style>
