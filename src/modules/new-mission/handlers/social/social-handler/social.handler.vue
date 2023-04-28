<template>
  <v-sheet>
    <v-form v-model="handler.valid" class="pa-7">
      <div class="title font-weight-bold blue-diversity--text">Mission settings</div>

      <!-- ================================== CONFIG TELEGRAM TASK SETTING ================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg mt-7 d-flex justify-space-between align-center cursor-pointer"
        @click="handler.updateSelectDialogState(true, SocialType.TELEGRAM)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Telegram setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in handler.telegram">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="handler.removeSetting(SocialType.TELEGRAM, setting.key)"
          @change="handler.updateSetting(SocialType.TELEGRAM, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG TWITTER TASK SETTING =================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="handler.updateSelectDialogState(true, SocialType.TWITTER)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Twitter setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in handler.twitter">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="handler.removeSetting(SocialType.TWITTER, setting.key)"
          @change="handler.updateSetting(SocialType.TWITTER, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG DISCORD TASK SETTING =================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="handler.updateSelectDialogState(true, SocialType.DISCORD)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Discord setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in handler.discord">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="handler.removeSetting(SocialType.DISCORD, setting.key)"
          @change="handler.updateSetting(SocialType.DISCORD, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG FACEBOOK TASK SETTING ================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="handler.updateSelectDialogState(true, SocialType.FACEBOOK)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Facebook setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in handler.facebook">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="handler.removeSetting(SocialType.FACEBOOK, setting.key)"
          @change="handler.updateSetting(SocialType.FACEBOOK, setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG CUSTOM TASK SETTING ==================================== -->
      <v-sheet
        class="neutral-20 px-6 py-3 rounded-lg d-flex justify-space-between align-center cursor-pointer"
        @click="handler.updateSelectDialogState(true, SocialType.CUSTOM)"
        v-ripple
      >
        <span class="text-subtitle-1 font-weight-bold">Other setting</span>
        <v-icon>mdi-plus</v-icon>
      </v-sheet>
      <template v-for="setting in handler.custom">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="handler.removeSetting(SocialType.CUSTOM, setting.key)"
          @change="handler.updateSetting(SocialType.CUSTOM, setting.key, $event)"
        />
      </template>
    </v-form>
    <social-task-select-dialog :handler="handler" />
  </v-sheet>
</template>

<script lang="ts">
import { SocialTaskComponent, SocialType } from '@/models/MissionModel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Prop, Provide, Vue } from 'vue-property-decorator'
import { SocialHandler } from '../social-handler/social.handler'

@Observer
@Component({
  components: {
    [SocialTaskComponent.JOIN_TELEGRAM]: () =>
      import('@/modules/new-mission/social-mission-form/social/telegram/telegram-join-task.vue'),
    [SocialTaskComponent.CHAT_TELEGRAM]: () =>
      import('@/modules/new-mission/social-mission-form/social/telegram/telegram-chat-task.vue'),
    [SocialTaskComponent.FOLLOW_TWITTER]: () =>
      import('@/modules/new-mission/social-mission-form/social/twitter/twitter-follow-task.vue'),
    [SocialTaskComponent.QUOTE_TWITTER]: () =>
      import('@/modules/new-mission/social-mission-form/social/twitter/twitter-quote-task.vue'),
    [SocialTaskComponent.COMMENT_TWITTER]: () =>
      import('@/modules/new-mission/social-mission-form/social/twitter/twitter-comment-task.vue'),
    [SocialTaskComponent.LIKE_TWITTER]: () =>
      import('@/modules/new-mission/social-mission-form/social/twitter/twitter-like-task.vue'),
    [SocialTaskComponent.RETWEET_TWITTER]: () =>
      import('@/modules/new-mission/social-mission-form/social/twitter/twitter-retweet-task.vue'),
    [SocialTaskComponent.JOIN_DISCORD]: () =>
      import('@/modules/new-mission/social-mission-form/social/discord/discord-join-task.vue'),
    [SocialTaskComponent.FOLLOW_FACEBOOK]: () =>
      import('@/modules/new-mission/social-mission-form/social/facebook/follow-facebook-task.vue'),
    [SocialTaskComponent.CUSTOM_TASK]: () =>
      import('@/modules/new-mission/social-mission-form/social/custom/custom-task.vue'),
    'social-task-select-dialog': () => import('@/modules/mission/handlers/social/social-task-select-dialog.vue'),
    'app-autocomplete': () => import('@/modules/regist/components/common/app-autocomplete.vue'),
  },
})
export default class SocialHandlerView extends Vue {
  @Prop() handler!: SocialHandler
  readonly SocialType = SocialType
}
</script>

<style scoped></style>
