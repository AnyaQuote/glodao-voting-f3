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
        :value="$_get(vm.learnToEarn, 'setting.imageCover', null)"
        @change="vm.changeLearnToEarnInfo('setting.imageCover', $event)"
        class="mt-2"
      />

      <div class="font-18 mt-7 d-flex flex-sm-row flex-column align-start align-sm-end mb-2">
        <span class="font-weight-bold">Quiz file<span class="app-red--text">*</span></span>
        <!-- <span class="text-subtitle-2 font-weight-regular">&nbsp;(Recommend .csv, .txt file)</span> -->
        <v-spacer />
        <span class="app-blue--text cursor-pointer text-subtitle-2" @click="downloadTemplateQuiz"
          >Download the quiz template</span
        >
      </div>
      <app-file-upload
        isQuizFile
        :rules="[$rules.required, $rules.maxSize(1000000)]"
        :value="$_get(vm.learnToEarn, 'setting.quizFile', null)"
        @change="vm.changeLearnToEarnInfo('setting.quizFile', $event)"
        @count:quiz="vm.getQuizLength($event)"
      />
      <v-btn
        v-if="!!$_get(vm.learnToEarn, 'setting.quizFile')"
        class="mt-2 blue-diversity white--text"
        @click="openQuizPreviewDialog"
        depressed
      >
        Preview your quiz
      </v-btn>

      <div class="font-18 mt-7 d-flex flex-sm-row flex-column align-start align-sm-end mb-2">
        <span class="font-18 font-weight-bold">Document<span class="app-red--text">*</span></span>
        <!-- <span class="text-subtitle-2 font-weight-regular">&nbsp;(Recommend .md, .me, .readme file)</span> -->
        <v-spacer />
        <span class="app-blue--text cursor-pointer text-subtitle-2" @click="downloadTemplateMarkdown"
          >Download the markdown template</span
        >
      </div>
      <app-file-upload
        :rules="[$rules.required, $rules.maxSize(1000000), $rules.isTextFile]"
        :value="$_get(vm.learnToEarn, 'setting.learningFile', null)"
        @change="vm.changeLearnToEarnInfo('setting.learningFile', $event)"
      />

      <div class="font-18 mt-6 d-flex flex-sm-row flex-column align-start align-sm-end mb-2">
        <span class="font-18 font-weight-bold">Question per quiz<span class="app-red--text">*</span></span>
        <v-spacer />
        <span class="font-italic grey--text text-subtitle-2 font-weight-regular"
          >*Number of questions must be done to complete the quiz</span
        >
      </div>
      <app-text-field
        type="number"
        :rules="[$rules.required, $rules.min(1), $rules.integer, $rules.max(vm.quizLength)]"
        :value="vm.learnToEarn.setting.questionsPerQuiz"
        @change="vm.changeLearnToEarnInfo('setting.questionsPerQuiz', $event)"
      />

      <div class="font-18 d-flex flex-sm-row flex-column align-start align-sm-end mb-2">
        <span class="font-18 font-weight-bold">Correct answers per quiz<span class="app-red--text">*</span></span>
        <v-spacer />
        <span class="font-italic grey--text text-subtitle-2 font-weight-regular"
          >*Number of corrected answers to pass the quiz</span
        >
      </div>
      <app-text-field
        type="number"
        :value="vm.learnToEarn.setting.correctAnswersPerQuiz"
        :rules="[$rules.required, $rules.max(vm.quizLength), $rules.integer, $rules.min(1)]"
        @change="vm.changeLearnToEarnInfo('setting.correctAnswersPerQuiz', $event)"
      />

      <v-checkbox
        color="app-blue"
        label="Allow record the highest score"
        :input-value="vm.learnToEarn.setting.canRepeat"
        @input="vm.changeLearnToEarn('setting.canRepeat', $event)"
      />

      <!-- ---------------------------------------------------------------------------------------------------- -->
      <div class="d-flex mt-7">
        <div class="flex-grow">
          <v-btn depressed outlined height="40" color="neutral-10" block @click="back"> Back </v-btn>
        </div>
        <div class="px-4" />
        <div class="flex-grow">
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
            Create
          </v-btn>
        </div>
      </div>
      <!-- ---------------------------------------------------------------------------------------------------- -->
    </v-form>
    <quiz-preview-dialog ref="quiz-preview-dialog" />
  </v-sheet>
</template>

<script lang="ts">
import { downloadFile } from '@/helpers/file-helper'
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { NewLearnMissionViewModel } from '../../viewmodels/new-learn-mission-viewmodel'

@Observer
@Component({
  components: {
    'quiz-preview-dialog': () => import('./quiz-preview-dialog.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
  },
})
export default class MissionLearnToEarnSetting extends Vue {
  @Inject() vm!: NewLearnMissionViewModel
  @Ref('quiz-preview-dialog') dialog
  valid = false

  submit() {
    this.valid && this.vm.submit()
  }

  back() {
    this.vm.changeStep(1)
  }

  downloadTemplateQuiz() {
    const url = `${process.env.VUE_APP_WEB_HOST}/question-template.txt`
    downloadFile(url, 'question-template.txt')
  }

  downloadTemplateMarkdown() {
    const url = `${process.env.VUE_APP_WEB_HOST}/markdown-template.txt`
    downloadFile(url, 'markdown-template.txt')
  }

  async openQuizPreviewDialog() {
    await this.vm.prepareQuizPreview()
    this.dialog.open()
  }
}
</script>

<style scoped></style>
