<template>
  <v-btn
    class="d-flex align-center nav-btn-text border-radius-8 text-none py-2 px-3 transparent-bg"
    v-if="!walletStore.connected"
    @click="walletStore.connect()"
    :large="large"
    :block="block"
    :small="small"
    depressed
    outlined
  >
    Connect Wallet
  </v-btn>
  <v-btn
    depressed
    rounded
    color="primary"
    :large="large"
    :block="block"
    :small="small"
    v-else-if="walletStore.chainId + '' !== Number(this.requiredChainId).toString()"
    @click="walletStore.switchNetwork(+requiredChainId)"
  >
    Switch to {{ networkName }}
  </v-btn>
  <div v-else>
    <slot />
  </div>
</template>

<script lang="ts">
import { blockchainHandler } from '@/blockchain'
import { walletStore } from '@/stores/wallet-store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ConnectMetamask extends Vue {
  @Prop() requiredChainId!: string
  @Prop({ default: false }) block!: boolean
  @Prop({ default: false }) large!: boolean
  @Prop({ default: false }) small!: boolean

  walletStore = walletStore

  get networkName() {
    const { name } = blockchainHandler.getChainConfig(this.requiredChainId)
    return name
  }
}
</script>

<style scoped></style>
