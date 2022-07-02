<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Component
export default class MissionAppSetting extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel
}
</script>

<style scoped></style>
