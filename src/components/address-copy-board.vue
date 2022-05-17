<template>
  <div class="container-frame d-flex align-center" :class="alignRight ? 'text-right' : ''" @mouseleave="onMouseLeave">
    <div v-if="isVisibleValue && !isShortAddress">{{ this.address }}</div>
    <div v-else-if="isVisibleValue">
      {{ this.address | shortAddress(shortStartAmount, shortEndAmount) }}
    </div>
    <v-tooltip bottom style="display: inline-block !important" v-if="$vuetify.breakpoint.smAndUp">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          :color="iconColor ? iconColor : $vuetify.theme.dark ? 'white' : 'grey'"
          v-bind="attrs"
          v-on="on"
          :size="iconSize"
          class="ml-2"
          @click.stop="copyAddressDesktop"
          :class="`tooltipElement${index}`"
          >mdi-content-copy</v-icon
        >
      </template>
      <span>{{ isCopied ? 'Copied ' : $vuetify.breakpoint.smAndUp ? 'Copy Address' : '' }}</span>
    </v-tooltip>
    <v-tooltip bottom style="display: inline-block !important" v-else>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          :color="iconColor ? iconColor : $vuetify.theme.dark ? 'white' : 'grey'"
          v-bind="attrs"
          v-on="on"
          :size="iconSize"
          class="ml-2"
          @click.stop="copyAddressMobile"
          :class="`tooltipElement${index}`"
          >mdi-content-copy</v-icon
        >
      </template>
      <span>{{ isCopied ? 'Copied ' : $vuetify.breakpoint.smAndUp ? 'Copy Address' : '' }}</span>
    </v-tooltip>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'
import { promiseHelper } from '@/helpers/promise-helper'

@Observer
@Component
export default class extends Vue {
  @Prop({ default: 'TBA' }) address
  @Prop({ default: false }) alignRight
  @Prop({ default: 14 }) iconSize
  @Prop({ default: '' }) iconColor
  @Prop({ default: false }) isShortAddress
  @Prop({ default: 6 }) shortStartAmount
  @Prop({ default: 10 }) shortEndAmount
  @Prop({ default: 0 }) index
  @Prop({ default: true }) isVisibleValue
  isCopied = false
  mouseoverEvent = new Event('mouseleave')
  async copyAddressMobile() {
    navigator.clipboard.writeText(this.address)
    this.isCopied = true
    await promiseHelper.delay(3000)
    if (this.tooltipElement) this.tooltipElement.dispatchEvent(this.mouseoverEvent)
    this.isCopied = false
  }
  async copyAddressDesktop() {
    navigator.clipboard.writeText(this.address)
    this.isCopied = true
    await promiseHelper.delay(3000)
    this.isCopied = false
  }
  onMouseLeave() {
    this.isCopied = false
  }
  tooltipElement
  mounted() {
    const tooltipElements = document.getElementsByClassName(`tooltipElement${this.index}`) || []
    this.tooltipElement = tooltipElements.length > 0 ? tooltipElements[0] : null
  }
}
</script>
<style scoped>
.container-frame {
  cursor: pointer;
  word-break: break-all;
}
</style>
