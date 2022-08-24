<template>
  <v-form v-model="valid">
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">App information</div>
    <div class="font-weight-bold mt-4 mb-2">App title<span class="app-red--text">*</span></div>
    <app-text-field
      :rules="[$rules.required]"
      :value="vm.appTitle"
      @change="vm.updateIatInfo('appTitle', $event)"
      placeholder="Enter name"
    />

    <div class="d-flex flex-column flex-sm-row mb-2 alignsm-end">
      <span class="font-18 font-weight-bold">App logo<span class="app-red--text">*</span></span>
      <v-spacer />
      <i class="text-subtitle-2 neutral-10--text font-weight-regular">
        *Recommend resolution 1:1 (48x48, 64x64, 80x80, 256x256)
      </i>
    </div>
    <app-file-upload
      isImageFile
      :value="vm.appLogo"
      @change="vm.updateIatInfo('appLogo', $event)"
      :rules="[$rules.required, $rules.isImage, $rules.maxSize(MAX_IMAGE_FILE_SIZE)]"
    />

    <div class="font-weight-bold mt-6 mb-2">App Description<span class="app-red--text">*</span></div>
    <app-textarea
      :rules="[$rules.required]"
      :value="vm.appDescription"
      @change="vm.updateIatInfo('appDescription', $event)"
      placeholder="Enter short description to describe project"
    />

    <app-platform-specific-info />

    <v-divider class="dashed-border mt-7" />
    <div class="d-flex mt-7">
      <v-btn class="flex-grow" depressed outlined height="40" color="neutral-10" @click="goBack">Cancel</v-btn>
      <div class="mx-4" />
      <v-btn
        class="flex-grow text-none"
        :class="{ 'linear-blue--bg white--text': valid }"
        :disabled="!valid"
        height="40"
        depressed
        @click="nextStep"
        >Next</v-btn
      >
    </div>
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </v-form>
</template>

<script lang="ts">
import { MAX_IMAGE_FILE_SIZE } from '@/constants'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { EditInAppTrialViewModel } from '../../viewmodels/edit-iat-viewmodels'

@Observer
@Component({
  components: {
    'app-platform-specific-info': () => import('./app-platform-specific-info.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
  },
})
export default class InAppTrialAppInfo extends Vue {
  @Inject() vm!: EditInAppTrialViewModel

  readonly MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE

  valid = false

  goBack() {
    this.vm.changeStep(1)
  }
  nextStep() {
    this.vm.changeStep()
  }
}
</script>

<style scoped></style>
