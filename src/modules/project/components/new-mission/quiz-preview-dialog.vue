<template>
  <app-dialog ref="dialog" maxWidth="1090" v-slot="{ close }">
    <v-card>
      <v-card-title class="mb-4">
        <span>Preview my quiz </span>
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-card-title>
      <v-card-text tag="div" class="neutral-10--text text-subtitle-1">
        This is the preview of {{ vm.previewSampleSize }} questions randomize from your uploaded file
      </v-card-text>
      <v-card-text tag="div" v-for="(quiz, index) in vm.previewQuiz" :key="quiz.id">
        <div class="text-h6">{{ index + 1 }}.&nbsp;{{ quiz.question }}</div>
        <v-radio-group readonly mandatory :value="quiz.answer">
          <div
            v-for="choice in quiz.choices"
            :key="choice.value"
            class="pa-2 rounded-lg"
            :class="choice.value === quiz.answer && 'green lighten-5'"
          >
            <v-radio color="success" :value="choice.value">
              <template v-slot:label>
                <span :class="choice.value === quiz.answer && 'font-weight-bold'">{{ choice.text }} </span>
              </template>
            </v-radio>
          </div>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </app-dialog>
</template>

<script lang="ts">
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { NewMissionViewModel } from '../../viewmodels/new-mission-viewmodel'

@Component
export default class QuizPreviewDialog extends Vue {
  @Inject() vm!: NewMissionViewModel
  @Ref('dialog') dialog
  open() {
    this.dialog.open()
  }
}
</script>

<style scoped></style>
