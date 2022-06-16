<template>
  <div class="rounded-lg pa-4 pa-md-6 blue-2 elevation-3">
    <div class="d-flex align-stretch mb-6">
      <div class="neutral-100 pa-1 rounded-lg d-flex justify-center mr-6 project-logo">
        <img :src="$_get(vm.poolStore, 'projectLogo')" height="100%" />
      </div>
      <div class="spacer d-flex flex-column justify-center">
        <div
          class="text-h5 text-md-h4 font-weight-bold font-weight-bold mb-1 text-truncate"
          :style="!$vuetify.breakpoint.mdAndUp ? 'max-width: 210px' : ''"
        >
          {{ $_get(vm.poolStore, 'projectName') }}
        </div>
        <div class="text-h6 text-md-h5 font-weight-bold neutral-10--text">${{ $_get(vm.poolStore, 'tokenName') }}</div>
      </div>
      <div></div>
    </div>
    <div>
      <div class="d-flex justify-space-between justify-md-start mb-2">
        <span class="neutral-10--text mr-2">Voting start: </span>
        <span class="font-weight-bold">{{ $_get(vm.poolStore, 'votingStart') | ddmmyyyyhhmma }} </span>
      </div>
      <div class="d-flex justify-space-between justify-md-start">
        <span class="neutral-10--text mr-2">Voting end: </span>
        <span class="font-weight-bold">{{ $_get(vm.poolStore, 'votingEnd') | ddmmyyyyhhmma }} </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel
}
</script>

<style lang="scss" scoped>
@import '@/styles/breakpoint-custom.scss';
.project-logo {
  width: 76px;
  height: 76px;

  @include breakpoint(desktop) {
    width: 80px;
    height: 80px;
  }
}
</style>
