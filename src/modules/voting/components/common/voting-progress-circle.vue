<template>
  <v-progress-circular v-bind="$attrs" v-on="$listeners" :value="value" :size="size" :width="width" :rotate="rotate">
    <span class="text-h5 white--text">{{ value }}%</span>
  </v-progress-circular>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class VotingProgressCircle extends Vue {
  @Prop(String) value!: string
  @Prop({ default: '120' }) size!: string
  @Prop({ default: '6' }) width!: string
  @Prop({ default: '270' }) rotate!: string
}
</script>

<style scoped></style>
