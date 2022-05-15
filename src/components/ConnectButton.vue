<template>
  <div>
    <v-btn
      class="
        d-flex
        align-center
        connect-wallet
        border-radius-8
        text-none
        btn-text
        pa-5
        elevation-0
      "
      v-if="!walletStore.connected"
      @click="walletStore.connect()"
      color="primary"
      block
      depressed
    >
      <span class="white--text">Connect Wallet</span>
    </v-btn>
    <v-btn
      class="border-radius-8 pa-5"
      color="primary"
      v-else-if="!walletStore.isChainIdValid"
      @click="walletStore.switchNetwork(+requiredChainId)"
      block
    >
      <span class="white--text">Switch to {{ networkName }}</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide, Ref, Inject } from 'vue-property-decorator'
import { walletStore } from '@/stores/wallet-store'
import { blockchainHandler } from '@/blockchain'

@Observer
@Component({
  components: {}
})
export default class ConnectButton extends Vue {
  walletStore = walletStore
  requiredChainId = process.env.VUE_APP_CHAIN_ID

  get networkName() {
    const { name } = blockchainHandler.getChainConfig(this.requiredChainId)
    return name
  }
}
</script>
