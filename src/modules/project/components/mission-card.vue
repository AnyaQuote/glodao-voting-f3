<template>
  <v-sheet class="rounded-lg" elevation="1" outlined>
    <div>
      <v-img class="rounded-t-lg" :src="require(`@/assets/images/${image}`)" width=""></v-img>
    </div>
    <div class="pa-6">
      <div class="text-h5 font-weight-bold mb-2">{{ name }} {{ index && `#${index}` }}</div>
      <div class="text-subtitle-1">
        <div class="d-flex justify-space-between mb-2">
          <div class="neutral10--text">Total reward</div>
          <div class="font-weight-600">{{ totalReward }}</div>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <div class="neutral10--text">Priority reward</div>
          <div class="font-weight-600">{{ priorityReward }}</div>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <div class="neutral10--text">Start time</div>
          <div class="font-weight-600">{{ start }}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="neutral10--text">End time</div>
          <div class="font-weight-600">{{ end }}</div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Observer
@Component
export default class MissionCard extends Vue {
  @Prop({ required: true }) name!: string
  @Prop({ required: true }) image!: string
  @Prop({ required: true }) totalReward!: string
  @Prop({ required: true }) priorityReward!: string
  @Prop({ required: true }) start!: string
  @Prop({ required: true }) end!: string
  @Prop({ required: true }) index!: string
}
</script>

<style scoped></style>
