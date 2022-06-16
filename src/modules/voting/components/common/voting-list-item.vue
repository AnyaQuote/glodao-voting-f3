<template>
  <v-sheet class="row no-gutters mb-2 align-center rounded pa-4" elevation="3">
    <div class="col-12 col-md-6 d-flex flex-row flex-md-column justify-space-between align-center align-md-start">
      <div class="font-weight-bold order-last order-md-first">{{ prop.address }}</div>
      <div>GLD Staker</div>
    </div>
    <div
      v-if="prop.voted === 'yes'"
      class="col-12 col-md-6 d-flex flex-row justify-space-between justify-md-end align-center"
    >
      <span class="font-weight-medium mr-4"> We want to join in this project </span>
      <v-chip color="green " class="white--text">👍 YES</v-chip>
    </div>
    <div v-else class="col-12 col-md-6 d-flex flex-row justify-space-between justify-md-end align-center">
      <span class="font-weight-medium mr-4"> We do not want to join in this project </span>
      <v-chip color="red" class="white--text">👎 NO</v-chip>
    </div>
    <!-- <div class="col-12 col-md-4 d-flex flex-row flex-md-column align-md-end justify-space-between text-subtitle-2">
      <span class="neutral10--text">Time voted</span>
      <span class="font-weight-bold">{{ prop.time }}</span>
    </div> -->
  </v-sheet>
</template>

<script lang="ts">
import { Voter } from '@/models/VotingModel'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class VotingListItem extends Vue {
  @Prop({ required: true }) prop!: Voter
}
</script>

<style scoped></style>
