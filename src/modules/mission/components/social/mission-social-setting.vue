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

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG FACEBOOK TASK SETTING ================================== -->
      <v-sheet class="neutral-20 px-6 py-2 rounded-lg d-flex justify-space-between align-center">
        <a href="#facebook" class="text-subtitle-1 font-weight-bold">Facebook setting</a>
        <v-btn icon @click="vm.updateSelectDialogState(true, 'facebook')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-sheet>
      <template v-for="setting in vm.facebook">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting('facebook', setting.key)"
          @change="vm.updateSetting('facebook', setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <!-- ================================== CONFIG CUSTOM TASK SETTING ==================================== -->
      <v-sheet class="neutral-20 px-6 py-2 rounded-lg d-flex justify-space-between align-center">
        <a href="#facebook" class="text-subtitle-1 font-weight-bold">Other setting</a>
        <v-btn icon @click="vm.updateSelectDialogState(true, 'custom')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-sheet>
      <template v-for="setting in vm.custom">
        <component
          :key="setting.key"
          :is="setting.component"
          :inputConfig="setting"
          @remove="vm.removeSetting('custom', setting.key)"
          @change="vm.updateSetting('custom', setting.key, $event)"
        />
      </template>
      <!-- ================================================================================================== -->

      <v-divider class="my-7 dashed-border" />

      <div class="d-flex">
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
    [SocialTaskComponent.CHAT_TELEGRAM]: () => import('./telegram/telegram-chat-task.vue'),
    [SocialTaskComponent.FOLLOW_TWITTER]: () => import('./twitter/twitter-follow-task.vue'),
    [SocialTaskComponent.QUOTE_TWITTER]: () => import('./twitter/twitter-quote-task.vue'),
    [SocialTaskComponent.COMMENT_TWITTER]: () => import('./twitter/twitter-comment-task.vue'),
    [SocialTaskComponent.FOLLOW_FACEBOOK]: () => import('./facebook/follow-facebook-task.vue'),
    [SocialTaskComponent.CUSTOM_TASK]: () => import('./custom/custom-task.vue'),
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
