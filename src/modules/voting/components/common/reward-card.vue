<template>
  <v-sheet class="rounded-lg pa-6 neutral10--text font-weight-medium" elevation="3">
    <div>Total reward</div>
    <div class="d-flex align-center">
      <span class="text-h6 mr-2">{{ props.rewardAmount | formatNumber }} {{ props.tokenName }}</span>
      <icon-crypto-currency />
    </div>
    <div>{{ props.rewardExchange | usdCustom }}</div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface Props {
  rewardAmount?: string
  tokenName?: string
  rewardExchange?: string
  projectLogo?: string
}

const propsValue = (): Props => ({
  rewardAmount: '10000',
  rewardExchange: '1000',
  tokenName: 'TPB',
  projectLogo: '',
})

@Component({
  components: {
    'icon-crypto-currency': () => import('@/assets/icons/icon-crypto-currency.vue'),
  },
})
export default class RewardCard extends Vue {
  @Prop({ default: propsValue }) props!: Props
}
</script>

<style scoped></style>
