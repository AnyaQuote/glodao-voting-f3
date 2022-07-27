<template>
  <div class="d-flex flex-column">
    <!-- ----------------------------- DISPLAY TWITTER SETTING ----------------------------------------------- -->
    <v-sheet v-for="(task, index) in twitterSetting" :key="index" class="pa-5 mt-2" rounded="lg" outlined>
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center">
        <v-img src="@/assets/icons/twitter.svg" class="d-none d-sm-block" max-width="24" max-height="24" />
        <div class="ml-0 ml-sm-2" />
        <span class="font-weight-600"> Twitter task</span>
        <v-sheet width="4" height="4" rounded="circle" class="d-none d-sm-block neutral-10 mx-sm-4 mx-2" />
        <span class="neutral-10--text text-subtitle-2 text-capitalize">{{
          twitterTaskName(task.type, task.page)
        }}</span>
      </div>
      <div class="mt-2 text-truncate text-subtitle-2 font-weight-600" :style="`max-width: ${linkWidth}`">
        <span>Twitter link:&nbsp;</span>
        <a class="blue-diversity--text" :href="task.link">{{ task.link }}</a>
      </div>
      <!-- </div> -->
      <div v-if="'quote' === task.type" class="mt-2 text-subtitle-2 font-weight-600">
        <span>Hastag:&nbsp;</span>
        <span v-for="(item, index) in task.hashtag" :key="index" class="blue-diversity--text">#{{ item }}&nbsp;</span>
      </div>

      <div v-if="task.content && task.content.length > 0" class="mt-2 text-subtitle-2 font-weight-600">
        <span>Required content:&nbsp;</span>
        <span v-for="(item, index) in task.content" :key="index" class="blue-diversity--text">#{{ item }}&nbsp;</span>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------ -->

    <!-- ----------------------------- DISPLAY TELEGRAM SETTING ----------------------------------------------- -->
    <v-sheet
      v-for="(task, index) in telegramSetting"
      :key="index + twitterSetting.length"
      class="pa-5 mt-2"
      rounded="lg"
      outlined
    >
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center">
        <v-img src="@/assets/icons/telegram.svg" max-width="24" max-height="24" class="d-none d-sm-block" />
        <div class="ml-0 ml-sm-2" />
        <span class="font-weight-600"> Telegram task</span>
        <v-sheet width="4" height="4" rounded="circle" class="d-none d-sm-block neutral-10 mx-sm-3 mx-1" />
        <span class="neutral-10--text text-subtitle-2 text-capitalize">
          {{ telegramTaskName(task.type) }}
        </span>
      </div>
      <div class="mt-2 text-truncate text-subtitle-2 font-weight-600" :style="`max-width: ${linkWidth}`">
        <span>Channel group:&nbsp;</span>
        <a class="blue-diversity--text" :href="task.link">{{ task.link }}</a>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------ -->

    <!-- ----------------------------- DISPLAY FACEBOOK SETTING ----------------------------------------------- -->
    <v-sheet
      v-for="(task, index) in facebookSetting"
      :key="index + twitterSetting.length + facebookSetting.length"
      class="pa-5 mt-2"
      rounded="lg"
      outlined
    >
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center">
        <v-icon v-html="'fab fa-facebook'" max-width="24" max-height="24" color="app-blue" class="d-none d-sm-block" />
        <div class="ml-0 ml-sm-2" />
        <span class="font-weight-600"> Facebook task</span>
        <v-sheet width="4" height="4" rounded="circle" class="d-none d-sm-block neutral-10 mx-sm-3 mx-1" />
        <span class="neutral-10--text text-subtitle-2 text-capitalize">
          {{ facebookTaskName(task.type, task.page) }}
        </span>
      </div>
      <div class="mt-2 text-truncate text-subtitle-2 font-weight-600" :style="`max-width: ${linkWidth}`">
        <span>Facebook group:&nbsp;</span>
        <a class="blue-diversity--text" :href="task.link">{{ task.link }}</a>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------ -->

    <!-- ----------------------------- DISPLAY CUSTOM SETTING ----------------------------------------------- -->
    <v-sheet
      v-for="(task, index) in customTaskSetting"
      :key="index + twitterSetting.length + facebookSetting.length + customTaskSetting.length"
      class="pa-5 mt-2"
      rounded="lg"
      outlined
    >
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center">
        <v-icon
          v-html="'mdi-checkbox-marked-circle'"
          max-width="24"
          max-height="24"
          color="app-blue"
          class="d-none d-sm-block"
        />
        <div class="ml-0 ml-sm-2" />
        <span class="font-weight-600">Custom task</span>
        <v-sheet width="4" height="4" rounded="circle" class="d-none d-sm-block neutral-10 mx-sm-3 mx-1" />
        <span class="neutral-10--text text-subtitle-2 text-capitalize">
          {{ task.name }}
        </span>
      </div>
      <div class="mt-2 d-flex text-subtitle-2 font-weight-medium neutral-10--text font-weight-600 wspace-preline">
        {{ task.description }}
      </div>
      <div class="mt-2 text-truncate text-subtitle-2 font-weight-600" :style="`max-width: ${linkWidth}`">
        <span>Task link:&nbsp;</span>
        <a class="blue-diversity--text" :href="task.link">{{ task.link }}</a>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------ -->
  </div>
</template>

<script lang="ts">
import { Data, Task } from '@/models/MissionModel'
import { get } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class MissionSocialSettingViewer extends Vue {
  @Prop({ required: true }) data!: Data

  twitterSetting: Task[] = []
  telegramSetting: Task[] = []
  facebookSetting: Task[] = []
  customTaskSetting: Task[] = []
  // discordSetting: Task[] = []

  created() {
    this.twitterSetting = get(this.data, 'twitter', [])
    this.telegramSetting = get(this.data, 'telegram', [])
    this.facebookSetting = get(this.data, 'facebook', [])
    this.customTaskSetting = get(this.data, 'optional', [])
    // this.discordSetting = get(this.data, 'discord', [])
  }

  get twitterTaskName() {
    return (taskType, taskPage) => {
      switch (taskType) {
        case 'comment':
          return `Like and reply a post from ${taskPage}`
        case 'quote':
          return `Quote a tweet from ${taskPage}`
        case 'follow':
          return `Follow project twitter from ${taskPage}`
        default:
          return `${taskType} twitter`
      }
    }
  }

  get telegramTaskName() {
    return (taskType) => {
      switch (taskType) {
        case 'follow':
          return 'Join telegram group'
        default:
          return `${taskType} telegram group`
      }
    }
  }

  get facebookTaskName() {
    return (taskType, taskPage) => {
      switch (taskType) {
        case 'follow':
          return `Follow ${taskPage} on facebook`
        default:
          return `Facebook task ${taskType}`
      }
    }
  }

  get linkWidth() {
    return this.$vuetify.breakpoint.mdAndUp ? '600px' : '300px'
  }
}
</script>

<style scoped></style>
