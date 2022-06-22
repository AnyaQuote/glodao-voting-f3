<template>
  <!-- --------------------------------------- HAS MISSIONS --------------------------------------- -->
  <v-row v-if="vm.missions.length">
    <v-col cols="12" md="4" sm="6" v-for="(mission, index) in vm.missions" :key="index">
      <v-sheet v-ripple class="rounded-lg scale-on-hover" elevation="3" @click="goToMissionDetail(mission.id || '')">
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
              <div class="font-weight-bold">{{ $_get(mission, 'rewardAmount') | formatNumber(2) }}</div>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <div class="neutral10--text">Priority reward</div>
              <div class="font-weight-bold">{{ $_get(mission, 'priorityRewardAmount') }}</div>
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
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class ProjectEndedContent extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  goToMissionDetail(missionId: string) {
    this.$router.push({
      name: 'mission-detail',
      params: {
        unicodeName: this.vm.poolStore?.unicodeName || '',
        id: missionId,
      },
    })
  }
}
</script>

<style lang="scss" scoped>
.scale-on-hover:hover {
  transform: scale(105%);
  transition: transform 300ms;
}
</style>
