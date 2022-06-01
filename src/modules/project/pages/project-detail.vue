<template>
  <v-container>
    <div no-gutters dense v-if="vm.poolStore" class="mb-16">
      <div class="mt-4 mb-16">
        <div class="d-flex align-center font-weight-medium">
          <span class="app-blue--text mr-5 cursor-pointer" @click="$router.push('/projects')">Your project</span>
          <v-icon class="mr-5" size="22">mdi-chevron-right</v-icon>
          <span class="neutral10--text">{{ vm.poolStore.projectName }}</span>
        </div>
      </div>

      <div v-if="vm.loading">
        <div class="row">
          <v-skeleton-loader class="col-12 mb-4" type="image" height="124" />
          <v-skeleton-loader v-for="i in 3" :key="i" class="col-4" type="image" />
        </div>
      </div>

      <div v-else-if="vm.poolStore.status === 'approved'">
        <others-header class="mb-8"></others-header>
        <others-content></others-content>
      </div>

      <div v-else>
        <voting-content></voting-content>
      </div>
    </div>
    <cancel-dialog />
    <withdraw-dialog />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import { ProjectDetailViewModel } from '../viewmodels/project-detail-viewmodel'
import { get } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'others-header': () => import('../components/project-detail-components/project-others/header.vue'),
    'others-content': () => import('../components/project-detail-components/project-others/content.vue'),
    'voting-content': () => import('../components/project-detail-components/project-votings/content.vue'),
    'cancel-dialog': () => import('../components/project-detail-components/dialogs/cancel-dialog.vue'),
    'withdraw-dialog': () => import('../components/project-detail-components/dialogs/withdraw-dialog.vue'),
  },
})
export default class ProjectDetailPage extends Vue {
  @Provide() vm = new ProjectDetailViewModel(get(this.$route, 'params.code'))

  goToProjects() {
    this.$router.push(RoutePaths.project_list)
  }

  goToNewMission() {
    this.$router.push(RoutePaths.new_mission)
  }
}
</script>

<style scoped></style>
