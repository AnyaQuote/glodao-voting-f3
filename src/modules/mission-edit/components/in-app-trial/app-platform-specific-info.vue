<template>
  <div>
    <div class="blue-diversity--text font-weight-bold">Specify your app platform type</div>

    <v-radio-group color="blue-diversity" :value="vm.platformType" @change="vm.changePlatformType" row>
      <v-sheet rounded outlined class="flex-grow py-4 px-5" :class="{ 'active-type': !vm.isMobilePlatform }">
        <v-radio label="Web app" color="blue-diversity" :value="platformEnum.WEB">
          <template #label>
            <span :class="{ 'active-type': !vm.isMobilePlatform }">Others app</span>
          </template>
        </v-radio>
      </v-sheet>
      <div class="mx-sm-4 mx-0" />
      <v-sheet rounded outlined color="flex-grow py-4 px-5" :class="{ 'active-type': vm.isMobilePlatform }">
        <v-radio color="blue-diversity" label="Mobile app" :value="platformEnum.MOBILE">
          <template #label>
            <span :class="{ 'active-type': vm.isMobilePlatform }">Mobile app</span>
          </template>
        </v-radio>
      </v-sheet>
    </v-radio-group>

    <div v-if="vm.isMobilePlatform" class="d-flex flex-column flex-sm-row">
      <div class="flex-grow">
        <div class="mb-2 font-weight-bold">Link to the apple app store</div>
        <app-text-field
          :rules="[$rules.url]"
          :value="vm.appStoreLink"
          @change="vm.updateIatInfo('appStoreLink', $event)"
          placeholder="Enter link"
        />
      </div>
      <div class="d-none d-sm-block px-4" />
      <div class="flex-grow">
        <div class="mb-2 font-weight-bold">Link to the goole play store</div>
        <app-text-field
          :rules="[$rules.url]"
          :value="vm.chPlayLink"
          placeholder="Enter link"
          @change="vm.updateIatInfo('chPlayLink', $event)"
        />
      </div>
    </div>

    <div v-else>
      <div class="mb-2 font-weight-bold">Link to your web app</div>
      <app-text-field
        placeholder="Enter link"
        :rules="[$rules.url]"
        :value="vm.webAppLink"
        @change="vm.updateIatInfo('webAppLink', $event)"
      ></app-text-field>
    </div>

    <!-- ---------------------------------------------------------------------------------------------------- -->
    <div class="font-weight-bold mb-2">
      {{ vm.isMobilePlatform ? 'App Screenshot' : 'Web Screenshot' }}<span class="app-red--text">*</span>
    </div>
    <screenshot-file-upload
      :mobileScreenSize="vm.isMobilePlatform"
      :value="vm.appScreenShots"
      @onChange="vm.updateIatInfo('screenShots', $event)"
    />
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { EditInAppTrialViewModel } from '../../viewmodels/edit-iat-viewmodels'

enum AppPlatform {
  MOBILE = 'mobile',
  WEB = 'web',
}

@Observer
@Component({
  components: {
    'screenshot-file-upload': () => import('../common/screenshot-file-upload.vue'),
  },
})
export default class AppPlatformInfo extends Vue {
  @Inject() vm!: EditInAppTrialViewModel

  readonly platformEnum = AppPlatform
}
</script>

<style scoped>
.active-type {
  color: var(--v-blue-diversity-base) !important;
  border-color: var(--v-blue-diversity-base) !important;
  background-color: var(--v-blue-2-base) !important;
}
</style>
