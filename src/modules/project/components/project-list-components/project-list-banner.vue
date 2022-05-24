<template>
  <v-img class="app-blue mb-12" height="216" src="@/assets/images/project/banner.png">
    <v-sheet class="transparent--bg px-4 pb-12 text-h3 fill-height d-flex align-end mx-auto" max-width="1090">
      <span class="font-weight-bold white--text flex-grow-1">Your project</span>

      <div v-if="!walletStore.account">
        <ConnectWallet />
      </div>
      <v-btn
        v-else
        class="linear-blue--bg text-none px-6 flex-shrink-0"
        height="55"
        depressed
        @click="goToNewProject()"
      >
        <span class="white--text font-weight-bold font-18">New application</span>
      </v-btn>
    </v-sheet>
  </v-img>
</template>

<script lang="ts">
import { RoutePaths } from '@/router'
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    ConnectWallet: () => import('@/components/connect-wallet.vue'),
  },
})
export default class ProjectBanner extends Vue {
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
