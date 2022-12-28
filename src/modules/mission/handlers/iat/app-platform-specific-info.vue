<template>
  <div>
    <div class="blue-diversity--text font-weight-bold">Specify your app platform type</div>

    <v-radio-group color="blue-diversity" :value="handler.platformType" @change="handler.changePlatformType" row>
      <v-sheet rounded outlined class="flex-grow py-4 px-5" :class="{ 'active-type': !handler.isMobilePlatform }">
        <v-radio label="Web app" color="blue-diversity" :value="platformEnum.WEB">
          <template #label>
            <span :class="{ 'active-type': !handler.isMobilePlatform }">Others app</span>
          </template>
        </v-radio>
      </v-sheet>
      <div class="mx-sm-4 mx-0" />
      <v-sheet rounded outlined color="flex-grow py-4 px-5" :class="{ 'active-type': handler.isMobilePlatform }">
        <v-radio color="blue-diversity" label="Mobile app" :value="platformEnum.MOBILE">
          <template #label>
            <span :class="{ 'active-type': handler.isMobilePlatform }">Mobile app</span>
          </template>
        </v-radio>
      </v-sheet>
    </v-radio-group>

    <div v-if="handler.isMobilePlatform" class="d-flex flex-column flex-sm-row">
      <div class="flex-grow">
        <div class="mb-2 font-weight-bold">Link to the apple app store</div>
        <app-text-field
          :rules="[$rules.url]"
          :value="handler.appStoreLink"
          @change="handler.updateIatInfo('appStoreLink', $event)"
          placeholder="Enter link"
        />
      </div>
      <div class="d-none d-sm-block px-4" />
      <div class="flex-grow">
        <div class="mb-2 font-weight-bold">Link to the goole play store</div>
        <app-text-field
          :rules="[$rules.url]"
          :value="handler.chPlayLink"
          placeholder="Enter link"
          @change="handler.updateIatInfo('chPlayLink', $event)"
        />
      </div>
    </div>

    <div v-else>
      <div class="mb-2 font-weight-bold">Link to your web app</div>
      <app-text-field
        placeholder="Enter link"
        :rules="[$rules.url]"
        :value="handler.webAppLink"
        @change="handler.updateIatInfo('webAppLink', $event)"
      ></app-text-field>
    </div>

    <!-- ---------------------------------------------------------------------------------------------------- -->
    <div class="font-weight-bold mb-2">
      {{ handler.isMobilePlatform ? 'App Screenshot' : 'Web Screenshot' }}<span class="app-red--text">*</span>
    </div>
    <screenshot-file-upload
      :mobileScreenSize="handler.isMobilePlatform"
      :value="handler.appScreenShots"
      @onChange="handler.updateIatInfo('screenShots', $event)"
    />
    <!-- ---------------------------------------------------------------------------------------------------- -->
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Prop, Vue } from 'vue-property-decorator'
import { IatHandler } from './iat.handler'
import { MAX_IMAGE_FILE_SIZE } from '@/constants'

enum AppPlatform {
  MOBILE = 'mobile',
  WEB = 'web',
}

@Observer
@Component({
  components: {
    'screenshot-file-upload': () => import('@/modules/mission/components/common/screenshot-file-upload.vue'),
  },
})
export default class AppPlatformInfo extends Vue {
  @Prop() handler!: IatHandler

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
