<template>
  <div></div>
</template>

<script lang="ts">
// import { blockchainHandler, ChainType } from '@/blockchainHandlers'
// import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class ConnectMetamask extends Vue {
  // @Prop() requiredChain!: ChainType
  @Prop() requiredChainId!: number
  @Prop({ default: '' }) connectText!: string
  @Prop({ default: '' }) switchText!: string
  @Prop({ default: false }) block!: boolean
  @Prop({ default: false }) large!: boolean
  @Prop({ default: false }) small!: boolean
  @Prop({ default: false }) smallText!: boolean
  @Prop({ default: '' }) applyClass!: string
  @Prop({ default: false }) disabled!: boolean

  // walletStore = walletStore

  get networkName() {
    // const { name } = blockchainHandler.getChainConfig(this.requiredChainId)
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
