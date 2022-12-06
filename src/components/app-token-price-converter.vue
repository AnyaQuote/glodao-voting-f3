<template>
  <div>
    <div class="text-h6 font-weight-bold blue-diversity--text mb-2">Token base price</div>
    <div class="d-flex flex-column flex-sm-row">
      <div class="flex-grow text-subtitle-2">
        <v-icon class="mr-1" v-html="messageIcon" />
        <span>{{ message }}</span>
      </div>
      <div class="mx-sm-3 my-2 my-sm-0" />
      <app-text-field
        class="flex-grow"
        :value="tokenBasePrice"
        :loading="loading"
        :readonly="loading"
        :disabled="disable"
        @change="onChange"
        placeholder="(ex: 1.0)"
        :rules="[$rules.required, $rules.floatNumberOnly]"
        append-icon="mdi-currency-usd"
      />
    </div>
    <div class="text-caption">
      *We will be using <strong>pancake swap</strong> to find your token base price. This base price you input at the
      moment will be use to calculate and display bounty reward.
    </div>
  </div>
</template>

<script lang="ts">
import { AppProvider } from '@/app-providers'
import {
  EMPTY_STRING,
  MSG_FETCHING_TOKEN_BASE_PRICE,
  MSG_TOKEN_CONTRACT_ADDRS_CAN_NOT_BE_CONVERTED,
  MSG_TOKEN_CONTRACT_ADDRS_NOT_AVAILABLE,
} from '@/constants'
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class AppTokenBasePriceConverter extends Vue {
  @Inject() providers!: AppProvider
  @Prop({ default: EMPTY_STRING }) value!: string
  @Prop({ default: EMPTY_STRING }) tokenAddress!: string
  @Prop({ default: EMPTY_STRING }) tokenName!: string

  private api = this.providers.api

  message = EMPTY_STRING
  tokenBasePrice = EMPTY_STRING
  messageIcon = 'mdi-alert-circle'
  loading = false
  disable = false

  mounted() {
    if (!this.tokenAddress) {
      this.message = MSG_TOKEN_CONTRACT_ADDRS_NOT_AVAILABLE
      if (this.value) this.tokenBasePrice = this.value
    } else this.fetchPrice()
  }

  async fetchPrice() {
    try {
      this.loading = true
      this.message = MSG_FETCHING_TOKEN_BASE_PRICE
      const { price } = await this.api.getTokenPrice(this.tokenAddress)
      this.tokenBasePrice = price._value
      this.message = `Your token ${this.tokenName} base price is:`
      this.messageIcon = 'mdi-check-circle'
      this.disable = true
    } catch (error) {
      this.message = MSG_TOKEN_CONTRACT_ADDRS_CAN_NOT_BE_CONVERTED
      if (this.value) this.tokenBasePrice = this.value
    } finally {
      this.loading = false
    }
  }

  onChange(value: string) {
    this.tokenBasePrice = value
  }

  @Watch('tokenBasePrice')
  onPriceChange(value) {
    this.$emit('change', value)
  }
}
</script>

<style scoped></style>
