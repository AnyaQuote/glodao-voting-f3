<template>
  <v-row dense no-gutters>
    <v-col cols="12" sm="8" class="text-center text-sm-start pr-md-4 mb-16 mb-md-0">
      <div class="text-h5 text-md-h3 font-weight-bold neutral-0--text mb-6 mb-md-9">Create the first application</div>
      <div class="text-subtitle-2 text-md-h6 neutral-10--text mb-6 mb-md-9">
        Your interested projects should create a profile using this website, create and submit an application. GloDAO
        investors will review and vote for your project on Voting. If your project has enough votes, it will be launched
        on Bounty Hunter or Launchpad.
      </div>
      <connect-metamask
        :requiredChain="'bsc'"
        :requiredChainId="97"
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
    </v-col>
    <v-col cols="12" sm="4" class="d-flex justify-center align-center">
      <v-img
        :max-height="!$vuetify.breakpoint.mdAndUp ? '251' : '324'"
        :max-width="!$vuetify.breakpoint.mdAndUp ? '251' : '324'"
        src="@/assets/images/project/image-1.png"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { RoutePaths } from '@/router'
import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  wallet = walletStore

  goToNewProject() {
    this.$router.push(RoutePaths.new_application)
  }
}
</script>

<style scoped></style>
