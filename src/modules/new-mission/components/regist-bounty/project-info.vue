<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip
      class="font-weight-bold text-center ma-5 pa-6 text-uppercase neutral-0--text font-18"
      color="app-blue"
      label
      outlined
    >
      Project information
    </v-chip>

    <v-form ref="project-info-form" class="form pa-6">
      <div class="font-18 font-weight-bold">Project name<span class="app-red--text">*</span></div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(vm.projectInfo, 'projectName')"
        @input="vm.changeProjectInfo('projectName', $event)"
        placeholder="Enter name of project"
      ></app-text-field>

      <div class="font-18 font-weight-bold">Short description<span class="app-red--text">*</span></div>
      <app-textarea
        :rules="[$rules.required]"
        :value="$_get(vm.projectInfo, 'shortDescription')"
        @input="vm.changeProjectInfo('shortDescription', $event)"
        placeholder="Enter project's short description"
      ></app-textarea>

      <div class="d-flex mt-6 mb-2 align-end">
        <span class="font-18 font-weight-bold">Project logo<span class="app-red--text">*</span></span>
        <v-spacer />
        <i class="text-subtitle-2 neutral-10--text font-weight-regular">
          *Recommend resolution 1:1 (48x48, 64x64, 80x80, 256x256)
        </i>
      </div>
      <app-file-upload
        isImageFile
        :rules="[$rules.maxSize(MAX_IMAGE_FILE_SIZE), $rules.isImage, $rules.required]"
        :value="$_get(vm.projectInfo, 'projectLogo', null)"
        @change="vm.changeProjectInfo('projectLogo', $event)"
      />

      <div class="d-flex mt-6 mb-2 align-end">
        <span class="font-18 font-weight-bold">Project cover<span class="app-red--text">*</span></span>
        <v-spacer />
        <i class="text-subtitle-2 neutral-10--text font-weight-regular"
          >*Recommend resolution 3:2 (2160×1440, 2560×1700)</i
        >
      </div>
      <app-file-upload
        isImageFile
        :rules="[$rules.maxSize(MAX_IMAGE_FILE_SIZE), $rules.isImage, $rules.required]"
        :value="$_get(vm.projectInfo, 'projectCover', null)"
        @change="vm.changeProjectInfo('projectCover', $event)"
      />

      <div class="font-18 font-weight-bold mt-6">Field of project</div>
      <app-autocomplete
        limit="5"
        :items="['NFT', 'Finance', 'Gaming']"
        :value="$_get(vm.projectInfo, 'fields')"
        @onChange="vm.changeProjectInfo('fields', $event)"
      />

      <!-- ===== SOCIAL LINKS FIELDS ===== -->
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between">
        <span class="font-18 font-weight-bold"> Website and social link<span class="app-red--text">*</span></span>
        <i class="text-subtitle-2 font-weight-regular">*Website link is required</i>
      </div>
      <app-socials-field
        :value="$_get(vm.projectInfo, 'socialLinks')"
        @change="vm.changeProjectInfo('socialLinks', $event)"
        class="mt-3"
      />

      <!-- ----------------------------------- REWARD INFORMATION ----------------------------------------- -->

      <!-- <div class="font-18 font-weight-bold mb-2">Token reward address<span class="app-red--text">*</span></div> -->
      <!-- <app-text-field
        :rules="[$rules.required, $rules.isAddress]"
        :value="$_get(vm.projectInfo, 'tokenAddress')"
        @change="vm.changeProjectInfo('tokenAddress', $event)"
        placeholder="Enter address"
      ></app-text-field> -->

      <!-- ----------------------------------- VOTING DURATION --------------------------------------------- -->
      <!-- <div class="mt-2">
        <span class="font-18 font-weight-bold blue-diversity--text">Voting duration</span>
        <i class="neutral-10--text ml-2">(Locale time)</i>
      </div>
      <div class="font-italic text-subtitle-1 neutral-10--text mb-2">
        *Voting duration is 3 days counting from the project creation date. The time is mark when you begin creating
        this project.
      </div>
      <div class="mb-1 font-18">
        <span class="font-weight-bold">Your project voting will start in: </span>
        <span>{{ $_get(vm.projectInfo, 'votingStart') | ddmmyyyy }}</span>
      </div>
      <div class="font-18">
        <span class="font-weight-bold">Your project voting will end in: </span>
        <span>{{ $_get(vm.projectInfo, 'votingEnd') | ddmmyyyy }}</span>
      </div> -->

      <!-- ----------------------------------- PROJECT REWARD ---------------------------------------------- -->
      <reward-distribution-info />
      <!-- ------------------------------------------------------------------------------------------------- -->

      <!-- ------------------------------------ CAMPAIGN INFORMATION --------------------------------------- -->
      <div class="mt-7">
        <span class="font-18 font-weight-bold blue-diversity--text">Campaign Information</span>
        <i class="neutral-10--text ml-2">(Local time)</i>
      </div>

      <app-datetime-picker2
        class="font-18"
        :min="vm.currentTime.toISOString()"
        :rules="[$rules.required]"
        @change="vm.changeProjectInfo('projectDates', $event)"
        :value="[vm.projectInfo.startDate, vm.projectInfo.endDate]"
      />
      <v-btn @click="vm.getData()"></v-btn>
      <!-- ------------------------------------------------------------------------------------------------- -->
    </v-form>
    <confirm-campaign-dialog ref="confirm-dialog" />
  </v-sheet>
</template>

<script lang="ts">
import { MAX_IMAGE_FILE_SIZE } from '@/constants'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { GeneralInformationViewModel } from '@/modules/new-mission/viewmodels/general-information-viewmodel'

@Component({
  components: {
    'image-upload-field': () => import('@/components/image-upload-field.vue'),
    'app-socials-field': () => import('@/components/app-socials-field.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'app-autocomplete': () => import('../common/app-autocomplete.vue'),
    'confirm-campaign-dialog': () => import('../regist-bounty/confirm-campaign-dialog.vue'),
    'app-datetime-picker2': () => import('@/components/app-datetime-picker2.vue'),
    'reward-distribution-info': () => import('./reward-distribution-info.vue'),
  },
})
export default class ProjectInfo extends Vue {
  @Inject() vm!: GeneralInformationViewModel
  @Ref('project-info-form') form
  @Ref('confirm-dialog') dialog
  MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE
}
</script>

<style lang="scss" scoped>
.form {
  .thin-border {
    border: thin solid var(--v-neutral20-base);
  }
  .w-130 {
    width: em(130);
  }
  .active {
    background-color: var(--v-blue-base);
    color: white !important;
  }
}
</style>
