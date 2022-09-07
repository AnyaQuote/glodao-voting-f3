<template>
  <v-dialog :value="vm.showSelectDialog" max-width="500" @click:outside="vm.updateSelectDialogState(false)">
    <v-card>
      <v-card-title>
        <span>Select {{ vm.selectedSocialType }} task</span>
        <v-spacer />
        <v-icon @click="cancel">mdi-close</v-icon>
      </v-card-title>

      <v-card-text>
        <template v-if="vm.selectedSocialType === SocialType.TELEGRAM">
          <v-radio-group v-model="selectedTaskType">
            <v-sheet
              class="py-2 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in telegramOptions"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="option.type"
                :label="option.name"
                :disabled="option.disabled"
                color="blue-diversity"
                off-icon="mdi-circle-outline"
                on-icon="mdi-check-circle-outline"
              >
              </v-radio>
            </v-sheet>
          </v-radio-group>
        </template>

        <template v-if="vm.selectedSocialType === SocialType.TWITTER">
          <v-radio-group v-model="selectedTaskType">
            <v-sheet
              class="py-4 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in twitterOptions"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="option.type"
                :label="option.name"
                color="blue-diversity"
                off-icon="mdi-circle-outline"
                on-icon="mdi-check-circle-outline"
              >
              </v-radio>
            </v-sheet>
          </v-radio-group>
        </template>

        <template v-if="vm.selectedSocialType === SocialType.DISCORD">
          <v-radio-group v-model="selectedTaskType">
            <v-sheet
              class="py-4 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in discordOptions"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="option.type"
                :label="option.name"
                color="blue-diversity"
                off-icon="mdi-circle-outline"
                on-icon="mdi-check-circle-outline"
              >
              </v-radio>
            </v-sheet>
          </v-radio-group>
        </template>

        <template v-if="vm.selectedSocialType === SocialType.FACEBOOK">
          <v-radio-group v-model="selectedTaskType">
            <v-sheet
              class="py-4 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in facebookOptions"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="option.type"
                :label="option.name"
                color="blue-diversity"
                off-icon="mdi-circle-outline"
                on-icon="mdi-check-circle-outline"
              >
              </v-radio>
            </v-sheet>
          </v-radio-group>
        </template>

        <template v-if="vm.selectedSocialType === SocialType.CUSTOM">
          <v-radio-group v-model="selectedTaskType">
            <v-sheet
              class="py-4 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in customOptions"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="option.type"
                :label="option.name"
                color="blue-diversity"
                off-icon="mdi-circle-outline"
                on-icon="mdi-check-circle-outline"
              >
              </v-radio>
            </v-sheet>
          </v-radio-group>
        </template>
      </v-card-text>

      <v-card-actions>
        <v-btn class="flex-grow" outlined @click="cancel">Cancel</v-btn>
        <div class="mx-2" />
        <v-btn
          :class="{ 'linear-blue--bg white--text': !!selectedTaskType }"
          :disabled="!selectedTaskType"
          class="flex-grow"
          @click="confirm"
          depressed
          >Confirm</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { EMPTY_STRING } from '@/constants'
import { SocialTaskType, SocialType } from '@/models/MissionModel'
import { NewSocialMissionViewModel } from '@/modules/mission/viewmodels/new-social-mission-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class TelegramTaskSelectDialog extends Vue {
  @Inject() vm!: NewSocialMissionViewModel

  readonly SocialType = SocialType

  readonly telegramOptions = [
    { type: SocialTaskType.FOLLOW, name: 'Join telegram', disabled: false },
    { type: SocialTaskType.COMMENT, name: 'Chat telegram (Comming soon)', disabled: true },
  ]
  readonly twitterOptions = [
    { type: SocialTaskType.FOLLOW, name: 'Follow project twitter' },
    { type: SocialTaskType.QUOTE, name: 'Quote a tweet' },
    { type: SocialTaskType.COMMENT, name: 'Reply post' },
    { type: SocialTaskType.LIKE, name: 'Like Tweet' },
    { type: SocialTaskType.RETWEET, name: 'Retweet post' },
  ]
  readonly discordOptions = [{ type: SocialTaskType.JOIN_SERVER, name: 'Join discord group' }]
  readonly facebookOptions = [{ type: SocialTaskType.FOLLOW, name: 'Follow a facebook fanpage' }]
  readonly customOptions = [{ type: SocialTaskType.CUSTOM, name: 'Customie your task' }]

  selectedTaskType = EMPTY_STRING

  cancel() {
    this.vm.updateSelectDialogState(false)
    this.selectedTaskType = EMPTY_STRING
  }

  confirm() {
    this.vm.appendSetting(this.vm.selectedSocialType, this.selectedTaskType)
    this.vm.updateSelectDialogState(false)
    this.selectedTaskType = EMPTY_STRING
  }
}
</script>

<style scoped></style>
