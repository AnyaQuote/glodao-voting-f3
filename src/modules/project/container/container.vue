<template>
  <div>
    <v-img v-show="showBanner" class="blue mb-12" height="216" src="@/assets/images/project/banner.png">
      <v-sheet class="transparent--bg px-4 pb-12 text-h3 fill-height d-flex align-end mx-auto" max-width="1090">
        <span class="font-weight-bold white--text flex-grow-1">Your project</span>
        <v-btn class="linear-blue--bg text-none px-6 flex-shrink-0" height="55" depressed @click="goToNewProject">
          <span class="white--text font-weight-bold font-18">New application</span></v-btn
        >
      </v-sheet>
    </v-img>
    <v-container class="mb-15">
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script lang="ts">
import { RoutePaths } from '@/router'
import { Component, Vue, Provide } from 'vue-property-decorator'
import { ProjectDetailViewModel } from '../viewmodels/project-detail-viewmodel'
import { ProjectListViewModel } from '../viewmodels/project-list-viewmodel'

@Component
export default class Container extends Vue {
  @Provide('project-list-vm') projectListVM = new ProjectListViewModel()

  goToNewProject() {
    this.$router.push(RoutePaths.new_application)
  }

  get showBanner() {
    return this.$route.name === 'project-list'
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';
.custom-left-margin {
  margin-left: 20px;
  @include breakpoint(desktop) {
    transform: translate(40%);
  }
}
</style>
