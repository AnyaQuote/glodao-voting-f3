<template>
  <expand-container
    class="mt-4"
    type="facebook"
    title="Facebook task"
    subtitle="Follow fanpage"
    @remove="removeSetting"
  >
    <div class="font-18 font-weight-bold mt-2">Facebook page name<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="pageName"
      :rules="[$rules.required]"
      @change="updateConfig('setting.page', $event)"
      placeholder="Enter your facebook page name"
    />

    <div class="font-18 font-weight-bold mt-2">Facebook page link<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="fanpageLink"
      append-icon="mdi-link"
      :rules="[$rules.required, $rules.url]"
      @change="updateConfig('setting.link', $event)"
      placeholder="https://www.facebook.com/groups/1021901785231713"
    />
  </expand-container>
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { isNotEmpty } from '@/helpers'
import { TaskConfig } from '@/models/MissionModel'
import { set } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'expand-container': () => import('../../common/expand-container.vue'),
  },
})
export default class FollowFacebookTask extends Vue {
  @Prop({ required: true }) inputConfig!: TaskConfig

  taskConfig = this.inputConfig

  updateConfig(property: string, value: string) {
    this.taskConfig = set(this.taskConfig, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    if (isNotEmpty(this.pageName) && isNotEmpty(this.fanpageLink)) {
      this.$emit('change', newSetting)
    }
  }

  removeSetting() {
    this.$emit('remove')
  }

  get pageName() {
    return this.taskConfig.setting?.page || EMPTY_STRING
  }

  get fanpageLink() {
    return this.taskConfig.setting?.link || EMPTY_STRING
  }
}
</script>

<style scoped></style>
