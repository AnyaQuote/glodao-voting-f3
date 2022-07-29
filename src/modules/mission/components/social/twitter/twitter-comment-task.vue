<template>
  <expand-container
    class="mt-4"
    type="twitter"
    title="Twitter task"
    subtitle="Like and reply a post"
    @remove="removeSetting"
  >
    <div class="font-18 font-weight-bold">Tweet from twitter page name<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="pageName"
      :rules="[$rules.required]"
      placeholder="GLODAO Channel"
      @change="updateConfig('setting.page', $event)"
    />
    <div class="font-18 font-weight-bold mt-2">Twitter post link<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      append-icon="mdi-link"
      :rules="[$rules.required, $rules.url]"
      :value="tweetLink"
      @change="updateConfig('setting.link', $event)"
      placeholder="https://twitter.com/CyberKDev/status/1546685980857745408"
    />
  </expand-container>
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { isNotEmpty } from '@/helpers'
import { SocialTaskComponent, SocialTaskType } from '@/models/MissionModel'
import { isEmpty, set } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

interface TaskConfig {
  key?: number
  component?: SocialTaskComponent
  setting?: {
    type?: SocialTaskType
    page?: string
    link?: string
    embedLink?: string
    hashtag?: string[]
    content?: string
    required?: boolean
  }
}

const commentTweetSetting = {
  key: 1,
  component: SocialTaskComponent.COMMENT_TWITTER,
  setting: {
    type: SocialTaskType.COMMENT,
    page: '',
    content: '',
    embedLink: '',
    link: '',
    required: true,
  },
}

@Observer
@Component({
  components: {
    'expand-container': () => import('../../common/expand-container.vue'),
  },
})
export default class TwitterCommentTask extends Vue {
  @Prop() inputConfig!: TaskConfig

  taskConfig = isEmpty(this.inputConfig) ? commentTweetSetting : this.inputConfig

  updateConfig(property: string, value: string) {
    if (property === 'setting.link') {
      set(this.taskConfig, 'setting.embedLink', value)
    }
    this.taskConfig = set(this.taskConfig, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    console.log('watching')
    if (isNotEmpty(this.pageName) && isNotEmpty(this.tweetLink)) {
      console.log('emit')
      this.$emit('change', newSetting)
    }
  }

  removeSetting() {
    this.$emit('remove')
  }

  get pageName() {
    return this.taskConfig.setting?.page || EMPTY_STRING
  }

  get tweetLink() {
    return this.taskConfig.setting?.link || EMPTY_STRING
  }
}
</script>

<style scoped></style>
