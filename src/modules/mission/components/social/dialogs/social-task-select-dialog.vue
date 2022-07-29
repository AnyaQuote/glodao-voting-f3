<template>
  <v-dialog :value="vm.showSelectDialog" max-width="500" @click:outside="vm.updateSelectDialogState(false)">
    <v-card>
      <v-card-title>
        <span>Select telegram task</span>
        <v-spacer />
        <v-icon @click="cancel">mdi-close</v-icon>
      </v-card-title>

      <v-card-text>
        <template v-if="vm.selectedSocial === 'telegram'">
          <v-radio-group v-model="selection">
            <v-sheet
              class="py-2 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in telegram"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="{ socialType: vm.selectedSocial, type: option.type }"
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

        <template v-if="vm.selectedSocial === 'twitter'">
          <v-radio-group v-model="selection">
            <v-sheet
              class="py-4 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in twitter"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="{ socialType: vm.selectedSocial, type: option.type }"
                :label="option.name"
                color="blue-diversity"
                off-icon="mdi-circle-outline"
                on-icon="mdi-check-circle-outline"
              >
              </v-radio>
            </v-sheet>
          </v-radio-group>
        </template>

        <template v-if="vm.selectedSocial === 'facebook'">
          <v-radio-group v-model="selection">
            <v-sheet
              class="py-4 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in facebook"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="{ socialType: vm.selectedSocial, type: option.type }"
                :label="option.name"
                color="blue-diversity"
                off-icon="mdi-circle-outline"
                on-icon="mdi-check-circle-outline"
              >
              </v-radio>
            </v-sheet>
          </v-radio-group>
        </template>

        <template v-if="vm.selectedSocial === 'custom'">
          <v-radio-group v-model="selection">
            <v-sheet
              class="py-4 px-4 mb-2 text-subtitle-2"
              v-for="(option, index) in custom"
              :key="index"
              outlined
              rounded
            >
              <v-radio
                :value="{ socialType: vm.selectedSocial, type: option.type }"
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
          class="flex-grow"
          :class="{ 'linear-blue--bg white--text': !!selection }"
          depressed
          @click="confirm"
          :disabled="!selection"
          >Confirm</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { NewSocialMissionViewModel } from '@/modules/mission/viewmodels/new-social-mission-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class TelegramTaskSelectDialog extends Vue {
  @Inject() vm!: NewSocialMissionViewModel

  selection = ''

  readonly telegram = [
    { type: 'follow', name: 'Join telegram', disabled: false },
    { type: 'comment', name: 'Chat telegram (Comming soon)', disabled: true },
  ]
  readonly twitter = [
    { type: 'follow', name: 'Follow project twitter' },
    { type: 'quote', name: 'Quote a tweet' },
    { type: 'comment', name: 'Like and reply post' },
  ]
  readonly facebook = [{ type: 'follow', name: 'Follow a facebook fanpage' }]
  readonly custom = [{ type: 'custom', name: 'Customie your task' }]

  cancel() {
    this.vm.updateSelectDialogState(false)
    this.selection = ''
  }

  confirm() {
    this.vm.appendSetting(this.selection)
    this.vm.updateSelectDialogState(false)
    this.selection = ''
  }
}
</script>

<style scoped></style>
