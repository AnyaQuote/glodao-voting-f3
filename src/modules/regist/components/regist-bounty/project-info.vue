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

    <v-form ref="project-info-form" v-model="valid" class="form pa-6">
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
        :rules="[$rules.maxSize(15000000), $rules.isImage, $rules.required]"
        :value="$_get(vm.projectInfo, 'projectLogo')"
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
        :rules="[$rules.maxSize(15000000), $rules.isImage, $rules.required]"
        :value="$_get(vm.projectInfo, 'projectLogo')"
        @change="vm.changeProjectInfo('projectCover', $event)"
      />

      <div class="font-18 font-weight-bold mt-6">Field of project</div>
      <div class="neutral10--text font-weight-light mb-1">Select some keyword about your project</div>
      <v-autocomplete
        :value="$_get(vm.projectInfo, 'fields')"
        @change="vm.changeProjectInfo('fields', $event)"
        :items="fields"
        deletable-chips
        multiple
        small-chips
        solo
        flat
        outlined
      >
      </v-autocomplete>

      <!-- ===== SOCIAL LINKS FIELDS ===== -->
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between">
        <span class="font-18 font-weight-bold"> Website and social link<span class="app-red--text">*</span></span>
        <i class="text-subtitle-2 font-weight-regular">*Select a link for each types</i>
      </div>
      <app-socials-field
        :value="$_get(vm.projectInfo, 'socialLinks')"
        @change="vm.changeProjectInfo('socialLinks', $event)"
        class="mt-3"
      />

      <v-btn
        class="white--text font-weight-bold text-none text-subtitle-1 mt-6"
        :class="valid && 'linear-blue--bg'"
        :disabled="!valid"
        depressed
        width="100%"
        height="40"
        @click.prevent="submit"
      >
        Continue
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'

@Component({
  components: {
    'image-upload-field': () => import('@/components/image-upload-field.vue'),
    'app-socials-field': () => import('@/components/app-socials-field.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
  },
})
export default class ProjectInfo extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('project-info-form') form
  valid = false
  fields = ['Gaming', 'NFT', 'Finance']

  submit() {
    this.form.validate() && this.vm.nextStep(1.2)
  }
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
