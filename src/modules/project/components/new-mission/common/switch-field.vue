<template>
  <v-sheet class="d-flex flex-column transparent--bg rounded-lg" outlined>
    <div class="d-flex align-center pa-5">
      <img width="48" height="48" contain :src="require('@/assets/icons/twitter.svg')" />
      <div class="flex-grow-1 d-flex ml-5">
        <div class="font-weight-bold text-subtitle-1 mr-4">{{ title }}</div>
        <span class="bullet text-subtitle-1 font-weight-regular">{{ subtitle }}</span>
      </div>
      <v-switch color="app-blue" v-model="show" />
    </div>
    <div v-if="show && hasSlot">
      <v-divider class="ma-5" />
      <div class="px-5 py-6">
        <slot :required="show"></slot>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Observer
@Component
export default class SwitchField extends Vue {
  @Prop({ default: '' }) title!: string
  @Prop({ default: '' }) subtitle!: string

  show = false

  get hasSlot() {
    return this.$slots.default
  }
}
</script>

<style lang="scss" scoped>
.bullet {
  display: list-item;
  list-style-type: disc;
  list-style-position: inside;
}
</style>
