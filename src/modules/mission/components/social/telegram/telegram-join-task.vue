<template>
  <expand-container
    class="mt-4"
    type="telegram"
    title="Telegram task"
    subtitle="Join telegram group"
    @remove="removeSetting"
  >
    <div class="font-18 font-weight-bold">Telegram group name<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="$_get(taskConfig, 'setting.page')"
      :rules="[$rules.required]"
      placeholder="GLODAO Channel"
      @change="updateSetting('setting.page', $event)"
    />

    <div class="font-18 font-weight-bold">Telegram group link<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      append-icon="mdi-link"
      :value="$_get(taskConfig, 'setting.link')"
      :rules="[$rules.required, $rules.url]"
      @change="updateSetting('setting.link', $event)"
      placeholder="https://t.me/GloDAO_Group"
    />

    <div class="font-18 text-subtitle-2 font-weight-regular red--text">
      <i
        >*For telegram mission, you need to add
        <a class="blue-diversity--text text-decoration-underline" :href="`https://t.me/${telegramBot}`"
          >@{{ telegramBot }}
        </a>
        to your channel/group
      </i>
    </div>
    <v-btn class="linear-blue--bg white--text mt-2" depressed :loading="isChecking" @click="handleValidation"
      >Check bot is added</v-btn
    >
  </expand-container>
</template>

<script lang="ts">
import { appProvider } from '@/app-providers'
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
export default class TelegramJoinTask extends Vue {
  @Prop({ required: true }) inputConfig!: TaskConfig

  private snackbar = appProvider.snackbar
  private api = appProvider.api

  taskConfig = this.inputConfig
  isChecking = false
  telegramBot = process.env.VUE_APP_TELEGRAM_BOT_NAME

  updateSetting(property: string, value: string) {
    this.taskConfig = set(this.taskConfig!, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    const link = this.taskConfig.setting?.link
    const pageName = this.taskConfig.setting?.page
    if (isNotEmpty(pageName) && isNotEmpty(link)) {
      this.$emit('change', newSetting)
    }
  }

  removeSetting() {
    this.$emit('remove')
  }

  async handleValidation() {
    try {
      this.isChecking = true
      const link = this.taskConfig.setting?.link
      if (!link) {
        this.snackbar.error('Link is empty')
        return
      }
      const isValid = await this.api.checkTelegramBotIsAdded(link)
      if (isValid) {
        this.snackbar.success('Glodao mission bot is added in your channel/group')
      }
    } catch (error) {
      this.snackbar.commonError(error)
    } finally {
      this.isChecking = false
    }
  }
}
</script>

<style scoped></style>
