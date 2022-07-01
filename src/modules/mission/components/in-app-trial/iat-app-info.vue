<template>
  <v-form v-model="valid">
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">App information</div>
    <div class="font-weight-bold mt-4 mb-2">App title<span class="app-red--text">*</span></div>
    <app-text-field placeholder="Enter name" />

    <div class="d-flex mb-2 align-end">
      <span class="font-18 font-weight-bold">App logo<span class="app-red--text">*</span></span>
      <v-spacer />
      <i class="text-subtitle-2 neutral-10--text font-weight-regular">
        *Recommend resolution 1:1 (48x48, 64x64, 80x80, 256x256)
      </i>
    </div>
    <app-file-upload isImageFile :rules="[$rules.required, $rules.isImage, $rules.maxSize(MAX_IMAGE_FILE_SIZE)]" />

    <div class="d-flex flex-column flex-sm-row mt-4">
      <div class="flex-grow">
        <div class="mb-2 font-weight-bold">App Store</div>
        <app-text-field placeholder="Enter link" />
      </div>
      <div class="d-none d-sm-block px-4" />
      <div class="flex-grow">
        <div class="mb-2 font-weight-bold">CH play</div>
        <app-text-field placeholder="Enter link" />
      </div>
    </div>

    <div class="font-weight-bold mb-2">App Description<span class="app-red--text">*</span></div>
    <app-textarea :rules="[$rules.required]" placeholder="Enter short description to describe project" />
    <!-- ---------------------------------------------------------------------------------------------------- -->
    <div class="font-weight-bold mb-2">App Screenshot<span class="app-red--text">*</span></div>
    <screenshot-file-upload
      :value="$_get(vm.iatInfo, 'screenShots', null)"
      @onChange="vm.updateIatInfo('screenShots', $event)"
    />
    <!-- ---------------------------------------------------------------------------------------------------- -->

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
import { NewInAppTrialViewModel } from '../../viewmodels/new-iat-viewmodels'

@Observer
@Component({
  components: {
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'screenshot-file-upload': () => import('../common/screenshot-file-upload.vue'),
  },
})
export default class InAppTrialAppInfo extends Vue {
  @Inject() vm!: NewInAppTrialViewModel

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
