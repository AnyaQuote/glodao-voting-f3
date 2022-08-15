<template>
  <div>
    <!-- --------------------------- DYNAMIC TASK ------------------------------- -->
    <div v-for="(task, index) in tasks" :key="index">
      <div class="d-flex" :class="{ 'mt-6': index > 0 }">
        <v-sheet width="79" height="79" class="rounded-lg blue-2 d-flex">
          <span class="ma-auto font-weight-bold text-h4">{{ index + 1 }}</span>
        </v-sheet>
        <div class="flex-grow-1 ml-4">
          <div class="mb-2 font-weight-bold d-flex justify-space-between">
            <span>Task name<span class="red--text">*</span></span>
            <v-icon v-show="index !== 0" @click="removeTaskAt(index)">mdi-close</v-icon>
          </div>
          <app-text-field
            :key="index"
            height="45"
            :rules="rules"
            placeholder="Enter task name"
            :value="task.context"
            @change="onTaskChange(index, 'context', $event)"
          />
        </div>
      </div>
      <v-divider class="dashed-border mt-2" />
    </div>

    <!-- --------------------------- ADD TASK BUTTON ------------------------------- -->
    <v-sheet
      class="d-flex py-4 mt-7 align-center justify-center"
      :class="{ 'neutral-20--text': maxTasksReached, 'cursor-pointer': !maxTasksReached }"
      @click="addTask"
      rounded="lg"
      outlined
      v-ripple="!maxTasksReached"
    >
      <v-icon :class="{ 'neutral-20--text': maxTasksReached }">mdi-plus-circle-outline</v-icon>
      <div class="text-subtitle-1 font-weight-600 line-height-1 ml-3">Add more tasks. Maximum is 5 tasks</div>
    </v-sheet>
    <!-- --------------------------------------------------------------------------- -->
  </div>
</template>

<script lang="ts">
import { MAX_IN_APP_TRIAL_TASKS } from '@/constants'
import { InAppTrialTask } from '@/models/MissionModel'
import { set } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

const defaultProp = () => []

@Observer
@Component
export default class InAppTrialTaskCollector extends Vue {
  @Prop({ default: defaultProp }) value!: InAppTrialTask[] | null
  @Prop({ default: defaultProp }) rules!: any[]

  tasks: InAppTrialTask[] = []

  mounted() {
    if (this.value?.length) {
      this.tasks = this.value
    } else this.tasks = [{ context: '' }]
  }

  addTask() {
    if (this.tasks.length < MAX_IN_APP_TRIAL_TASKS) {
      const newTask = { context: '' }
      this.tasks = [...this.tasks, newTask]
    }
  }

  onTaskChange(position: number, property: string, value: string) {
    this.tasks = set(this.tasks, `[${position}].${property}`, value)
    this.$emit('onChange', this.tasks)
  }

  removeTaskAt(position: number) {
    const updatedTasks = this.tasks.filter((_, index) => index !== position)
    this.tasks = updatedTasks
  }

  get maxTasksReached() {
    return this.tasks?.length === MAX_IN_APP_TRIAL_TASKS
  }
}
</script>

<style scoped></style>
