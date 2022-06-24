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
        <mission-lte-detail v-if="vm.isLteMission" />
        <mission-social-detail v-else />
      </template>
      <!-- ------------------------------ MISSION DETAIL END --------------------------------------- -->
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { get } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue } from 'vue-property-decorator'
import { MissionDetailViewModel } from '../viewmodels/mission-detail-viewmodel'

@Observer
@Component({
  components: {
    'mission-social-detail': () => import('../components/mission-detail/mission-social-detail.vue'),
    'mission-lte-detail': () => import('../components/mission-detail/mission-lte-detail.vue'),
  },
})
export default class MissionDetailPage extends Vue {
  @Provide() vm = new MissionDetailViewModel(
    get(this.$route, 'params.unicodeName', ''),
    get(this.$route, 'params.id', '')
  )
}
</script>

<style scoped></style>
