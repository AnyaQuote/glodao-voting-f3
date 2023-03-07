<template>
  <expand-container
    class="mt-4"
    type="telegram"
    title="Telegram task"
    subtitle="Chat in group (Comming soon)"
    @remove="removeSetting"
  >
    <div class="font-18 font-weight-bold">Telegram group name<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="pageName"
      :rules="[$rules.required]"
      placeholder="GLODAO Channel"
      @change="updateSetting('setting.page', $event)"
    />

    <div class="font-18 font-weight-bold">Telegram group link<span class="red--text">*</span></div>
    <app-text-field
      :value="telegramLink"
      append-icon="mdi-link"
      :rules="[$rules.required, $rules.url]"
      placeholder="https://t.me/GloDAO_Group"
      @change="updateSetting('setting.link', $event)"
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
    'expand-container': () => import('../expand-container.vue'),
  },
})
export default class TelegramChatTask extends Vue {
  @Prop({ required: true }) inputConfig!: TaskConfig

  taskConfig = this.inputConfig

  updateConfig(property: string, value: string) {
    if (property === 'setting.link') {
      set(this.taskConfig, 'setting.embedLink', value)
    }
    this.taskConfig = set(this.taskConfig, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    if (isNotEmpty(this.pageName) && isNotEmpty(this.telegramLink)) {
      this.$emit('change', newSetting)
    }
  }

  removeSetting() {
    this.$emit('remove')
  }

  get pageName() {
    return this.taskConfig.setting?.page || EMPTY_STRING
  }

  get telegramLink() {
    return this.taskConfig!.setting?.link || EMPTY_STRING
  }
}
</script>

<style scoped></style>
