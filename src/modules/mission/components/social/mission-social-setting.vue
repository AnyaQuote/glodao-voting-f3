<template>
  <v-sheet class="rounded-lg" outlined>
    <div
      class="pa-6 text-center rounded-lg rounded-b-0 blue-2 d-flex flex-column flex-sm-row align-center justify-space-between"
    >
      <div class="d-flex align-self-start align-self-sm-center cursor-pointer" @click="back">
        <v-icon class="mr-2" size="20">mdi-arrow-left</v-icon>
        <span class="text-subtitle-2">Create mission</span>
      </div>
      <div class="my-2 my-sm-0" />
      <div class="text-h5 font-weight-bold blue-diversity--text">Social mission</div>
    </div>
    <v-divider />

    <v-form v-model="formState" class="pa-7">
      <div class="title font-weight-bold blue-diversity--text">Mission settings</div>

      <!-- ================================== CONFIG TELEGRAM TASK SETTING ================================== -->
      <v-sheet class="neutral-20 px-6 py-2 rounded-lg mt-7 d-flex justify-space-between align-center">
        <a href="#telegram" class="text-subtitle-1 font-weight-bold">Telegram setting</a>
        <v-btn icon @click="vm.updateSelectDialogState(true, 'telegram')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-sheet>
      <template v-for="setting in vm.telegram">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting('telegram', setting.key)"
          @change="vm.updateSetting('telegram', setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG TWITTER TASK SETTING =================================== -->
      <v-sheet class="neutral-20 px-6 py-2 rounded-lg d-flex justify-space-between align-center">
        <a href="#telegram" class="text-subtitle-1 font-weight-bold">Twitter setting</a>
        <v-btn icon @click="vm.updateSelectDialogState(true, 'twitter')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-sheet>
      <template v-for="setting in vm.twitter">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting('twitter', setting.key)"
          @change="vm.updateSetting('twitter', setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <!-- ======================================= CHAT TELEGRAM ========================================== -->
      <!-- <switch-field
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
      </switch-field> -->
      <!-- ============================================================================================== -->

      <!-- ======================================= Follow twitter ======================================= -->
      <!-- <switch-field
        class="mt-4"
        type="twitter"
        title="Twitter task"
        subtitle="Follow project twitter"
        :value="vm.followTwitter.enabled"
        @change="vm.changeFollowTwitterSetting('enabled', $event)"
      >
        <div class="font-18 font-weight-bold d-flex flex-column flex-md-row">
          Project from twitter page name<span class="red--text">*</span>
        </div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required]"
          :value="$_get(vm.followTwitter, 'setting.page')"
          @change="vm.changeFollowTwitterSetting('setting.page', $event)"
          placeholder="GLODAO Channel"
        />

        <div class="font-18 font-weight-bold">Twitter project link<span class="red--text">*</span></div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.followTwitter, 'setting.link')"
          @change="vm.changeFollowTwitterSetting('setting.link', $event)"
          placeholder="https://twitter.com/GloDAO_Official"
          append-icon="mdi-link"
        />
      </switch-field> -->
      <!-- =========================================================================================== -->

      <!-- ======================================= Quote tweet ======================================= -->
      <!-- <switch-field
        class="mt-4"
        type="twitter"
        title="Twitter task"
        subtitle="Quote a tweet"
        :value="vm.quoteTweet.enabled"
        @change="vm.changeQuoteTweetSetting('enabled', $event)"
      >
        <div class="font-18 font-weight-bold d-flex flex-column flex-md-row">
          Tweet from twitter page name<span class="red--text">*</span>
        </div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required]"
          :value="$_get(vm.quoteTweet, 'setting.page')"
          @change="vm.changeQuoteTweetSetting('setting.page', $event)"
          placeholder="GLODAO Channel"
        />
        <div class="font-18 font-weight-bold mt-2">Twitter link<span class="red--text">*</span></div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.quoteTweet, 'setting.link')"
          @change="vm.changeQuoteTweetSetting('setting.link', $event)"
          placeholder="https://twitter.com/CyberKDev/status/1546685980857745408"
          append-icon="mdi-link"
        />
        <div class="font-18 font-weight-bold mt-2">Twitter hastag<span class="red--text">*</span></div>
        <app-autocomplete
          :items="[]"
          :rules="[(v) => !!(v && v.length) || 'This field is required']"
          placeholder="Enter your hastag"
          :value="$_get(vm.quoteTweet, 'setting.hashtag')"
          @onChange="vm.changeQuoteTweetSetting('setting.hashtag', $event)"
        />
      </switch-field> -->
      <!-- =============================================================================================== -->

      <!-- ======================================= Like and repost tweet ================================= -->
      <!-- <switch-field
        class="mt-4"
        type="twitter"
        title="Twitter task"
        subtitle="Like and reply a post"
        :value="vm.commentTweet.enabled"
        @change="vm.changeCommentTweetSetting('enabled', $event)"
      >
        <div class="font-18 font-weight-bold d-flex flex-column flex-md-row">
          Tweet from twitter page name<span class="red--text">*</span>
        </div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required]"
          :value="$_get(vm.commentTweet, 'setting.page')"
          @change="vm.changeCommentTweetSetting('setting.page', $event)"
          placeholder="GLODAO Channel"
        />
        <div class="font-18 font-weight-bold mt-2">Twitter post link<span class="red--text">*</span></div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.commentTweet, 'setting.link')"
          @change="vm.changeCommentTweetSetting('setting.link', $event)"
          placeholder="https://twitter.com/CyberKDev/status/1546685980857745408"
          append-icon="mdi-link"
        />
      </switch-field> -->
      <!-- =============================================================================================== -->

      <!-- ======================================= Facebook follow ======================================= -->
      <!-- <switch-field
        class="mt-4"
        type="facebook"
        title="Facebook task"
        subtitle="Follow fanpage"
        :value="vm.facebookFollow.enabled"
        @change="vm.changeFacebookFollowSetting('enabled', $event)"
      >
        <div class="font-18 font-weight-bold mt-2">Facebook page name<span class="red--text">*</span></div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required]"
          :value="$_get(vm.facebookFollow, 'setting.page')"
          @change="vm.changeFacebookFollowSetting('setting.page', $event)"
          placeholder="Enter your facebook page name"
        />

        <div class="font-18 font-weight-bold mt-2">Facebook page link<span class="red--text">*</span></div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required, $rules.url]"
          :value="$_get(vm.facebookFollow, 'setting.link')"
          @change="vm.changeFacebookFollowSetting('setting.link', $event)"
          placeholder="https://www.facebook.com/groups/1021901785231713"
          append-icon="mdi-link"
        />
      </switch-field> -->
      <!-- ============================================================================================= -->

      <!-- ======================================= CUSTOM TASK ========================================= -->
      <!-- <switch-field
        class="mt-4"
        type="other"
        title="Custom task"
        subtitle="Customize your task"
        :value="vm.customTask.enabled"
        @change="vm.changeCustomTaskSetting('enabled', $event)"
      >
        <div class="font-18 font-weight-bold mt-2">Task name<span class="red--text">*</span></div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.required]"
          :value="$_get(vm.customTask, 'setting.name')"
          @change="vm.changeCustomTaskSetting('setting.name', $event)"
          placeholder="Enter your task name"
        />

        <div class="font-18 font-weight-bold mt-2">Task description<span class="red--text">*</span></div>
        <app-textarea
          class="mt-2"
          :rules="[$rules.required]"
          :value="$_get(vm.customTask, 'setting.description')"
          @change="vm.changeCustomTaskSetting('setting.description', $event)"
          placeholder="Describe your custom task"
        />

        <div class="font-18 font-weight-bold mt-2">Task link<span class="red--text">*</span></div>
        <app-text-field
          class="mt-2"
          :rules="[$rules.url, $rules.required]"
          :value="$_get(vm.customTask, 'setting.link')"
          @change="vm.changeCustomTaskSetting('setting.link', $event)"
          placeholder="Enter your link"
          append-icon="mdi-link"
        />
      </switch-field> -->
      <!-- ============================================================================================= -->

      <div class="d-flex mt-7">
        <div class="flex-grow">
          <v-btn depressed outlined height="40" color="neutral-10" block @click="back"> Back </v-btn>
        </div>
        <div class="px-4" />
        <div class="flex-grow">
          <v-btn
            class="text-none"
            :class="'linear-blue--bg white--text'"
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
    <social-task-select-dialog />
  </v-sheet>
</template>

<script lang="ts">
import { SocialTaskComponent } from '@/models/MissionModel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewSocialMissionViewModel, SocialType } from '../../viewmodels/new-social-mission-viewmodel'

@Observer
@Component({
  components: {
    [SocialTaskComponent.JOIN_TELEGRAM]: () => import('./telegram/telegram-join-task.vue'),
    [SocialTaskComponent.FOLLOW_TWITTER]: () => import('./twitter/twitter-follow-task.vue'),
    [SocialTaskComponent.CHAT_TELEGRAM]: () => import('./telegram/telegram-chat-task.vue'),
    [SocialTaskComponent.QUOTE_TWITTER]: () => import('./twitter/twitter-quote-task.vue'),
    'social-task-select-dialog': () => import('./dialogs/social-task-select-dialog.vue'),
    'app-autocomplete': () => import('@/modules/regist/components/common/app-autocomplete.vue'),
  },
})
export default class MissionSocialSetting extends Vue {
  @Inject() vm!: NewSocialMissionViewModel
  formState = false

  socialTypeEnum = SocialType

  beforeDestroy() {
    // this.vm.resetSocialSetting()
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
