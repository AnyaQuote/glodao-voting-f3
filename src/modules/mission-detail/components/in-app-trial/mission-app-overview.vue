<template>
  <v-tabs class="rounded-lg mt-7 outlined" color="blue-diversity" background-color="neutral-100">
    <v-tab>App Description</v-tab>
    <v-tab>App Screenshot</v-tab>
    <v-tab-item class="pa-6">
      <p>
        {{ vm.missionAppDescription }}
      </p>
    </v-tab-item>
    <v-tab-item class="pa-6">
      <v-slide-group center-active show-arrows>
        <v-slide-item v-for="(source, index) in vm.missionAppScreenshots" :key="index" class="ma-2">
          <v-sheet rounded="lg" width="186" height="330">
            <v-img width="100%" height="100%" contain :src="source" />
          </v-sheet>
        </v-slide-item>
      </v-slide-group>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Observer
@Component
export default class MissionAppOverview extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel
}
</script>

<style scoped>
.outlined {
  border: 1px solid var(--v-neutral-20-base);
}
</style>
