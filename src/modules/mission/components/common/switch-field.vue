<template>
  <v-sheet class="d-flex flex-column transparent--bg rounded-lg" outlined>
    <div class="row ma-0">
      <div v-if="$vuetify.breakpoint.smAndUp" class="col-2 d-flex align-center justify-center">
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
      <div class="col-9 col-sm-8 d-flex flex-column flex-md-row align-md-center justify-center justify-md-start">
        <div class="font-weight-bold text-subtitle-1 mr-4">{{ title }}</div>
        <span class="text-subtitle-1 font-weight-regular" :class="$vuetify.breakpoint.mdAndUp && 'bullet'">{{
          subtitle
        }}</span>
      </div>
      <div class="col-3 col-sm-2 d-flex justify-center">
        <v-switch :readonly="readonly" color="blue-diversity" :input-value="show" @change="onChange" />
      </div>
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
import { Observer } from 'mobx-vue'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Observer
@Component
export default class SwitchField extends Vue {
  @Prop({ default: false }) value!: boolean
  @Prop({ required: true }) type!: string
  @Prop({ default: '' }) title!: string
  @Prop({ default: '' }) subtitle!: string
  @Prop(Boolean) readonly!: boolean

  show = this.value

  onChange(value: boolean) {
    this.show = !!value
    this.$emit('change', !!value)
  }

  get hasSlot() {
    return this.$slots.default
  }
}
</script>

<style lang="scss" scoped></style>
