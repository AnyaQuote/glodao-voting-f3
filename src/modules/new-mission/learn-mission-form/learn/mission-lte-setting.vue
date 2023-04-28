<template>
  <v-sheet class="rounded-lg" outlined>
    <v-form v-model="valid" class="pa-7">
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
        <!-- <span class="app-blue--text cursor-pointer text-subtitle-2" @click="downloadTemplateMarkdown"
          >Download the markdown template</span
        > -->
      </div>
      <!-- <app-file-upload
        :rules="[$rules.required, $rules.maxSize(1000000), $rules.isTextFile]"
        :value="$_get(vm.learnToEarn, 'setting.learningFile', null)"
        @change="vm.changeLearnToEarnInfo('setting.learningFile', $event)"
      /> -->
      <app-editor :controller="vm.editorController" />

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
        :rules="[$rules.required, $rules.max(vm.learnToEarn.setting.questionsPerQuiz), $rules.integer, $rules.min(1)]"
        @change="vm.changeLearnToEarnInfo('setting.correctAnswersPerQuiz', $event)"
      />

      <v-checkbox
        color="app-blue"
        label="Allow record the highest score"
        :input-value="vm.learnToEarn.setting.canRepeat"
        @input="vm.changeLearnToEarn('setting.canRepeat', $event)"
      />
      <v-btn @click="vm.getData()">Get data</v-btn>
      <!-- ---------------------------------------------------------------------------------------------------- -->
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
    'app-editor': () => import('@/components/editor/app-editor.vue'),
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
