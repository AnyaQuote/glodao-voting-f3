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
        Social mission
      </div>
    </div>
    <v-divider />

    <v-form v-model="formState" class="pa-7">
      <div class="title font-weight-bold blue-diversity--text">Mission setting</div>

      <!-- -------------------------------------- Join telegram -------------------------------------- -->
      <switch-field
        class="mt-4"
        type="telegram"
        title="Telegram task"
        subtitle="Join telegram group"
        :value="vm.joinTelegram.enabled"
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
        :value="vm.followTwitter.enabled"
        @change="vm.changeFollowTwitterSetting('enabled', $event)"
      >
        <app-text-field
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.followTwitter, 'setting.link')"
          @change="vm.changeFollowTwitterSetting('setting.link', $event)"
          placeholder="https://twitter.com/CyberKDev/status/1546685980857745408"
          append-icon="mdi-link"
        />
      </switch-field>

      <!-- -------------------------------------- Quote tweet -------------------------------------- -->
      <switch-field
        class="mt-4"
        type="twitter"
        title="Twitter task"
        subtitle="Quote a tweet"
        :value="vm.quoteTweet.enabled"
        @change="vm.changeQuoteTweetSetting('enabled', $event)"
      >
        <div class="font-18 font-weight-bold">Twitter link</div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.quoteTweet, 'setting.link')"
          @change="vm.changeQuoteTweetSetting('setting.link', $event)"
          placeholder="https://twitter.com/CyberKDev/status/1546685980857745408"
          append-icon="mdi-link"
        />
        <div class="font-18 font-weight-bold mt-6">Twitter hastag</div>
        <app-autocomplete
          :items="[]"
          :rules="[(v) => !!(v && v.length) || 'This field is required']"
          placeholder="Enter your hastag"
          :value="$_get(vm.quoteTweet, 'setting.hashtag')"
          @change="vm.changeQuoteTweetSetting('setting.hashtag', $event)"
        />
      </switch-field>

      <!-- -------------------------------------- Like and repost tweet -------------------------------------- -->
      <switch-field
        class="mt-4"
        type="twitter"
        title="Twitter task"
        subtitle="Like and reply a post"
        :value="vm.commentTweet.enabled"
        @change="vm.changeCommentTweetSetting('enabled', $event)"
      >
        <app-text-field
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.commentTweet, 'setting.link')"
          @change="vm.changeCommentTweetSetting('setting.link', $event)"
          placeholder="https://twitter.com/CyberKDev/status/1546685980857745408"
          append-icon="mdi-link"
        />
      </switch-field>

      <!-- -------------------------------------- Like and repost tweet -------------------------------------- -->
      <switch-field
        readonly
        class="mt-4"
        type="telegram"
        title="Telegram task"
        subtitle="Chat in group (Comming soon)"
        :value="vm.telegramChat.enabled"
        @change="vm.changeTelegramChatSetting('enabled', $event)"
      >
        <app-text-field
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.telegramChat, 'setting.link')"
          @change="vm.changeTelegramChatSetting('setting.link', $event)"
          placeholder="Enter your tweet link"
          append-icon="mdi-link"
        />
      </switch-field>

      <!-- ---------------------------------------------------------------------------------------------------- -->
      <div class="d-flex mt-7">
        <div class="flex-grow">
          <v-btn depressed outlined height="40" color="neutral-10" block @click="back"> Back </v-btn>
        </div>
        <div class="px-4" />
        <div class="flex-grow">
          <v-btn
            class="text-none"
            :class="vm.isValid(formState) && 'linear-blue--bg white--text'"
            :disabled="!vm.isValid(formState)"
            :loading="vm.btnLoading"
            @click="submit"
            height="40"
            depressed
            block
          >
            Create
          </v-btn>
        </div>
        <!-- ---------------------------------------------------------------------------------------------------- -->
      </div>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewSocialMissionViewModel } from '../../viewmodels/new-social-mission-viewmodel'

@Observer
@Component({
  components: {
    'switch-field': () => import('../common/switch-field.vue'),
    'app-autocomplete': () => import('@/modules/regist/components/common/app-autocomplete.vue'),
  },
})
export default class MissionSocialSetting extends Vue {
  @Inject() vm!: NewSocialMissionViewModel
  formState = false

  beforeDestroy() {
    this.vm.resetSocialSetting()
  }

  submit() {
    this.vm.submit()
  }

  back() {
    this.vm.changeStep(1)
  }
}
</script>

<style scoped></style>
