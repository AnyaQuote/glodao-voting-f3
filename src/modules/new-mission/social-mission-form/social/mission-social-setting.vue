<template>
  <v-sheet class="rounded-lg mt-3" outlined>
    <v-form v-model="valid" class="pa-7">
      <div class="title font-weight-bold blue-diversity--text">Mission settings</div>

      <!-- ================================== CONFIG TELEGRAM TASK SETTING ================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg mt-7 d-flex justify-space-between align-center cursor-pointer"
        @click="vm.updateSelectDialogState(true, SocialType.TELEGRAM)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Telegram setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in vm.telegram">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting(SocialType.TELEGRAM, setting.key)"
          @change="vm.updateSetting(SocialType.TELEGRAM, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG TWITTER TASK SETTING =================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="vm.updateSelectDialogState(true, SocialType.TWITTER)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Twitter setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in vm.twitter">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting(SocialType.TWITTER, setting.key)"
          @change="vm.updateSetting(SocialType.TWITTER, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG DISCORD TASK SETTING =================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="vm.updateSelectDialogState(true, SocialType.DISCORD)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Discord setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in vm.discord">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting(SocialType.DISCORD, setting.key)"
          @change="vm.updateSetting(SocialType.DISCORD, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG FACEBOOK TASK SETTING ================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="vm.updateSelectDialogState(true, SocialType.FACEBOOK)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Facebook setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in vm.facebook">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting(SocialType.FACEBOOK, setting.key)"
          @change="vm.updateSetting(SocialType.FACEBOOK, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG CUSTOM TASK SETTING ==================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="vm.updateSelectDialogState(true, SocialType.CUSTOM)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Other setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in vm.custom">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting(SocialType.CUSTOM, setting.key)"
          @change="vm.updateSetting(SocialType.CUSTOM, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->
      <v-btn depressed class="mt-3" @click="vm.getData()">Get data</v-btn>
      <v-divider class="my-7 dashed-border" />
    </v-form>
    <social-task-select-dialog />
  </v-sheet>
</template>

<script lang="ts">
import { SocialTaskComponent, SocialType } from '@/models/MissionModel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { NewSocialMissionViewModel } from '../../viewmodels/new-social-mission-viewmodel'

@Observer
@Component({
  components: {
    [SocialTaskComponent.JOIN_TELEGRAM]: () => import('./telegram/telegram-join-task.vue'),
    [SocialTaskComponent.CHAT_TELEGRAM]: () => import('./telegram/telegram-chat-task.vue'),
    [SocialTaskComponent.FOLLOW_TWITTER]: () => import('./twitter/twitter-follow-task.vue'),
    [SocialTaskComponent.QUOTE_TWITTER]: () => import('./twitter/twitter-quote-task.vue'),
    [SocialTaskComponent.COMMENT_TWITTER]: () => import('./twitter/twitter-comment-task.vue'),
    [SocialTaskComponent.LIKE_TWITTER]: () => import('./twitter/twitter-like-task.vue'),
    [SocialTaskComponent.RETWEET_TWITTER]: () => import('./twitter/twitter-retweet-task.vue'),
    [SocialTaskComponent.JOIN_DISCORD]: () => import('./discord/discord-join-task.vue'),
    [SocialTaskComponent.FOLLOW_FACEBOOK]: () => import('./facebook/follow-facebook-task.vue'),
    [SocialTaskComponent.CUSTOM_TASK]: () => import('./custom/custom-task.vue'),
    'social-task-select-dialog': () => import('./dialogs/social-task-select-dialog.vue'),
    'app-autocomplete': () => import('@/modules/regist/components/common/app-autocomplete.vue'),
  },
})
export default class MissionSocialSetting extends Vue {
  @Inject() vm!: NewSocialMissionViewModel
  readonly SocialType = SocialType
  valid = false

  submit() {
    this.vm.submit()
  }

  back() {
    this.vm.changeStep(1)
  }
}
</script>

<style scoped></style>
