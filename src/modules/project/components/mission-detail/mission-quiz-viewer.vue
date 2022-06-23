<template>
  <div>
    <div v-for="(quiz, index) in data" :key="quiz.id">
      <div class="text-h6">{{ index + 1 }}.&nbsp;{{ quiz.question }}</div>
      <v-radio-group readonly mandatory :value="quiz.answer">
        <div
          v-for="choice in quiz.choices"
          :key="choice.value"
          class="pa-2 rounded-lg"
          :class="choice.value === quiz.answer && 'green lighten-4'"
        >
          <v-radio color="success" :value="choice.value">
            <template v-slot:label>
              <span class="neutral-10--text" :class="choice.value === quiz.answer && 'font-weight-bold black--text'">
                {{ choice.text }}
              </span>
            </template>
          </v-radio>
        </div>
      </v-radio-group>
    </div>
  </div>
</template>

<script lang="ts">
import { PreviewQuiz } from '@/models/QuizModel'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MissionQuizViewer extends Vue {
  @Prop({ required: true }) data!: PreviewQuiz[]
}
</script>

<style scoped></style>
