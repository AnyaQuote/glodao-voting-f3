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
      <image-upload-field @change="vm.changeLearnToEarnInfo('setting.imageCover', $event)" class="mt-2" />
      <div class="font-18 mt-6 d-flex">
        <span class="font-weight-bold">Quiz file</span>
        <v-spacer />
        <span class="app-blue--text">Download the quiz template</span>
      </div>
      <file-selector
        :rules="[$rules.required]"
        @change="vm.changeLearnToEarnInfo('setting.quizFile', $event)"
        class="mt-2"
      />
      <div class="d-flex mt-6">
        <span class="font-weight-bold">Document</span>
        <v-spacer />
        <span class="app-blue--text">Download the quiz template</span>
      </div>
      <file-selector
        :rules="[$rules.required]"
        @change="vm.changeLearnToEarnInfo('setting.learningFile', $event)"
        class="mt-2"
      />
    </switch-field>
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
    'file-selector': () => import('./file-selector.vue'),
    'image-upload-field': () => import('@/components/image-upload-field.vue'),
  },
})
export default class MissionSettingForm extends Vue {
  @Inject() vm!: NewMissionViewModel
}
</script>

<style scoped></style>
