<template>
  <v-sheet>
    <v-form class="pa-7" v-model="handler.valid">
      <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
      <div class="title font-weight-bold bluePrimary--text">App information</div>
      <div class="font-weight-bold mt-4 mb-2">App title<span class="app-red--text">*</span></div>
      <app-text-field
        :rules="[$rules.required]"
        :value="handler.appTitle"
        @change="handler.updateIatInfo('appTitle', $event)"
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
        :value="handler.appLogo"
        @change="handler.updateIatInfo('appLogo', $event)"
        :rules="[$rules.required, $rules.isImage, $rules.maxSize(MAX_IMAGE_FILE_SIZE)]"
      />

      <div class="font-weight-bold mt-6 mb-2">App Description<span class="app-red--text">*</span></div>
      <app-textarea
        :rules="[$rules.required]"
        :value="handler.appDescription"
        @change="handler.updateIatInfo('appDescription', $event)"
        placeholder="Enter short description to describe project"
      />

      <app-platform-specific-info :handler="handler" />

      <v-divider class="dashed-border mt-7" />
      <!-- ------------------------------------ MISSION TYPE -------------------------------------------------- -->
      <div class="title font-weight-bold bluePrimary--text">Mission setting</div>
      <!-- ---------------------------------------------------------------------------------------------------- -->

      <div class="font-weight-bold text-subtitle-1 my-2">Task description<span class="red--text">*</span></div>
      <app-textarea
        :value="handler.taskDescription"
        :rules="[$rules.required]"
        @change="handler.updateIatInfo('taskDescription', $event)"
        placeholder="Enter task description, guideline or developer notes..."
      />
      <i class="text-caption font-weight-regular"
        ><u>Notes:</u> Must include guideline on how to use can get their <strong>unique ID</strong>. We will ask users
        to send us their <strong>unique ID</strong> from your app, which plays as an identify key, to us so that we can
        recognize who has used your app and finished all the mission task's steps below.
      </i>

      <!-- ---------------------------------------------------------------------------------------------------- -->
      <div class="font-weight-bold text-subtitle-1 my-2">Task step setting</div>
      <iat-task-collector
        :rules="[$rules.required]"
        :value="handler.taskSetting"
        @onChange="handler.updateIatInfo('tasks', $event)"
      />

      <!-- ---------------------------------------------------------------------------------------------------- -->
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'
import { IatHandler } from './iat.handler'
import { MAX_IMAGE_FILE_SIZE } from '@/constants'

@Observer
@Component({
  components: {
    'mission-steppers': () => import('@/modules/mission/components/common/mission-steppers.vue'),
    'iat-mission-info': () => import('@/modules/mission/components/in-app-trial/iat-mission-info.vue'),
    'iat-app-info': () => import('@/modules/mission/components/in-app-trial/iat-app-info.vue'),
    'iat-task-setting': () => import('@/modules/mission/components/in-app-trial/iat-task-setting.vue'),
    'app-platform-specific-info': () => import('./app-platform-specific-info.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
    'iat-task-collector': () => import('@/modules/mission/components/common/iat-task-collector.vue'),
  },
})
export default class NewInAppTrialPage extends Vue {
  @Prop() handler!: IatHandler

  readonly MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE
}
</script>

<style scoped></style>
