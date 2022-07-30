<template>
  <expand-container class="mt-4" type="twitter" title="Twitter task" subtitle="Quote a tweet" @remove="removeSetting">
    <div class="font-18 font-weight-bold d-flex flex-column flex-md-row">
      Tweet from twitter page name<span class="red--text">*</span>
    </div>
    <app-text-field
      class="mt-2"
      :value="pageName"
      :rules="[$rules.required]"
      placeholder="GLODAO Channel"
      @change="updateConfig('setting.page', $event)"
    />
    <div class="font-18 font-weight-bold mt-2">Twitter link<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="tweetLink"
      append-icon="mdi-link"
      :rules="[$rules.required, $rules.url]"
      @change="updateConfig('setting.link', $event)"
      placeholder="https://twitter.com/CyberKDev/status/1546685980857745408"
    />
    <div class="font-18 font-weight-bold mt-2">Twitter hastag<span class="red--text">*</span></div>
    <app-autocomplete
      :value="hashtag"
      placeholder="Enter your hastag"
      @onChange="updateConfig('setting.hashtag', $event)"
      :rules="[(v) => !!(v && v.length) || 'This field is required']"
    />
  </expand-container>
</template>

<script lang="ts">
import { EMPTY_ARRAY, EMPTY_STRING, QUOTE_TASK_TYPE_DEFAULT_CONFIG } from '@/constants'
import { isNotEmpty } from '@/helpers'
import { TaskConfig } from '@/models/MissionModel'
import { isEmpty, set } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'expand-container': () => import('../../common/expand-container.vue'),
    'app-autocomplete': () => import('@/modules/regist/components/common/app-autocomplete.vue'),
  },
})
export default class TwitterQuoteTask extends Vue {
  @Prop() inputConfig!: TaskConfig

  taskConfig = isEmpty(this.inputConfig) ? QUOTE_TASK_TYPE_DEFAULT_CONFIG : this.inputConfig

  updateConfig(property: string, value: string) {
    if (property === 'setting.link') {
      set(this.taskConfig, 'setting.embedLink', value)
    }
    this.taskConfig = set(this.taskConfig, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    if (isNotEmpty(this.pageName) && isNotEmpty(this.tweetLink)) {
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

  get hashtag() {
    return this.taskConfig.setting?.hashtag || EMPTY_ARRAY
  }
}
</script>

<style scoped></style>
