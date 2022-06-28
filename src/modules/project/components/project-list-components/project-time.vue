<template>
  <div v-if="pool.status === 'approved'">
    <div>
      <span class="neutral-10--text font-weight-medium">Project start: </span>
      <span class="font-weight-600">{{ $_get(pool, 'startDate') | ddmmyyyyhhmma }}</span>
    </div>
    <div>
      <span class="neutral-10--text font-weight-medium">Project end: </span>
      <span class="font-weight-600">{{ $_get(pool, 'endDate') | ddmmyyyyhhmma }}</span>
    </div>
  </div>
  <div v-else>
    <div>
      <span class="neutral-10--text font-weight-medium">Voting start: </span>
      <span class="font-weight-600">{{ $_get(pool, 'votingStart') | ddmmyyyyhhmma }}</span>
    </div>
    <div>
      <span class="neutral-10--text font-weight-medium">Voting end: </span>
      <span class="font-weight-600">{{ $_get(pool, 'votingEnd') | ddmmyyyyhhmma }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { PoolStore } from '@/stores/pool-store'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ProjectTime extends Vue {
  @Prop({ required: true }) pool!: PoolStore
}
</script>

<style scoped></style>
