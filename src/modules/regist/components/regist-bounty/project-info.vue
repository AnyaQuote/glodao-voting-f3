<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip class="text-h6 font-weight-bold text-center ma-5 pa-6" color="bluePrimary" label outlined>
      Project information
    </v-chip>

    <v-form ref="project-info-form" v-model="valid" class="form pa-6">
      <div class="label font-weight-bold">Project name</div>
      <app-text-field
        :value="vm.projectInfo.projectName"
        @input="vm.changeProjectInfo('projectName', $event)"
        placeholder="Enter name of project"
      ></app-text-field>

      <div class="label font-weight-bold mt-6">Short description</div>
      <app-textarea
        :value="vm.projectInfo.shortDescription"
        @input="vm.changeProjectInfo('shortDescription', $event)"
        placeholder="Enter project's short description"
      ></app-textarea>

      <div class="label font-weight-bold mt-6">Project logo</div>
      <image-upload-field
        :value="$_get(vm.projectInfo, 'projectLogo')"
        @change="vm.changeProjectInfo('projectLogo', $event)"
      />

      <div class="label font-weight-bold mt-6">Project cover</div>
      <image-upload-field
        :value="$_get(vm.projectInfo, 'projectCover')"
        @change="vm.changeProjectInfo('projectCover', $event)"
      />

      <div class="label font-weight-bold mt-6">Field of project</div>
      <div class="neutral10--text font-weight-light mb-1">Select some keyword about your project</div>
      <v-chip-group
        multiple
        column
        :value="vm.projectInfo.keywords"
        @change="vm.changeProjectInfo('keywords', $event)"
        active-class="active"
      >
        <v-chip v-for="key in keywords" :key="key" :value="key" class="neutral10--text text-caption text-uppercase">
          {{ key }}
        </v-chip>
      </v-chip-group>
      <div class="label font-weight-bold mt-6">Website and social link</div>
      <app-text-field
        class="thin-border"
        :value="$_get(vm.projectInfo, 'socials.website')"
        @input="vm.changeProjectInfo('socials.website', $event)"
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
        :outlined="false"
        :value="$_get(vm.projectInfo, 'socials.medium')"
        @input="vm.changeProjectInfo('socials.medium', $event)"
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
        :outlined="false"
        :value="$_get(vm.projectInfo, 'socials.twitter')"
        @input="vm.changeProjectInfo('socials.twitter', $event)"
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
        :outlined="false"
        :value="$_get(vm.projectInfo, 'socials.telegram')"
        @input="vm.changeProjectInfo('socials.telegram', $event)"
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

      <div class="label neutral10--text mt-6bluePrimary--text font-weight-bold">Token address</div>
      <app-text-field
        :value="$_get(vm.projectInfo, 'tokenAddress')"
        @input="vm.changeProjectInfo('tokenAddress', $event)"
        placeholder="Enter link"
      ></app-text-field>
      <v-btn
        class="linear-blue--bg white--text font-weight-bold text-none mt-6"
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
import { BountyFormViewModel } from '../../viewmodels/bounty-form-viewmodel'

@Component({
  components: {
    'image-upload-field': () => import('../common/image-upload-field.vue'),
  },
})
export default class ProjectInfo extends Vue {
  @Inject() vm!: BountyFormViewModel
  @Ref('project-info-form') form
  valid = false
  keywords = ['gaming', 'NFT', 'finance']
  submit() {
    this.form.validate() && this.vm.nextStep(2.1)
  }
}
</script>

<style lang="scss" scoped>
.form {
  .label {
    font-size: em(18);
  }
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
