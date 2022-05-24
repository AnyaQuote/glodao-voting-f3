<template>
  <div class="d-flex flex-column section">
    <div class="title font-weight-bold bluePrimary--text">Reward information</div>
    <div class="d-flex mb-7">
      <div class="flex-grow-1">
        <span class="label">Reward Token</span>
        <app-select class="mr-4" placeholder="Choose token" />
      </div>
      <div class="flex-grow-1">
        <span class="label">Total reward</span>
        <app-text-field placeholder="Enter amount" />
      </div>
    </div>
    <div class="d-flex mb-7">
      <div class="flex-grow-1">
        <span class="label">Priority amount</span>
        <app-text-field class="mr-4" placeholder="Enter amount" />
      </div>
      <div class="flex-grow-1">
        <span class="label">Max participant in priority pool</span>
        <app-text-field placeholder="Enter participants" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component
export default class RewardInfoForm extends Vue {
  @Inject() vm!: NewMissionViewModel
}
</script>

<style scoped></style>
