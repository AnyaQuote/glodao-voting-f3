<template>
<div></div>
</template>

<script lang="ts">
// import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'
import { Component, Prop, Provide, Vue } from 'vue-property-decorator'
import { AppProvider, appProvider } from '../app-providers'
import { alertController } from './alert/alert-controller'

@Observer
@Component({
  components: {
    'address-copy-board': () => import('@/components/address-copy-board.vue'),
  },
})
export default class extends Vue {
  @Provide() providers: AppProvider = appProvider
  // @Provide() walletStore = walletStore
  private readonly SOLLET_WALLET_NAME = 'Sollet'
  @Prop({ default: '' }) btnClass?: string

  copyAddress() {
    // navigator.clipboard.writeText(this.walletStore?.account || '')
  }

  connectSolana(wallet) {
    // if (wallet === walletStore.selectedWallet) {
    //   walletStore.disconnectSolana()
    // } else if (wallet.name === this.SOLLET_WALLET_NAME) {
    //   alertController
    //     .confirm(
    //       'Warning',
    //       'The Sollet wallet sometime encounter error when register for whitelist. Are you sure you want to use this wallet?',
    //       'Continue',
    //       'Cancel'
    //     )
    //     .then((confirm) => {
    //       if (confirm) walletStore.connectSolana(wallet)
    //     })
    // } else walletStore.connectSolana(wallet)
  }
}
</script>

<style scoped lang="scss">
.address-container {
  border-radius: 4px;
  border: 1px solid var(--v-primary-base);
  padding: 4px 14px;
}
.wallet-card {
  cursor: pointer;
  border-radius: 8px;
}
.wallet-card:hover {
  background: var(--v-primary-base) !important;
}
</style>
