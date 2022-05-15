<template>
  <v-sheet v-bind="$attrs" class="row align-center rounded">
    <div class="col-12 col-md-4">
      <div class="font-weight-bold">{{ props.address }}</div>
      <div>{{ props.badge }}</div>
    </div>
    <div class="col-12 col-md-4 d-flex align-center justify-space-around">
      <v-chip color="green">{{ props.hasVoted === 'yes' ? '👍YES' : '👎NO' }}</v-chip>
      <span class="font-weight-medium">
        {{ props.hasVoted === 'yes' ? 'We want to join in this project' : "We don't want to join this project" }}</span
      >
    </div>
    <div class="col-12 col-md-2 d-flex flex-column align-end text-subtitle-2">
      <span class="neutral10--text">Time voted</span>
      <span class="font-weight-bold">{{ props.votedAt }}</span>
    </div>
    <div class="col-12 col-md-2 d-flex justify-end">
      <v-sheet width="120" class="pa-4 rounded d-flex align-center justify-space-around" outlined>
        <span>{{ props.tribe }}</span>
        <v-icon large>mdi-fingerprint</v-icon>
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface Props {
  address?: string
  badge?: string
  hasVoted?: string
  votedAt?: string
  tribe?: string
}

const propsValue = (): Props => ({
  address: '0xcA41405fB87575...39Ce',
  badge: 'GLD Staker',
  hasVoted: 'yes',
  votedAt: '10/03/2022, 10:00 PM',
  tribe: 'PRO',
})

@Component
export default class VotingListItem extends Vue {
  @Prop({ default: propsValue }) props!: Props
}
</script>

<style scoped></style>
