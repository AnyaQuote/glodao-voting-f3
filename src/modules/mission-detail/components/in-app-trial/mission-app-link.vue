<template>
  <div class="mt-7 d-flex flex-column flex-sm-row">
    <v-sheet class="flex-grow pa-6" rounded="lg" outlined>
      <div class="font-18 font-weight-bold mb-2">App link</div>
      <div class="d-flex flex-wrap ma-n1">
        <v-img
          max-width="120"
          class="ma-1 cursor-pointer"
          src="@/assets/images/mission/appstore-flag.png"
          @click="openLink(vm.appStoreLink)"
        />
        <v-img
          max-width="120"
          class="ma-1 cursor-pointer"
          src="@/assets/images/mission/googleplay-flag.png"
          @click="openLink(vm.googlePlayLink)"
        />
      </div>
    </v-sheet>
    <div class="my-2 my-sm-0 mx-0 mx-sm-4" />
    <div class="flex-grow font-weight-bold font-18">
      <div>Instruction</div>
      <div class="d-flex align-center mt-3 cursor-pointer" @click="openDocument">
        <span class="blue-diversity--text mr-2">API Documentation</span>
        <v-icon color="blue-diversity">mdi-open-in-new</v-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { InAppTrialDetailViewModel } from '../../viewmodels/iat-detail-viewmodel'

@Observer
@Component
export default class MissionAppLink extends Vue {
  @Inject() vm!: InAppTrialDetailViewModel

  openLink(url: string) {
    window.open(url, '_blank')
  }

  openDocument() {
    window.open(process.env.VUE_APP_API_DOCUMENT, '_blank')
  }
}
</script>

<style scoped></style>
