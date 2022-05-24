<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip class="text-h6 font-weight-bold text-center ma-5 pa-6" color="bluePrimary" label outlined>
      Project information
    </v-chip>

    <v-form ref="project-info-form" v-model="valid" class="form pa-6">
      <div class="font-18 font-weight-bold">Project name</div>
      <app-text-field
        :rules="[$rules.required]"
        :value="vm.projectInfo.projectName"
        @input="vm.changeProjectInfo('projectName', $event)"
        placeholder="Enter name of project"
      ></app-text-field>

      <div class="font-18 font-weight-bold mt-6">Short description</div>
      <app-textarea
        :rules="[$rules.required]"
        :value="vm.projectInfo.shortDescription"
        @input="vm.changeProjectInfo('shortDescription', $event)"
        placeholder="Enter project's short description"
      ></app-textarea>

      <div class="font-18 font-weight-bold mt-6">Project logo</div>
      <image-upload-field
        :value="$_get(vm.projectInfo, 'projectLogo')"
        @change="vm.changeProjectInfo('projectLogo', $event)"
      />

      <div class="font-18 font-weight-bold mt-6">Project cover</div>
      <image-upload-field
        :value="$_get(vm.projectInfo, 'projectCover')"
        @change="vm.changeProjectInfo('projectCover', $event)"
      />

      <div class="font-18 font-weight-bold mt-6">Field of project</div>
      <div class="neutral10--text font-weight-light mb-1">Select some keyword about your project</div>
      <v-autocomplete
        :value="vm.projectInfo.fields"
        :rules="[$rules.required]"
        @change="vm.changeProjectInfo('fields', $event)"
        :items="fields"
        deletable-chips
        multiple
        small-chips
        solo
        flat
        outlined
      ></v-autocomplete>

      <div class="font-18 font-weight-bold mt-6">Website and social link</div>
      <app-text-field
        class="thin-border"
        :rules="[$rules.required]"
        :value="$_get(vm.projectInfo, 'socialLinks.website')"
        @input="vm.changeProjectInfo('socialLinks.website', $event)"
        :outlined="false"
        append-icon="mdi-link"
      >
        <template #prepend>
          <div class="w-130">
            <v-icon class="ml-3">mdi-web</v-icon>
            <span class="neutral10--text text-subtitle-2 font-weight-600 ml-3">Website</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <app-text-field
        class="mt-3 thin-border"
        :rules="[$rules.required]"
        :outlined="false"
        :value="$_get(vm.projectInfo, 'socialLinks.medium')"
        @input="vm.changeProjectInfo('socialLinks.medium', $event)"
        append-icon="mdi-link"
      >
        <template #prepend>
          <div class="w-130">
            <v-icon class="ml-3">fab fa-medium</v-icon>
            <span class="neutral10--text text-subtitle-2 font-weight-600 ml-3">Medium</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <app-text-field
        class="mt-3 thin-border"
        :rules="[$rules.required]"
        :outlined="false"
        :value="$_get(vm.projectInfo, 'socialLinks.twitter')"
        @input="vm.changeProjectInfo('socialLinks.twitter', $event)"
        append-icon="mdi-link"
      >
        <template #prepend>
          <div class="d-flex align-center w-130">
            <v-avatar size="24" class="ml-3">
              <v-img src="@/assets/icons/twitter.svg" />
            </v-avatar>
            <!-- <icon-wrapper class="ml-3" src="../../../../assets/icons/twitter.svg" /> -->
            <span class="neutral10--text text-subtitle-2 font-weight-600 ml-3">Twitter</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <app-text-field
        class="mt-3 thin-border"
        :rules="[$rules.required]"
        :outlined="false"
        :value="$_get(vm.projectInfo, 'socialLinks.telegram')"
        @input="vm.changeProjectInfo('socialLinks.telegram', $event)"
        append-icon="mdi-link"
      >
        <template #prepend>
          <div class="d-flex align-center w-130">
            <v-icon color="blue" class="ml-3">fab fa-telegram</v-icon>
            <span class="neutral10--text text-subtitle-2 font-weight-600 ml-3">Telegram</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <v-sheet
        class="neutral100--bg d-flex justify-start align-center text-none pa-3 mt-3 rounded"
        depressed
        width="100%"
        height="fit-content"
        outlined
        v-ripple
      >
        <v-icon>mdi-plus-circle</v-icon>
        <div class="neutral10--text text-subtitle-2 font-weight-600 line-height-1 ml-3">Add more link</div>
      </v-sheet>

      <div class="font-18 neutral10--text mt-6 font-weight-bold">Token reward address</div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(vm.projectInfo, 'tokenAddress')"
        @input="vm.changeProjectInfo('tokenAddress', $event)"
        placeholder="Enter link"
      ></app-text-field>
      <v-btn
        class="white--text font-weight-bold text-none mt-6"
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
  },
})
export default class ProjectInfo extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('project-info-form') form
  valid = false
  fields = ['gaming', 'NFT', 'finance']
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
