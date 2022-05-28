<template>
  <v-sheet v-bind="$attrs" class="row align-center rounded pa-4" elevation="3">
    <div class="col-12 col-md-4 d-flex flex-row flex-md-column justify-space-between align-center align-md-start">
      <div class="font-weight-bold order-last order-md-first">{{ address | shortAddress(12, 6) }}</div>
      <div>GLD Staker</div>
    </div>
    <div class="col-12 col-md-4 d-flex flex-row justify-space-between justify-md-start align-center">
      <v-chip color="green mr-2">👍YES</v-chip>
      <span class="font-weight-medium"> We want to join in this project </span>
    </div>
    <div class="col-12 col-md-4 d-flex flex-row flex-md-column align-md-end justify-space-between text-subtitle-2">
      <span class="neutral10--text">Time voted</span>
      <span class="font-weight-bold">---</span>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class VotingListItem extends Vue {
  @Prop({ required: true }) address!: string
}
</script>

<style scoped></style>
