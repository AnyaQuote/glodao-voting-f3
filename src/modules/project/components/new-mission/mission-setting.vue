<template>
  <div class="mt-7">
    <div class="title font-weight-bold bluePrimary--text">Mission setting</div>
    <!-- -------------------------------------- Join telegram -------------------------------------- -->
    <switch-field
      class="mt-4"
      type="telegram"
      title="Telegram task"
      subtitle="Join telegram group"
      @change="vm.changeJoinTelegramSetting('enabled', $event)"
    >
      <app-text-field
        :rules="[$rules.required, $rules.url]"
        :value="$_get(vm.joinTelegram, 'setting.link')"
        @change="vm.changeJoinTelegramSetting('setting.link', $event)"
        placeholder="Enter telegram group link"
        append-icon="mdi-link"
      />
    </switch-field>

    <!-- -------------------------------------- Follow twitter -------------------------------------- -->
    <switch-field
      class="mt-4"
      type="twitter"
      title="Twitter task"
      subtitle="Follow project twitter"
      @change="vm.changeFollowTwitterSetting('enabled', $event)"
    >
      <app-text-field
        :rules="[$rules.required, $rules.url]"
        :value="$_get(vm.followTwitter, 'setting.link')"
        @change="vm.changeFollowTwitterSetting('setting.link', $event)"
        placeholder="Enter your twitter projects link"
        append-icon="mdi-link"
      />
    </switch-field>

    <!-- -------------------------------------- Quote tweet -------------------------------------- -->
    <switch-field
      class="mt-4"
      type="twitter"
      title="Twitter task"
      subtitle="Quote a tweet"
      @change="vm.changeQuoteTweetSetting('enabled', $event)"
    >
      <div class="font-18 font-weight-bold">Twitter link</div>
      <app-text-field
        class="mt-2"
        :rules="[$rules.required, $rules.url]"
        :value="$_get(vm.quoteTweet, 'setting.link')"
        @change="vm.changeQuoteTweetSetting('setting.link', $event)"
        placeholder="Enter twitter link"
        append-icon="mdi-link"
      />
      <div class="font-18 font-weight-bold mt-6">Twitter hastag</div>
      <app-text-field
        class="mt-2"
        :rules="[$rules.required]"
        :value="$_get(vm.quoteTweet, 'setting.hashtag')"
        @change="vm.changeQuoteTweetSetting('setting.hashtag', $event)"
        placeholder="Enter your hastag"
        append-icon="fa-solid fa-hashtag"
      />
    </switch-field>

    <!-- -------------------------------------- Like and repost tweet -------------------------------------- -->
    <switch-field
      class="mt-4"
      type="twitter"
      title="Twitter task"
      subtitle="Like and reply a post"
      @change="vm.changeCommentTweetSetting('enabled', $event)"
    >
      <app-text-field
        :rules="[$rules.required, $rules.url]"
        :value="$_get(vm.commentTweet, 'setting.link')"
        @change="vm.changeCommentTweetSetting('setting.link', $event)"
        placeholder="Enter your tweet link"
        append-icon="mdi-link"
      />
    </switch-field>

    <!-- -------------------------------------- Setting learn to earn quiz ------------------------- -->
    <switch-field
      class="mt-4"
      type="learn-to-earn"
      title="Learn to earn"
      subtitle="Learn document and answer question"
      @change="vm.changeLearnToEarnInfo('enabled', $event)"
    >
      <div class="font-18 font-weight-bold">Task name</div>
      <app-text-field
        :rules="[$rules.required]"
        :value="$_get(vm.learnToEarn, 'setting.name')"
        @change="vm.changeLearnToEarnInfo('setting.name', $event)"
        class="mt-2"
        placeholder="Enter task name"
      />
      <div class="font-18 font-weight-bold mt-6">Description</div>
      <app-textarea
        :rules="[$rules.required]"
        :value="$_get(vm.learnToEarn, 'setting.description')"
        @change="vm.changeLearnToEarnInfo('setting.description', $event)"
        class="mt-2"
        placeholder="Enter short description that describes the mission"
      />
      <div class="font-18 font-weight-bold mt-6">Quiz cover</div>
      <app-file-upload
        imageOnly
        :rules="[$rules.required, $rules.maxSize(15000000), $rules.isImageFile]"
        @change="vm.changeLearnToEarnInfo('setting.imageCover', $event)"
        class="mt-2"
      />
      <div class="font-18 mt-6 d-flex mb-2">
        <span class="font-weight-bold">Quiz file (fileName.csv)</span>
        <v-spacer />
        <span class="app-blue--text cursor-pointer text-subtitle-2" @click="download">Download the quiz template</span>
      </div>
      <app-file-upload
        :rules="[$rules.required, $rules.maxSize(15000000), $rules.isTextFile]"
        @change="vm.changeLearnToEarnInfo('setting.quizFile', $event)"
      />
      <v-btn
        v-if="$_get(vm.learnToEarn, 'setting.quizFile')"
        class="mt-2 blue-diversity white--text"
        @click="openQuizPreviewDialog"
        depressed
      >
        Preview your quiz
      </v-btn>

      <div class="d-flex font-18 mt-6 font-weight-bold mb-2">Document (fileName.md)</div>
      <app-file-upload
        :rules="[$rules.required, $rules.maxSize(15000000), $rules.isTextFile]"
        @change="vm.changeLearnToEarnInfo('setting.learningFile', $event)"
      />
    </switch-field>
    <quiz-preview-dialog ref="quiz-preview-dialog" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Ref } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'switch-field': () => import('./common/switch-field.vue'),
    'quiz-preview-dialog': () => import('../new-mission/quiz-preview-dialog.vue'),
    'app-file-upload': () => import('@/components/app-file-upload.vue'),
  },
})
export default class MissionSettingForm extends Vue {
  @Ref('quiz-preview-dialog') dialog
  @Inject() vm!: NewMissionViewModel

  download() {
    window.location.href = `${process.env.VUE_APP_API_STRAPI_ENDPOINT}quiz.csv`
  }

  async openQuizPreviewDialog() {
    await this.vm.prepareQuizPreview()
    this.dialog.open()
  }
}
</script>

<style scoped></style>
