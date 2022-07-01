<template>
  <v-sheet outlined rounded="lg" elevation="3">
    <div class="text-center py-5 text-h6 font-weight-bold">New Mission</div>
    <v-divider />
    <div class="py-7 px-2 pl-sm-0 d-flex flex-column ml-5">
      <div
        v-for="(stepName, index) in data"
        class="d-flex text-h6 font-weight-bold mb-8 cursor-pointer"
        :class="{ 'neutral-0--text': index + 1 === currentStep, 'neutral-10--text': index + 1 !== currentStep }"
        @click="onStepClick(index + 1)"
        :key="index"
      >
        <v-sheet
          class="text-center"
          :class="{ 'blue-diversity white--text': index + 1 === currentStep }"
          width="35"
          height="35"
          outlined
          rounded="lg"
        >
          {{ index + 1 }}
        </v-sheet>
        <span class="ml-2 text-truncate">{{ stepName }}</span>
      </div>
      <!-- ------ -->
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'

@Observer
@Component
export default class MissionSteppers extends Vue {
  @Prop({ default: () => [] }) data!: string[]
  @Prop({ default: 0 }) currentStep!: number

  onStepClick(step: number) {
    this.$emit('onStepChange', step)
  }

  get activeClass() {
    return (index: number) => (index === this.currentStep ? 'neutral-0--text' : 'neutral-10--text')
  }
}
</script>

<style scoped></style>
