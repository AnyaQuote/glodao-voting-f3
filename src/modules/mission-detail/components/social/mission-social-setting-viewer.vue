<template>
  <div class="d-flex flex-column">
    <!-- ----------------------------- DISPLAY TWITTER SETTING ----------------------------------------------- -->
    <v-sheet v-for="task in twitterSetting" :key="task.id" class="pa-5 mt-2" rounded="lg" outlined>
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
      <div v-if="SocialTaskType.QUOTE === task.type" class="mt-2 text-subtitle-2 font-weight-600">
        <span>Hashtag:&nbsp;</span>
        <span v-for="(item, index) in task.hashtag" :key="index" class="blue-diversity--text">#{{ item }}&nbsp;</span>
      </div>

      <div v-if="task.content && task.content.length > 0" class="mt-2 text-subtitle-2 font-weight-600">
        <span>Required content:&nbsp;</span>
        <span v-for="(item, index) in task.content" :key="index" class="blue-diversity--text">#{{ item }}&nbsp;</span>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------ -->

    <!-- ----------------------------- DISPLAY TELEGRAM SETTING ----------------------------------------------- -->
    <v-sheet v-for="task in telegramSetting" :key="task.id" class="pa-5 mt-2" rounded="lg" outlined>
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

    <!-- ----------------------------- DISPLAY DISCORD SETTING ------------------------------------------------ -->
    <v-sheet v-for="task in discordSetting" :key="task.id" class="pa-5 mt-2" rounded="lg" outlined>
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center">
        <v-icon
          v-html="'fab fa-discord'"
          color="white"
          size="20"
          class="d-none d-sm-block purple rounded-circle discord-icon-padding"
        />
        <div class="ml-0 ml-sm-2" />
        <span class="font-weight-600"> Discord task</span>
        <v-sheet width="4" height="4" rounded="circle" class="d-none d-sm-block neutral-10 mx-sm-3 mx-1" />
        <span class="neutral-10--text text-subtitle-2 text-capitalize">
          {{ discordTaskName(task.type, task.page) }}
        </span>
      </div>
      <div class="mt-2 text-truncate text-subtitle-2 font-weight-600" :style="`max-width: ${linkWidth}`">
        <span>Group invite link:&nbsp;</span>
        <a class="blue-diversity--text" :href="task.link">{{ task.link }}</a>
      </div>
      <div v-if="task.type === SocialTaskType.JOIN_SERVER" class="mt-2 text-truncate text-subtitle-2 font-weight-600">
        <span>Server ID:&nbsp;</span>
        <a class="blue-diversity--text">{{ task.guildId }}</a>
      </div>
    </v-sheet>
    <!-- ------------------------------------------------------------------------------------------------------ -->

    <!-- ----------------------------- DISPLAY FACEBOOK SETTING ----------------------------------------------- -->
    <v-sheet v-for="task in facebookSetting" :key="task.id" class="pa-5 mt-2" rounded="lg" outlined>
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
    <v-sheet v-for="task in customTaskSetting" :key="task.id" class="pa-5 mt-2" rounded="lg" outlined>
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
import { EMPTY_ARRAY } from '@/constants'
import { Data, SocialTaskType, SocialType, Task } from '@/models/MissionModel'
import { get } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class MissionSocialSettingViewer extends Vue {
  @Prop({ required: true }) data!: Data

  key = 0
  readonly SocialTaskType = SocialTaskType

  twitterSetting: Task[] = EMPTY_ARRAY
  telegramSetting: Task[] = EMPTY_ARRAY
  facebookSetting: Task[] = EMPTY_ARRAY
  customTaskSetting: Task[] = EMPTY_ARRAY
  discordSetting: Task[] = EMPTY_ARRAY

  created() {
    this.twitterSetting =
      get(this.data, SocialType.TWITTER, null)?.map((e) => ({ ...e, id: this.key++ })) || EMPTY_ARRAY
    this.telegramSetting =
      get(this.data, SocialType.TELEGRAM, null)?.map((e) => ({ ...e, id: this.key++ })) || EMPTY_ARRAY
    this.facebookSetting =
      get(this.data, SocialType.FACEBOOK, null)?.map((e) => ({ ...e, id: this.key++ })) || EMPTY_ARRAY
    this.discordSetting =
      get(this.data, SocialType.DISCORD, null)?.map((e) => ({ ...e, id: this.key++ })) || EMPTY_ARRAY
    this.customTaskSetting = get(this.data, 'optional', null)?.map((e) => ({ ...e, id: this.key++ })) || EMPTY_ARRAY
  }

  get twitterTaskName() {
    return (taskType, taskPage) => {
      switch (taskType) {
        case SocialTaskType.COMMENT:
          return `Like and reply a post from ${taskPage}`
        case SocialTaskType.QUOTE:
          return `Quote a tweet from ${taskPage}`
        case SocialTaskType.FOLLOW:
          return `Follow project twitter from ${taskPage}`
        default:
          return `${taskType} twitter`
      }
    }
  }

  get telegramTaskName() {
    return (taskType) => {
      switch (taskType) {
        case SocialTaskType.FOLLOW:
          return 'Join telegram group'
        default:
          return `${taskType} telegram group`
      }
    }
  }

  get discordTaskName() {
    return (taskType, taskPage) => {
      switch (taskType) {
        case SocialTaskType.JOIN_SERVER:
          return `Join discord ${taskPage} group`
        default:
          return `${taskType} discord group`
      }
    }
  }

  get facebookTaskName() {
    return (taskType, taskPage) => {
      switch (taskType) {
        case SocialTaskType.FOLLOW:
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

<style scoped>
.discord-icon-padding {
  padding: 6px 4px 6px 4px;
}
</style>
