<template>
  <div>
    <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
    <div class="title font-weight-bold bluePrimary--text">App information</div>
    <div class="font-weight-bold mt-4 mb-2">App title</div>
    <app-text-field placeholder="Enter name" />

    <div class="font-weight-bold mb-2">App logo</div>
    <app-file-upload isImageFile />

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

    <div class="font-weight-bold mb-2">App Description</div>
    <app-textarea placeholder="Enter short description to describe project" />
    <!-- ---------------------------------------------------------------------------------------------------- -->
    <div class="font-weight-bold mb-2">App Screenshot</div>
    <screen-shot-file-upload
      :value="$_get(vm.iatInfo, 'screenShots', null)"
      @onChange="vm.updateAppInfo('screenShots', $event)"
    />
    <!-- ---------------------------------------------------------------------------------------------------- -->

    <v-divider class="dashed-border mt-7" />
    <div class="d-flex mt-7">
      <v-btn class="flex-grow" depressed outlined height="40" color="neutral-10" @click="goBack">Cancel</v-btn>
      <div class="mx-4" />
      <v-btn class="flex-grow text-none linear-blue--bg white--text" height="40" depressed @click="nextStep"
        >Next</v-btn
      >
    </div>
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewInAppTrialViewModel } from '../../viewmodels/new-iat-viewmodels'

@Observer
@Component({
  components: {
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'screen-shot-file-upload': () => import('../common/screen-shot-file-upload.vue'),
  },
})
export default class InAppTrialAppInfo extends Vue {
  @Inject() vm!: NewInAppTrialViewModel
  goBack() {
    this.vm.changeStep(1)
  }
  nextStep() {
    this.vm.changeStep()
  }
}
</script>

<style scoped></style>
