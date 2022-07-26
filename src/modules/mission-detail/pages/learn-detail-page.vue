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
                <div class="d-flex flex-column justify-space-between ml-2 ml-sm-4 flex-grow-1">
                  <span class="text-h5 font-weight-bold">{{ $_get(vm.mission, 'name') }}</span>
                  <span class="font-weight-bold neutral-10--text"
                    >{{ $_get(vm.mission, 'startTime') | datetime }} -
                    {{ $_get(vm.mission, 'endTime') | datetime }}</span
                  >
                </div>
                <v-sheet color="blue-2" class="mt-2 mt-sm-0 blue-diversity--text font-weight-600 pa-2" rounded>
                  Learn to earn Mission
                </v-sheet>
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
                  <v-sheet
                    class="px-4 py-8 d-flex justify-center align-center ml-0 ml-sm-4 fill-height"
                    rounded="lg"
                    outlined
                  >
                    <div>
                      <div class="text-center text-h5 font-weight-600">
                        {{ $_get(vm.mission, 'rewardAmount') | formatNumber(2) }}
                        {{ $_get(vm.mission, 'metadata.rewardToken') }}
                      </div>
                      <div class="text-center">Total reward</div>
                    </div>
                  </v-sheet>
                </div>
              </div>

              <!-- MISSION DETAIL -->
              <div class="mt-6">
                <v-sheet class="blue-2 d-flex rounded-t-lg font-weight-bold overflow-hidden">
                  <div
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="pa-4 cursor-pointer"
                    :class="isActive(tab.value)"
                    @click="changeTab(tab.value)"
                  >
                    {{ tab.name }}
                  </div>
                </v-sheet>

                <div class="mt-6">
                  <v-slide-x-transition group hide-on-leave>
                    <mission-lte-overview v-if="tab === 1" key="1" />
                    <mission-document-viewer
                      v-if="tab === 2"
                      key="2"
                      :document="$_get(vm.quiz, 'learningInformation')"
                    />
                    <mission-quiz-viewer v-if="tab === 3" key="3" :data="vm.combineQuizData" />
                  </v-slide-x-transition>
                </div>
              </div>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="4" class="mb-4 mb-md-0" order="1" order-md="2">
            <v-sheet
              class="overflow-hidden"
              outlined
              rounded="lg"
              style="border: 2px solid var(--v-blue-diversity-base)"
            >
              <div class="blue-diversity white--text py-2 text-center font-weight-600">Mission stats</div>
              <div class="pa-6">
                <div class="d-flex justify-space-between font-18 font-weight-600">
                  <span>Total participants</span>
                  <span>{{ $_get(vm.mission, 'totalParticipants', 0) }} users</span>
                </div>
                <!-- <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
            <span>Total participant</span>
            <span>1,500</span>
          </div>
          <div class="d-flex justify-space-between mt-5 font-18 font-weight-600">
            <span>Total participant</span>
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
import { LearnMissionDetailViewModel } from '../viewmodels/learn-detail-viewmodel'

@Observer
@Component({
  components: {
    'mission-document-viewer': () => import('../components/learn-to-earn/mission-document-viewer.vue'),
    'mission-lte-overview': () => import('../components/learn-to-earn/mission-lte-overview.vue'),
    'mission-quiz-viewer': () => import('../components/learn-to-earn/mission-quiz-viewer.vue'),
  },
})
export default class MissionDetailPage extends Vue {
  @Provide() vm = new LearnMissionDetailViewModel(
    get(this.$route, 'params.unicodeName', ''),
    get(this.$route, 'params.id', '')
  )

  readonly tabs = [
    { name: 'Overview', value: 1 },
    { name: 'Document', value: 2 },
    { name: 'Quiz', value: 3 },
  ]
  tab = 1

  changeTab(value: number) {
    this.tab = value
  }

  get isActive() {
    return (tabIndex) => (this.tab == tabIndex ? 'blue-diversity white--text' : '')
  }
}
</script>

<style scoped></style>
