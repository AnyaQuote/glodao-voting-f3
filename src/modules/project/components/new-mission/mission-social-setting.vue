<template>
  <v-sheet class="rounded-lg" outlined>
    <div class="py-6 text-center rounded-lg rounded-b-0 blue-2">
      <span class="text-h5 font-weight-bold text-uppercase">Create mission</span>
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

      <!-- -------------------------------------- Like and repost tweet -------------------------------------- -->
      <switch-field
        class="mt-4"
        type="telegram"
        title="Telegram task"
        subtitle="Chat in group"
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
      <div class="row no-gutters mt-7">
        <div class="col-6 pr-4">
          <v-btn class="col-6" depressed outlined height="40" color="neutral-10" block @click="back"> Back </v-btn>
        </div>
        <div class="col-6">
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
            Next
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
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'

@Observer
@Component({
  components: {
    'switch-field': () => import('./common/switch-field.vue'),
  },
})
export default class MissionSocialSetting extends Vue {
  @Inject() vm!: NewMissionViewModel
  formState = false

  submit() {
    this.vm.submit()
  }

  back() {
    this.vm.changeStep(1)
  }
}
</script>

<style scoped></style>
