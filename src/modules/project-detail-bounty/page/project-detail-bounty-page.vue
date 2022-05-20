<template>
  <v-container>
    <bounty-detail />
    <v-row>
      <v-col cols="4" v-for="(project, index) in vm.projects" :key="index">
        <project-card :project="project" :index="index + 1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue } from 'vue-property-decorator'
import { ProjectDetailBountyViewModel } from '../viewmodel/project-detail-bounty-viewmodel'

@Observer
@Component({
  components: {
    'bounty-detail': () => import('../components/bounty-detail.vue'),
    'project-card': () => import('../components/project-card.vue'),
  },
})
export default class ProjectDetailBounty extends Vue {
  @Provide() vm = new ProjectDetailBountyViewModel()
}
</script>

<style scoped></style>
