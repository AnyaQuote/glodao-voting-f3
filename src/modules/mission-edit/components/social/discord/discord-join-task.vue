<template>
  <expand-container
    class="mt-4"
    type="discord"
    title="Discord task"
    subtitle="Join discord group"
    @remove="removeSetting"
  >
    <div class="font-18 font-weight-bold">Discord group name<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="groupName"
      :rules="[$rules.required]"
      placeholder="GloDao Group"
      @change="updateSetting('setting.page', $event)"
    />

    <div class="font-18 font-weight-bold">Paste your discord invite link<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="inviteLink"
      append-icon="mdi-link"
      :rules="[$rules.required, $rules.url]"
      @change="updateSetting('setting.link', $event)"
      placeholder="https://discord.gg/glodao"
    />

    <div class="font-18 font-weight-bold">Enter discord Server ID<span class="red--text">*</span></div>
    <app-text-field
      class="mt-2"
      :value="guildId"
      append-icon="mdi-link"
      :rules="[$rules.required]"
      @change="updateSetting('setting.guildId', $event)"
      placeholder="884467360076013588"
    />
    <div class="font-18 text-subtitle-2 font-weight-regular red--text">
      <i
        >*For discord mission, you need to add
        <a
          class="blue-diversity--text text-decoration-underline"
          href="https://discord.com/oauth2/authorize?client_id=986822287258947624&scope=bot&permissions=0"
          >@bounty_mission_bot
        </a>
        to your server
      </i>
    </div>
    <!-- <v-btn class="linear-blue--bg white--text mt-2" depressed :loading="isChecking" @click="handleValidation"
      >Check bot is added</v-btn
    > -->
    <div class="text-subtitle-2">How to get discord server ID:</div>
    <div class="text-subtitle-2 font-weight-regular">
      1. Go to discord <v-icon size="18">mdi-cog</v-icon> <strong>User Settings</strong> > <strong>Advanced</strong> and
      enable <strong>Developer Mode</strong><br />
      2. Find your discord server logo on the discord side bar, right click and select <strong>Copy ID</strong> option
      to get your server Id
    </div>
  </expand-container>
</template>

<script lang="ts">
// import { appProvider } from '@/app-providers'
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
export default class TelegramJoinTask extends Vue {
  @Prop({ required: true }) inputConfig!: TaskConfig

  taskConfig = this.inputConfig

  updateSetting(property: string, value: string) {
    this.taskConfig = set(this.taskConfig!, property, value)
  }

  @Watch('taskConfig', { deep: true })
  onSettingUpdated(newSetting: TaskConfig) {
    if (isNotEmpty(this.groupName) && isNotEmpty(this.inviteLink) && isNotEmpty(this.guildId)) {
      this.$emit('change', newSetting)
    }
  }

  removeSetting() {
    this.$emit('remove')
  }

  get groupName() {
    return this.taskConfig!.setting?.page || EMPTY_STRING
  }

  get inviteLink() {
    return this.taskConfig!.setting?.link || EMPTY_STRING
  }

  get guildId() {
    return this.taskConfig!.setting?.guildId || EMPTY_STRING
  }
}
</script>

<style scoped></style>
