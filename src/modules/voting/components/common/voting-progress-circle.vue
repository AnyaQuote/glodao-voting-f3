<template>
  <v-progress-circular v-bind="$attrs" v-on="$listeners" :value="value" :size="size" :width="width" :rotate="rotate">
    <slot>
      <span :class="contentClass">{{ value }}%</span>
    </slot>
  </v-progress-circular>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class VotingProgressCircle extends Vue {
  @Prop(String) value!: string
  @Prop({ default: 'text-h5 white--text' }) contentClass!: string
  @Prop({ default: '120' }) size!: string
  @Prop({ default: '4' }) width!: string
  @Prop({ default: '270' }) rotate!: string
}
</script>

<style scoped></style>
