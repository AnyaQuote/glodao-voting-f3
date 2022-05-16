<template>
  <v-sheet color=" d-flex flex-column rounded-lg neutral100--bg" outlined>
    <v-sheet height="8" class="rounded-lg rounded-b-0" :class="flagColor"></v-sheet>
    <div class="d-flex align-center pa-6 blue lighten-1 flex-shrink-0">
      <v-sheet width="76" height="76" class="mr-4">
        <v-img contain aspect-ratio="1" src="@/assets/icons/voting-trending--logo.svg" />
      </v-sheet>
      <div class="d-flex flex-column justify-space-between flex-grow-1">
        <span class="text-h6 font-color-black">{{ props.projectName }}</span>
        <span class="neutral10--text">{{ props.amount | usdCustom }} {{ props.tokenName }}</span>
      </div>
      <div class="flex-shrink-0 align-self-start">
        <v-chip :color="flagColor" label class="text-capitalize">{{ props.type }}</v-chip>
      </div>
    </div>
    <div class="d-flex justify-space-between pa-6">
      <span>Voting time:</span>
      <span class="font-weight-bold">{{ props.startTime | ddmmyyyyhhmm }}</span>
      <span> - </span>
      <span class="font-weight-bold">{{ props.endTime | ddmmyyyyhhmm }}</span>
    </div>
    <div class="d-flex align-center justify-space-between px-6 pb-6">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-radiobox-marked</v-icon>
        <span class="bluePrimary--text font-weight-medium">Project is voting</span>
      </div>
      <div>
        <span class="bluePrimary--text font-weight-medium">View detail</span>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface Props {
  projectName: string
  type: string
  amount: string
  tokenName: string
  startTime: string
  endTime: string
  status: string
}

const defaultProps = (): Props => ({
  projectName: 'Dragon Gaming',
  type: 'launchpad',
  amount: '1000',
  tokenName: 'SB',
  startTime: '2022-05-16T00:03:39Z',
  endTime: '2022-05-16T00:03:39Z',
  status: 'voting',
})

@Component
export default class RegistCard extends Vue {
  @Prop({ default: defaultProps }) props!: Props
  flagColor = this.props.type === 'launchpad' ? 'green' : 'orange'
}
</script>

<style scoped></style>
