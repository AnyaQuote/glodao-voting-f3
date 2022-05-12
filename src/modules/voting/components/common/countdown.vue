<template>
  <v-sheet class="countdown d-flex justify-space-between align-center rounded-lg px-3 py-1 neutral100--bg">
    <slot name="prepend"></slot>
    <div class="countdown-number text-center">
      <span class="font-weight-bold">{{ days | twoDigits }}</span>
    </div>
    <div class="countdown-divider">:</div>
    <div class="countdown-number text-center">
      <div class="font-weight-bold">{{ hours | twoDigits }}</div>
    </div>
    <div class="countdown-divider">:</div>
    <div class="countdown-number text-center">
      <div class="font-weight-bold">{{ minutes | twoDigits }}</div>
    </div>
    <div class="countdown-divider">:</div>
    <div class="countdown-number text-center">
      <div class="font-weight-bold">{{ seconds | twoDigits }}</div>
    </div>
    <slot name="append">
      <div class="px-3 mr-n1 text-center">left</div>
      <span>🔥</span>
    </slot>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Countdown extends Vue {
  @Prop() to!: string

  now = 0
  intervalId = 0

  mounted() {
    this.intervalId = window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  }

  beforeDestroy() {
    clearInterval(this.intervalId)
  }

  get dateInMilliSeconds() {
    return !this.to ? 0 : Math.trunc(Date.parse(this.to) / 1000)
  }

  get days() {
    return Math.trunc((this.dateInMilliSeconds - this.now) / 60 / 60 / 24)
  }

  get hours() {
    return Math.trunc((this.dateInMilliSeconds - this.now) / 3600) % 24
  }

  get minutes() {
    return Math.trunc((this.dateInMilliSeconds - this.now) / 60) % 60
  }

  get seconds() {
    return (this.dateInMilliSeconds - this.now) % 60
  }
}
</script>

<style lang="scss" scoped>
.countdown {
  .countdown-number {
    flex: 1;
  }
  .countdown-divider {
    flex-shrink: 0;
  }
}
</style>
