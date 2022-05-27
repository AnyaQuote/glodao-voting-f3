<template>
  <div v-if="!$vuetify.breakpoint.mdAndUp" class="d-flex justify-space-between align-center py-6 px-4">
    <div class="text-h5 neutral-0--text font-weight-black">Your project</div>
    <div v-if="!walletStore.account">
      <connect-wallet :height="37" btnClass="font-weight-bold" />
    </div>
    <v-btn
      v-else-if="vm.votingPools.length"
      height="37"
      class="linear-blue--bg white--text font-weight-bold"
      @click="goToNewProject()"
    >
      New application
    </v-btn>
  </div>
  <v-img v-else class="mb-12" height="216" src="@/assets/images/project/banner.png">
    <v-container class="fill-height pb-12 d-flex justify-space-between align-end">
      <div class="font-weight-600 white--text text-h3">Your project</div>
      <div v-if="!walletStore.account">
        <connect-wallet btnClass="font-18 font-weight-bold" />
      </div>
      <v-btn v-else class="linear-blue--bg px-6 flex-shrink-0" height="55" depressed @click="goToNewProject()">
        <span class="white--text font-weight-bold font-18">New application</span>
      </v-btn>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import { RoutePaths } from '@/router'
import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { ProjectListViewModel } from '../../viewmodels/project-list-viewmodel'

@Observer
@Component
export default class ProjectBanner extends Vue {
  @Inject() vm!: ProjectListViewModel
  walletStore = walletStore
  goToNewProject() {
    this.$router.push(RoutePaths.new_application)
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
