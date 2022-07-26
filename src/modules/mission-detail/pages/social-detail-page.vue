<template>
  <v-container>
    <v-row>
      <!-- ------------------------------ BREADCRUMBS NAVIGATION START ------------------------------ -->
      <v-col cols="12">
        <div class="mb-10 mt-4">
          <div class="d-flex align-center font-weight-medium">
            <span class="blue-diversity--text mr-5 cursor-pointer text-truncate" @click="$router.push('/projects')">
              Your project
            </span>
            <v-icon class="mr-5" size="22">mdi-chevron-right</v-icon>
            <span
              class="blue-diversity--text cursor-pointer text-truncate"
              @click="$router.push(`/projects/${vm.pool.unicodeName}`)"
              >{{ vm.pool.projectName }}</span
            >
            <v-icon class="mx-5" size="22">mdi-chevron-right</v-icon>
            <span class="neutral10--text text-truncate">{{ vm.mission.name }}</span>
          </div>
        </div>
      </v-col>
      <!-- ------------------------------ BREADCRUMBS NAVIGATION END ------------------------------- -->

      <!-- ------------------------------ LOADING SKELETON START ----------------------------------- -->
      <template v-if="vm.loading">
        <v-col cols="12" md="8" order="2" order-md="1">
          <v-skeleton-loader type="image,image,image" />
        </v-col>
        <v-col cols="12" md="4" class="mb-4 mb-md-0" order="1" order-md="2">
          <v-skeleton-loader type="image" />
        </v-col>
      </template>
      <!-- ------------------------------ LOADING SKELETON END ------------------------------------- -->

      <!-- ------------------------------ MISSION DETAIL START ------------------------------------- -->
      <template v-else>
        <v-row>
          <v-col cols="12" md="8" order="2" order-md="1">
            <v-sheet outlined rounded="lg" class="pa-6 mb-6">
              <!-- PROJECT LOGO AND NAME START  -->
              <div class="d-flex align-center flex-wrap">
                <v-avatar size="76">
                  <v-img :src="$_get(vm.mission, 'metadata.projectLogo')" />
                </v-avatar>
                <div class="d-flex flex-column justify-space-between mt-2 ml-0 ml-sm-4 flex-grow-1">
                  <span class="text-h5 font-weight-bold">{{ $_get(vm.mission, 'name') }}</span>
                  <span class="font-weight-bold neutral-10--text"
                    >{{ $_get(vm.mission, 'startTime') | datetime }} -
                    {{ $_get(vm.mission, 'endTime') | datetime }}</span
                  >
                </div>
                <v-sheet color="blue-2" class="mt-2 blue-diversity--text font-weight-600 pa-2" rounded
                  >Social Mission</v-sheet
                >
              </div>
              <!-- PROJECT LOGO AND NAME END  -->

              <!-- DESCRIPTION START -->
              <div class="mt-7 neutral-10--text wspace-preline">
                {{ $_get(vm.mission, 'metadata.shortDescription') }}
              </div>
              <!-- DESCRIPTION END -->

              <div class="mt-6 row no-gutters">
                <div class="col-12 col-sm-6 mb-2 mb-sm-0">
                  <div class="black rounded-lg overflow-hidden">
                    <v-img max-height="250" aspect-ratio="1" contain :src="$_get(vm.mission, 'metadata.coverImage')" />
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <v-sheet class="px-4 py-8 d-flex flex-column ml-0 ml-sm-4 fill-height" rounded="lg" outlined>
                    <span class="text-center text-h5 font-weight-600"
                      >{{ $_get(vm.mission, 'rewardAmount') | formatNumber(2) }}
                      {{ $_get(vm.mission, 'metadata.rewardToken') }}</span
                    >
                    <span class="text-center">Total reward</span>
                    <div class="mt-6 d-flex justify-space-between">
                      <span>Priority (30%):</span>
                      <span class="font-weight-600"
                        >{{ $_get(vm.mission, 'priorityRewardAmount', 0) | formatNumber(2) }}
                        {{ $_get(vm.mission, 'metadata.rewardToken') }}</span
                      >
                    </div>
                    <div class="d-flex justify-space-between">
                      <span>Community (70%):</span>
                      <span class="font-weight-600"
                        >{{ vm.communityAmount | formatNumber(2) }}
                        {{ $_get(vm.mission, 'metadata.rewardToken') }}</span
                      >
                    </div>
                    <div class="d-flex justify-space-between">
                      <span>Max priority participants:</span>
                      <span class="font-weight-600">{{ $_get(vm.mission, 'maxPriorityParticipants', 0) }}</span>
                    </div>
                  </v-sheet>
                </div>
              </div>

              <div class="mt-6">
                <div class="text-h6 font-weight-bold">Mission setting</div>
                <mission-social-setting-viewer :data="$_get(vm.mission, 'data', {})" />
              </div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="4" order="1" order-md="2">
            <v-sheet outlined rounded="lg" style="border: 2px solid var(--v-blue-diversity-base)">
              <div class="blue-diversity white--text py-2 text-center font-weight-600">Mission stats</div>
              <div class="pa-6">
                <div class="d-flex justify-space-between font-18 font-weight-600">
                  <span>Total participants</span>
                  <span>{{ $_get(vm.mission, 'totalParticipants', 0) }} users</span>
                </div>
                <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
                  <span>Priority pool</span>
                  <span>{{ vm.priorityPoolParticipants }} users</span>
                </div>
                <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
                  <span>Community pool</span>
                  <span>{{ vm.communityPoolParticipants }} users</span>
                </div>
                <!-- <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
            <span>Total shared</span>
            <span>1,500</span>
          </div>
          <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
            <span>Total reacted</span>
            <span>1,500</span>
          </div> -->
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
      <!-- ------------------------------ MISSION DETAIL END --------------------------------------- -->
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { get } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue } from 'vue-property-decorator'
import { SocialMissionDetailViewModel } from '../viewmodels/social-detail-viewmodel'

@Observer
@Component({
  components: {
    'mission-social-setting-viewer': () => import('../components/social/mission-social-setting-viewer.vue'),
  },
})
export default class MissionDetailPage extends Vue {
  @Provide() vm = new SocialMissionDetailViewModel(
    get(this.$route, 'params.unicodeName', ''),
    get(this.$route, 'params.id', '')
  )
}
</script>

<style scoped></style>
