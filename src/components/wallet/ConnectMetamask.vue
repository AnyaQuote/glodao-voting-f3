<template>
  <v-btn
    v-if="!walletStore.account"
    class="text-none btn-text linear-background-blue-main rounded white--text"
    :disabled="disabled"
    depressed
    rounded
    @click="walletStore.switchNetwork(chainType, +requiredChainId)"
    :block="block"
    :large="large"
    :small="small"
    :class="applyClass"
  >
    <span>{{ connectText || 'Connect Wallet' }}</span>
  </v-btn>
  <v-btn
    class="text-none btn-text rounded"
    :class="applyClass"
    :disabled="disabled"
    depressed
    rounded
    color="primary"
    v-else-if="walletStore.chainType !== chainType || walletStore.chainId !== +requiredChainId"
    @click="walletStore.switchNetwork(chainType, +requiredChainId)"
    :block="block"
    :large="large"
    :small="small"
  >
    <span :class="{ 'small-text font-weight-bold': smallText }">{{ switchText || 'Switch to ' + networkName }}</span>
  </v-btn>
  <div v-else>
    <slot />
  </div>
</template>

<script lang="ts">
import { blockchainHandler, ChainType } from '@/blockchainHandlers'
import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class ConnectMetamask extends Vue {
  @Prop() requiredChain!: ChainType
  @Prop() requiredChainId!: number
  @Prop({ default: '' }) connectText!: string
  @Prop({ default: '' }) switchText!: string
  @Prop({ default: false }) block!: boolean
  @Prop({ default: false }) large!: boolean
  @Prop({ default: false }) small!: boolean
  @Prop({ default: false }) smallText!: boolean
  @Prop({ default: '' }) applyClass!: string
  @Prop({ default: false }) disabled!: boolean

  walletStore = walletStore

  get networkName() {
    const { name } = blockchainHandler.getChainConfig(this.requiredChainId)
    return name
  }

  get chainType() {
    switch (+this.requiredChainId) {
      case 1:
      case 3:
        return 'eth'
      case 56:
      case 97:
        return 'bsc'
      case 101:
      case 103:
        return 'sol'
      default:
        return 'sol'
    }
  }
}
</script>

<style scoped>
.small-text {
  font-size: 13px !important;
}
</style>
