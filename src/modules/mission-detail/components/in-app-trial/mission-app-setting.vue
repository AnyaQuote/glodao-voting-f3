<template>
  <div class="mt-7">
    <div class="text-h6 font-weight-bold">Mission setting</div>

    <!-- =================== API KEY DATA START =================== -->
    <div class="font-weight-medium mt-4">Your API Key</div>
    <code-container>{{ vm.api_key }}</code-container>
    <div class="font-weight-medium mt-4">Your Secret Key</div>
    <code-container>{{ vm.secret_key }}</code-container>
    <div class="font-weight-medium mt-4">Your Task Code</div>
    <code-container>{{ vm.taskCode }}</code-container>
    <!-- =================== API KEY DATA END =================== -->

    <v-sheet class="pa-6 mt-7" outlined rounded="lg">
      <div v-for="task in vm.missionTaskSetting" :key="task.step">
        <div class="d-flex align-center font-18">
          <v-sheet min-width="40" height="40" rounded="lg" class="blue-2 d-flex">
            <span class="ma-auto font-weight-bold">{{ task.step }}</span>
          </v-sheet>
          <div class="ml-4 flex-grow-1 font-weight-bold text-truncate">{{ task.context }}</div>
          <span class="d-none d-sm-block font-weight-medium blue-diversity--text text-truncate">API Link</span>
          <v-icon class="ml-2" color="blue-diversity" @click="vm.copyToClipboard(task.fullApiUrl)"
            >mdi-content-copy</v-icon
          >
        </div>
        <div class="font-weight-medium mt-4">Your step code</div>
        <code-container>{{ task.code }}</code-container>
        <div class="font-weight-medium mt-2">Your task api</div>
        <code-container>{{ task.displayApiUrl }}</code-container>
        <v-divider class="dashed-border my-3" />
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Inject } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Observer
@Component({
  components: {
    'code-container': () => import('../common/code-container.vue'),
  },
})
export default class MissionAppSetting extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel
}
</script>

<style scoped></style>
