<template>
  <v-sheet class="rounded-lg" style="box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2)" outlined>
    <div>
      <v-img class="rounded-t-lg" :src="require(`@/assets/images/${project.image}`)" width=""></v-img>
    </div>
    <div class="pa-6">
      <div class="text-h5 font-weight-bold mb-2">{{ project.name }} {{ index && `#${index}` }}</div>
      <div class="text-subtitle-1">
        <div class="d-flex justify-space-between mb-2">
          <div class="neutral10--text">Total reward</div>
          <div class="font-weight-600">{{ project.totalReward }}</div>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <div class="neutral10--text">Priority reward</div>
          <div class="font-weight-600">{{ project.priorityReward }}</div>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <div class="neutral10--text">Start time</div>
          <div class="font-weight-600">{{ project.start }}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="neutral10--text">End time</div>
          <div class="font-weight-600">{{ project.end }}</div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Prop() project!: any
  @Prop() index?: string
}
</script>

<style scoped></style>
