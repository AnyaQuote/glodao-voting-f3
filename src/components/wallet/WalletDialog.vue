<template>
  <v-card class="elevation-0 page-bg border-radius-8 pa-6" min-width="342px">
    <div>
      <div class="content-title font-weight-bold">
        {{ wallet.account | truncateAddress(10, 6) }}
      </div>
      <!-- <div class="mt-2">You are qualified to summon a monster</div> -->
    </div>
    <v-divider class="mt-6"></v-divider>
    <div class="d-flex align-center py-3">
      <div class="ml-4">
        <div class="subtitle--text">Z9 Balance</div>
        <div class="font-weight-bold">{{ wallet.z9Balance | formatNumber(2) }} Z9</div>
      </div>
      <v-spacer></v-spacer>
    </div>
    <div class="d-flex align-center py-3">
      <!-- <v-img :src="require('@/assets/bsc-logo.png')" max-width="36px"></v-img> -->
      <div class="ml-4">
        <div class="subtitle--text">BNB Balance</div>
        <div class="font-weight-bold">{{ wallet.bnbBalance | formatNumber(6) }} BNB</div>
      </div>
    </div>
    <v-divider></v-divider>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    ConnectMetamask: () => import('@/components/wallet/ConnectMetamask.vue'),
    WalletDialog: () => import('@/components/wallet/WalletDialog.vue')
  }
})
export default class Staking extends Vue {
  wallet = walletStore
  openLink(url) {
    window.open(url, '_blank')
  }
}
</script>
