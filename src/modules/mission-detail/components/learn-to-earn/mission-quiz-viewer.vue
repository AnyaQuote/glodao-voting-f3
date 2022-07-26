<template>
  <div v-if="noContent">
    <div v-for="i in 3" :key="i">
      <v-skeleton-loader boilerplate type="text" class="mt-10" />
      <v-skeleton-loader boilerplate type="text" class="pl-10 mt-2" />
      <v-skeleton-loader boilerplate type="text" class="pl-10 mt-2" />
      <v-skeleton-loader boilerplate type="text" class="pl-10 mt-2" />
      <v-skeleton-loader boilerplate type="text" class="pl-10 mt-2" />
    </div>
  </div>
  <div v-else>
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
import { isEmpty } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MissionQuizViewer extends Vue {
  @Prop({ required: true }) data!: PreviewQuiz[]
  noContent = false
  mounted() {
    if (isEmpty(this.data)) {
      this.noContent = true
    }
  }
}
</script>

<style scoped></style>
