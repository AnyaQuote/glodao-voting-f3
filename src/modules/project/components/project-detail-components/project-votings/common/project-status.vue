<template>
  <div
    style="height: 40px"
    class="rounded app-blue--text text--lighten-1 font-weight-medium d-flex align-center justify-center text-subtitle-1"
    :class="statusReport.color"
  >
    {{ statusReport.text }}
  </div>
</template>

<script lang="ts">
import { PoolStore } from '@/stores/pool-store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ProjectStatus extends Vue {
  @Prop({ required: true }) pool!: PoolStore
  get statusReport() {
    if (this.pool.onVoting)
      return {
        color: 'app-blue',
        text: 'Your project is opening for vote',
      }
    if (this.pool.status === 'approved')
      return {
        color: 'app-green lighten-1',
        text: 'Project is approved',
      }
    if (this.pool.status === 'cancelled')
      return {
        color: 'app-red',
        text: 'Project is cancelled',
      }
    if (this.pool.voteEnded)
      return {
        color: 'app-red',
        text: 'Project is ended',
      }

    return {
      color: 'app-grey',
      text: this.pool.status,
    }
  }
}
</script>

<style scoped></style>
