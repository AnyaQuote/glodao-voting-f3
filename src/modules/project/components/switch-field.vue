<template>
  <v-sheet v-bind="$attrs" class="d-flex flex-column transparent--bg rounded-lg" outlined>
    <div class="d-flex align-center pa-5">
      <img width="48" height="48" contain :src="require('@/assets/icons/twitter.svg')" />
      <div class="flex-grow-1 d-flex ml-5">
        <div class="font-weight-bold text-subtitle-1 mr-4">{{ title }}</div>
        <span class="bullet text-subtitle-1 font-weight-regular">{{ subtitle }}</span>
      </div>
      <v-switch color="bluePrimary" :value="value" @change="onChange" />
    </div>
    <div v-if="hasSlot" class="mx-5 dotted-border"></div>
    <div v-if="hasSlot" class="px-5 py-6">
      <slot></slot>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class SwitchField extends Vue {
  @Prop(Boolean) value!: boolean
  @Prop({ default: '' }) title!: string
  @Prop({ default: '' }) subtitle!: string

  onChange(value) {
    this.$emit('change', value)
  }

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
.dotted-border {
  border-width: 1px;
  border-color: var(--v-neutral20-base);
  border-style: dashed;
}
</style>
