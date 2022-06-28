<template>
  <v-sheet
    height="40"
    class="d-flex justify-center align-center rounded font-weight-600 text-subtitle-1"
    :class="statusReport.color"
    outlined
  >
    {{ statusReport.text }}
  </v-sheet>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../../viewmodels/voting-detail-viewmodel'

@Component
export default class VotingStatus extends Vue {
  @Inject() vm!: VotingDetailViewModel
  get statusReport() {
    if (this.vm.poolStore?.status === 'approved')
      return {
        color: 'green--text',
        text: 'Project is approved',
      }
    if (this.vm.poolStore?.status === 'cancelled')
      return {
        color: 'red--text',
        text: 'Project is cancelled',
      }
    if (this.vm.poolStore?.voteEnded)
      return {
        color: 'red--text',
        text: 'Project is ended',
      }
    return {
      color: 'grey--text',
      text: this.vm.poolStore?.status,
    }
  }
}
</script>

<style scoped></style>
