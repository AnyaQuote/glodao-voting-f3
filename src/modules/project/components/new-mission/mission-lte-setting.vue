<template>
  <v-sheet class="rounded-lg" outlined>
    <div class="pa-6 text-center rounded-lg rounded-b-0 blue-2 d-flex align-center">
      <div class="d-flex align-center cursor-pointer" @click="back">
        <v-icon class="mr-2" size="20">mdi-arrow-left</v-icon>
        <span class="text-subtitle-2">Create mission</span>
      </div>
      <div
        class="p-absolute text-h5 font-weight-bold blue-diversity--text"
        style="left: 50%; transform: translateX(-50%)"
      >
        Learn to earn
      </div>
    </div>
    <v-divider />

    <v-form v-model="valid" class="pa-7">
      <div class="title font-weight-bold blue-diversity--text">Mission setting</div>
      <!-- ---------------------------------------------------------------------------------------------------- -->
      <switch-field
        readonly
        class="mt-4"
        type="learn-to-earn"
        title="Learn to earn"
        subtitle="Learn document and answer question"
        :value="$_get(vm.learnToEarn, 'enabled')"
      >
        <div class="font-18 font-weight-bold">Task name<span class="app-red--text">*</span></div>
        <app-text-field
          :rules="[$rules.required]"
          :value="$_get(vm.learnToEarn, 'setting.name')"
          @change="vm.changeLearnToEarnInfo('setting.name', $event)"
          class="mt-2"
          placeholder="Enter task name"
        />

        <div class="font-18 font-weight-bold mt-6">Description<span class="app-red--text">*</span></div>
        <app-textarea
          :rules="[$rules.required]"
          :value="$_get(vm.learnToEarn, 'setting.description')"
          @change="vm.changeLearnToEarnInfo('setting.description', $event)"
          class="mt-2"
          placeholder="Enter short description that describes the mission"
        />

        <div class="mt-7 d-flex align-end">
          <span class="font-18 font-weight-bold">Mission cover</span>
          <v-spacer />
          <i class="text-subtitle-2 neutral-10--text font-weight-regular">
            *Recommend resolution 3:2 (2160×1440, 2560×1700)
          </i>
        </div>
        <app-file-upload
          isImageFile
          :rules="[$rules.maxSize(1000000), $rules.isImage]"
          :value="$_get(vm.learnToEarn, 'setting.imageCover')"
          @change="vm.changeLearnToEarnInfo('setting.imageCover', $event)"
          class="mt-2"
        />

        <div class="font-18 mt-7 d-flex flex-sm-row flex-column align-start align-sm-end mb-2">
          <span class="font-weight-bold">Quiz file<span class="app-red--text">*</span></span>
          <span class="text-subtitle-2 font-weight-regular">&nbsp;(Recommend .csv, .txt file)</span>
          <v-spacer />
          <span class="app-blue--text cursor-pointer text-subtitle-2" @click="download"
            >Download the quiz template</span
          >
        </div>
        <app-file-upload
          isQuizFile
          :rules="[$rules.required, $rules.maxSize(1000000)]"
          :value="$_get(vm.learnToEarn, 'setting.quizFile')"
          @change="vm.changeLearnToEarnInfo('setting.quizFile', $event)"
        />
        <v-btn
          v-if="!!$_get(vm.learnToEarn, 'setting.quizFile')"
          class="mt-2 blue-diversity white--text"
          @click="openQuizPreviewDialog"
          depressed
        >
          Preview your quiz
        </v-btn>

        <div class="d-flex mt-7 mb-2">
          <span class="font-18 font-weight-bold">Document<span class="app-red--text">*</span></span>
          <span class="text-subtitle-2 font-weight-regular">&nbsp;(Recommend .md, .me, .readme file)</span>
        </div>
        <app-file-upload
          :rules="[$rules.required, $rules.maxSize(1000000), $rules.isTextFile]"
          :value="$_get(vm.learnToEarn, 'setting.learningFile')"
          @change="vm.changeLearnToEarnInfo('setting.learningFile', $event)"
        />
      </switch-field>

      <!-- ---------------------------------------------------------------------------------------------------- -->
      <div class="row no-gutters mt-7">
        <div class="col-6 pr-4">
          <v-btn class="col-6" depressed outlined height="40" color="neutral-10" block @click="back"> Back </v-btn>
        </div>
        <div class="col-6">
          <v-btn
            class="text-none"
            :class="valid && 'linear-blue--bg white--text'"
            :disabled="!valid"
            :loading="vm.btnLoading"
            @click="submit"
            height="40"
            depressed
            block
          >
            Next
          </v-btn>
        </div>
      </div>
      <!-- ---------------------------------------------------------------------------------------------------- -->
    </v-form>
    <quiz-preview-dialog ref="quiz-preview-dialog" />
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'

@Observer
@Component({
  components: {
    'switch-field': () => import('./common/switch-field.vue'),
    'quiz-preview-dialog': () => import('../new-mission/quiz-preview-dialog.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
  },
})
export default class MissionLearnToEarnSetting extends Vue {
  @Inject() vm!: NewMissionViewModel
  @Ref('quiz-preview-dialog') dialog
  valid = false

  created() {
    this.vm.changeLearnToEarnInfo('enabled', true)
  }

  beforeDestroy() {
    this.vm.changeLearnToEarnInfo('enabled', false)
  }

  submit() {
    this.valid && this.vm.submit()
  }

  back() {
    this.vm.changeStep(1)
  }

  download() {
    window.location.href = `${process.env.VUE_APP_API_STRAPI_ENDPOINT}quiz.csv`
  }

  async openQuizPreviewDialog() {
    const res = await this.vm.prepareQuizPreview()
    if (res) {
      this.dialog.open()
    }
  }
}
</script>

<style scoped></style>
