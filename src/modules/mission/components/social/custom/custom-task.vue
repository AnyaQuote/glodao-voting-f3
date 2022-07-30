<template>
  <expand-container
    class="mt-4"
    type="custom"
    title="Custom task"
    subtitle="Customize your task"
    @remove="removeSetting"
  >
    <div class="font-18 font-weight-bold mt-2">Task name<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="taskName"
      :rules="[$rules.required]"
      placeholder="Enter your task name"
      @change="updateConfig('setting.name', $event)"
    />

    <div class="font-18 font-weight-bold mt-2">Task description<span class="red--text">*</span></div>
    <app-textarea
      class="mt-2"
      :value="description"
      :rules="[$rules.required]"
      placeholder="Describe your custom task"
      @change="updateConfig('setting.description', $event)"
    />

    <div class="font-18 font-weight-bold mt-2">Task link<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="hiddenLink"
      append-icon="mdi-link"
      placeholder="Enter your link"
      :rules="[$rules.url, $rules.required]"
      @change="updateConfig('setting.link', $event)"
    />
  </expand-container>
</template>

<script lang="ts">
import { CUSTOM_TASK_TYPE_DEFAULT_CONFIG, EMPTY_STRING } from '@/constants'
import { isNotEmpty } from '@/helpers'
import { TaskConfig } from '@/models/MissionModel'
import { isEmpty } from 'lodash-es'
import { set } from 'mobx'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'expand-container': () => import('../../common/expand-container.vue'),
  },
})
export default class CutstomTask extends Vue {
  @Prop() inputConfig!: TaskConfig

  taskConfig = isEmpty(this.inputConfig) ? CUSTOM_TASK_TYPE_DEFAULT_CONFIG : this.inputConfig

  updateConfig(property: string, value: string) {
    this.taskConfig = set(this.taskConfig, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    if (isNotEmpty(this.taskName) && isNotEmpty(this.hiddenLink) && isNotEmpty(this.description)) {
      this.$emit('change', newSetting)
    }
  }

  removeSetting() {
    this.$emit('remove')
  }

  get taskName() {
    return this.taskConfig.setting?.name || EMPTY_STRING
  }

  get description() {
    return this.taskConfig.setting?.description || EMPTY_STRING
  }

  get hiddenLink() {
    return this.taskConfig.setting?.link || EMPTY_STRING
  }
}
</script>

<style scoped></style>
