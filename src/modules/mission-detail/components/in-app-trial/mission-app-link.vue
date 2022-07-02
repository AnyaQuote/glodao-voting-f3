<template>
  <div></div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Observer
@Component
export default class MissionAppLink extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel
}
</script>

<style scoped></style>
