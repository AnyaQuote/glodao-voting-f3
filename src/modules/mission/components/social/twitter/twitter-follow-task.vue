<template>
  <expand-container
    class="mt-4"
    type="twitter"
    title="Twitter task"
    subtitle="Follow project twitter"
    @remove="removeSetting"
  >
    <div class="font-18 font-weight-bold">Project from twitter page name<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="pageName"
      :rules="[$rules.required]"
      placeholder="GLODAO Channel"
      @change="updateConfig('setting.page', $event)"
    />

    <div class="font-18 font-weight-bold">Twitter project link<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :rules="[$rules.required, $rules.url]"
      :value="twitterLink"
      @change="updateConfig('setting.link', $event)"
      placeholder="https://twitter.com/GloDAO_Official"
      append-icon="mdi-link"
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
    required?: boolean
  }
}

const followTweetSetting = {
  key: 1,
  component: SocialTaskComponent.FOLLOW_TWITTER,
  setting: {
    type: SocialTaskType.FOLLOW,
    link: '',
    page: '',
    required: true,
  },
}

@Observer
@Component({
  components: {
    'expand-container': () => import('../../common/expand-container.vue'),
  },
})
export default class TwitterFollowTask extends Vue {
  @Prop() inputConfig!: TaskConfig

  taskConfig = isEmpty(this.inputConfig) ? followTweetSetting : this.inputConfig

  updateConfig(property: string, value: string) {
    this.taskConfig = set(this.taskConfig, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    console.log('watching')
    if (isNotEmpty(this.pageName) && isNotEmpty(this.twitterLink)) {
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

  get twitterLink() {
    return this.taskConfig.setting?.link || EMPTY_STRING
  }
}
</script>

<style scoped></style>
