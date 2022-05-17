<template>
  <div @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" style="cursor: pointer">
    {{ this.shortAccount }}
    <v-tooltip bottom v-if="isVisibleCopy">
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on" @click="copyAddress" small class="ml-2">mdi-content-copy</v-icon>
      </template>
      <span>Copy Address</span>
    </v-tooltip>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'

@Observer
@Component
export default class extends Vue {
  @Prop({ default: 'TBA' }) address
  @Prop({ default: 5 }) startLength
  @Prop({ default: 5 }) endLength

  isVisibleCopy = false
  get shortAccount() {
    return (
      this.address &&
      this.address !== 'TBA' &&
      this.address.substr(0, this.startLength) + '...' + this.address.substr(this.address.length - this.endLength)
    )
  }
  copyAddress() {
    navigator.clipboard.writeText(this.address)
  }
  onMouseEnter() {
    this.isVisibleCopy = true
  }
  onMouseLeave() {
    this.isVisibleCopy = false
  }
}
</script>
<style scoped></style>
