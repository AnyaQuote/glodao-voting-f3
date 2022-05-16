<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip color="bluePrimary" label outlined class="text-h6 ma-5 font-weight-bold text-center pa-6">
      Project Information
    </v-chip>

    <div class="form pa-6">
      <div class="label font-weight-bold">Project name</div>
      <app-text-field placeholder="Enter name of project"></app-text-field>

      <div class="label font-weight-bold mt-6">Short description</div>
      <app-textarea placeholder="Enter project's short description"></app-textarea>

      <div class="label font-weight-bold mt-6">Project cover</div>
      <app-text-field placeholder="Enter image link"></app-text-field>

      <div class="label font-weight-bold mt-6">Field of project</div>
      <div class="neutral10--text font-weight-light mb-1">Select some keyword about your project</div>
      <v-chip-group column>
        <v-chip v-for="n in 10" :key="n" class="neutral10--text text-caption text-uppercase"> finance {{ n }} </v-chip>
      </v-chip-group>

      <div class="label font-weight-bold mt-6">Website and social link</div>
      <app-text-field class="thin-border" outlined append-icon="mdi-link">
        <template #prepend>
          <div class="w-130">
            <v-icon class="ml-3">mdi-web</v-icon>
            <span class="neutral10--text text-subtitle-2 font-weight-600 line-height-1 ml-3">Website</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <app-text-field class="mt-3 thin-border" outlined append-icon="mdi-link">
        <template #prepend>
          <div class="w-130">
            <v-icon class="ml-3">fab fa-medium</v-icon>
            <span class="neutral10--text text-subtitle-2 font-weight-600 line-height-1 ml-3">Medium</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <app-text-field class="mt-3 thin-border" outlined append-icon="mdi-link">
        <template #prepend>
          <div class="d-flex align-center w-130">
            <v-avatar size="24" class="ml-3">
              <v-img src="@/assets/icons/twitter.svg" />
            </v-avatar>
            <span class="neutral10--text text-subtitle-2 font-weight-600 line-height-1 ml-3">Website</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <app-text-field class="mt-3 thin-border" outlined append-icon="mdi-link">
        <template #prepend>
          <div class="d-flex align-center w-130">
            <v-icon color="blue" class="ml-3">fab fa-telegram</v-icon>
            <span class="neutral10--text text-subtitle-2 font-weight-600 line-height-1 ml-3">Website</span>
          </div>
          <v-divider vertical></v-divider>
        </template>
      </app-text-field>

      <v-sheet
        class="neutral100--bg d-flex justify-start align-center neutral20-border elevation-0 pa-3 mt-3 rounded"
        width="100%"
        height="fit-content"
        outlined
        v-ripple
      >
        <v-icon>mdi-plus-circle</v-icon>
        <div class="text-subtitle-2 font-weight-600 text-normal line-height-1 ml-3" height="fit-content">
          Add more link
        </div>
      </v-sheet>

      <div class="label neutral10--text mt-6">
        <span class="font-weight-bold"> Research project </span>
        (Please refer to
        <a class="blue--text" href="#" target="_blank">our sample file</a>
        )
      </div>
      <app-text-field placeholder="Enter link"></app-text-field>
      <v-btn class="linear-blue--bg white--text font-weight-bold text-none mt-6" depressed width="100%" height="40">
        Continue
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ProjectInfo extends Vue {}
</script>

<style lang="scss" scoped>
.form {
  .label {
    font-size: em(18);
    margin-bottom: em(16);
  }
  .thin-border {
    border: thin solid var(--v-neutral20-base);
  }
  .w-130 {
    width: em(130);
  }
}
</style>
