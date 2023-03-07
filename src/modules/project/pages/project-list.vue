<template>
  <div>
    <project-list-banner />
    <general-information />
  </div>
</template>

<script lang="ts">
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { ProjectListViewModel } from '../viewmodels/project-list-viewmodel'

@Observer
@Component({
  components: {
    'project-list-banner': () => import('../components/project-list-components/project-list-banner.vue'),
    'empty-list': () => import('../components/project-list-components/empty-project.vue'),
    'project-card': () => import('../components/project-list-components/project-card.vue'),
    'general-information': () => import('@/modules/new-mission/general-information/general-information.vue'),
    'social-page': () => import('@/modules/new-mission/social-mission-form/new-social-page.vue'),
  },
})
export default class ProjectListPage extends Vue {
  @Provide() vm = new ProjectListViewModel()

  goToNewProject() {
    this.$router.push(RoutePaths.new_application)
  }

  get activeClass() {
    return (activeValue: string) =>
      this.vm.filterType === activeValue ? 'blue-diversity neutral-100--text' : 'blue-2 neutral-10--text'
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';

.spacing {
  max-width: 360px;
  @include breakpoint(tablet) {
    max-width: inherit;
  }
  @include breakpoint(desktop) {
    max-width: 1122px;
  }
}

.tab-item {
  height: 37px;
  width: 50%;

  @include breakpoint(desktop) {
    height: 50px;
    width: 241px;
  }
}

.spacing-card {
  display: grid;
  gap: 24px;

  @include breakpoint(tablet) {
    //
  }
}

.mt-98 {
  margin-top: 98px;
}
</style>
