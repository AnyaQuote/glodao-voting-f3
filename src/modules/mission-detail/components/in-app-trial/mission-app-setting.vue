<template>
  <div class="mt-7">
    <div class="text-h6 font-weight-bold">Mission setting</div>
    <v-sheet class="pa-6 mt-2" outlined rounded="lg">
      <div v-for="task in vm.missionTaskSetting" :key="task.step">
        <div class="d-flex align-center font-18">
          <v-sheet min-width="40" height="40" rounded="lg" class="blue-2 d-flex">
            <span class="ma-auto font-weight-bold">{{ task.step }}</span>
          </v-sheet>
          <div class="ml-4 flex-grow-1 font-weight-bold text-truncate">{{ task.context }}</div>
          <span class="d-none d-sm-block font-weight-medium blue-diversity--text text-truncate">API Link</span>
          <v-icon class="ml-2" color="blue-diversity">mdi-content-copy</v-icon>
        </div>
        <div
          class="blue-diversity--text neutral-20 py-2 px-5 rounded text-truncate mt-2 font-weight-bold"
          style="font-family: 'Courier New', Courier, monospace !important"
        >
          {{ task.apiURL }}
        </div>
        <v-divider class="dashed-border my-3" />
      </div>
    </v-sheet>
  </div>
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
