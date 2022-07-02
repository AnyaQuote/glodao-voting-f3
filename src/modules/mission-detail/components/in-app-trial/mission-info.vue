<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Component
export default class InAppTrialMissionInfo extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel
}
</script>

<style scoped></style>
