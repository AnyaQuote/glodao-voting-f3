<template>
  <div
    v-if="!$vuetify.breakpoint.mdAndUp"
    class="d-flex justify-space-between align-center py-6 px-4 mx-auto"
    :class="$vuetify.breakpoint.xs && 'container-custom'"
  >
    <div class="text-h5 neutral-0--text font-weight-black">Your project</div>
    <div v-if="vm.votingPools.length">
      <!-- <connect-wallet v-if="!walletStore.account" :height="37" btnClass="font-weight-bold" /> -->
      <connect-metamask
        :height="!$vuetify.breakpoint.mdAndUp ? '37' : '55'"
        :btnClass="`font-18 font-weight-bold ${$vuetify.breakpoint.mdAndUp ? 'font-18' : 'text-subtitle-1'}`"
      >
        <v-btn
          :height="!$vuetify.breakpoint.mdAndUp ? '37' : '55'"
          elevation="0"
          class="linear-blue--bg white--text font-weight-bold text-none"
          :class="$vuetify.breakpoint.mdAndUp && 'font-18'"
          @click="goToNewProject()"
        >
          New application
        </v-btn>
      </connect-metamask>
    </div>
  </div>
  <v-img v-else height="216" src="@/assets/images/project/banner.png">
    <v-container class="fill-height pb-12 d-flex justify-space-between align-end">
      <div class="font-weight-600 white--text text-h3">Your project</div>
      <div v-if="vm.votingPools.length">
        <!-- <connect-wallet v-if="!walletStore.account" btnClass="font-18 font-weight-bold" /> -->
        <connect-metamask
          :height="!$vuetify.breakpoint.mdAndUp ? '37' : '55'"
          :btnClass="`font-18 font-weight-bold ${$vuetify.breakpoint.mdAndUp ? 'font-18' : 'text-subtitle-1'}`"
        >
          <v-btn
            :height="!$vuetify.breakpoint.mdAndUp ? '37' : '55'"
            elevation="0"
            class="linear-blue--bg white--text font-weight-bold text-none"
            :class="$vuetify.breakpoint.mdAndUp && 'font-18'"
            @click="goToNewProject()"
          >
            New application
          </v-btn>
        </connect-metamask>
        <!-- <v-btn v-else class="linear-blue--bg" height="55" depressed @click="goToNewProject()">
          <span class="white--text font-weight-bold font-18">New application</span>
        </v-btn> -->
      </div>
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
@Component({
  components: {},
})
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
.container-custom {
  padding: 0 16px;
  max-width: 392px;
}
</style>
