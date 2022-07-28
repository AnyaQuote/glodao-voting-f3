<template>
  <v-sheet class="d-flex flex-column transparent--bg rounded-lg" outlined>
    <div class="d-flex pa-4 align-center">
      <div class="d-none d-sm-flex align-center mr-4">
        <slot name="icon">
          <img v-if="type === 'twitter'" width="48" height="48" contain :src="require('@/assets/icons/twitter.svg')" />
          <img
            v-else-if="type === 'telegram'"
            width="48"
            height="48"
            contain
            :src="require('@/assets/icons/telegram.svg')"
          />
          <v-icon v-else-if="type === 'facebook'" v-html="'fab fa-facebook'" size="48" color="app-blue" />
          <v-icon v-else-if="type === 'other'" size="48" color="blue-diversity">mdi-checkbox-marked-circle</v-icon>
          <img v-else width="48" height="48" contain :src="require('@/assets/icons/learn-to-earn.svg')" />
        </slot>
      </div>
      <div class="d-flex flex-grow-1 flex-column flex-md-row align-md-center justify-center justify-md-start">
        <div class="font-weight-bold text-subtitle-1">{{ title }}</div>
        <v-sheet width="6" height="6" rounded="circle" class="d-none d-md-block mx-4 neutral-10" />
        <span class="text-subtitle-1 font-weight-regular">{{ subtitle }}</span>
      </div>
      <v-btn icon @click="toggleExpand">
        <v-icon v-html="expandIcon" />
      </v-btn>
      <v-btn icon @click="onDelete">
        <v-icon size="20">mdi-close</v-icon>
      </v-btn>
    </div>
    <div v-if="show && hasSlot">
      <v-divider class="my-2 mx-6" />
      <div class="px-5 py-6">
        <slot></slot>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { Observer } from 'mobx-vue'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Observer
@Component
export default class ExpandContainer extends Vue {
  @Prop({ required: true }) type!: string
  @Prop({ default: EMPTY_STRING }) title!: string
  @Prop({ default: EMPTY_STRING }) subtitle!: string
  @Prop() deleteCallback?: () => void

  show = true

  toggleExpand() {
    this.show = !this.show
  }

  onDelete() {
    this.deleteCallback?.()
  }

  get hasSlot() {
    return this.$slots.default
  }

  get expandIcon() {
    return this.show ? 'mdi-minus' : 'mdi-crop-square'
  }
}
</script>

<style lang="scss" scoped></style>
