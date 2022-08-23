<template>
  <v-container>
    <v-row>
      <!-- ------------------------------ BREADCRUMBS NAVIGATION START ------------------------------ -->
      <v-col cols="12">
        <mission-breadcrumb :data="vm.breadcrumbData" />
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
        <v-col cols="12" md="8" order="2" order-md="1">
          <v-sheet outlined rounded="lg" class="pa-6 mb-6">
            <mission-info />
            <mission-app-setting />
            <mission-app-link />
            <mission-app-overview />
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4" oclass="mb-4 mb-md-0" order="1" order-md="2">
          <v-sheet class="overflow-hidden" outlined rounded="lg" style="border: 2px solid var(--v-blue-diversity-base)">
            <div class="blue-diversity white--text py-2 text-center font-weight-600">Mission stats</div>
            <div class="pa-6">
              <div class="d-flex justify-space-between font-18 font-weight-600">
                <span>Total participants</span>
                <span>0 users</span>
              </div>
            </div>
          </v-sheet>
          <div class="mt-4 d-flex justify-space-between">
            <v-btn
              :loading="vm.loading_button"
              @click="vm.export('user')"
              depressed
              class="rounded linear-blue--bg white--text"
            >
              Export users
            </v-btn>
            <v-btn
              :loading="vm.loading_button"
              @click="vm.export('reward')"
              depressed
              class="rounded linear-blue--bg white--text"
            >
              Export rewards
            </v-btn>
          </div>
        </v-col>
      </template>
      <!-- ------------------------------ MISSION DETAIL END --------------------------------------- -->
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { RouteName } from '@/router'
import { get } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../viewmodels/iat-detail-viewmodel'

@Observer
@Component({
  components: {
    'mission-breadcrumb': () => import('../components/common/mission-breadcrumb.vue'),
    'mission-info': () => import('../components/in-app-trial/mission-info.vue'),
    'mission-app-setting': () => import('../components/in-app-trial/mission-app-setting.vue'),
    'mission-app-link': () => import('../components/in-app-trial/mission-app-link.vue'),
    'mission-app-overview': () => import('../components/in-app-trial/mission-app-overview.vue'),
  },
})
export default class InAppTrialDetailPage extends Vue {
  @Provide() vm = new InAppTrialDetailViewModel(
    get(this.$route, 'params.unicodeName', ''),
    get(this.$route, 'params.id', '')
  )
}
</script>

<style scoped></style>
