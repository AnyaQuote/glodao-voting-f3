<template>
  <v-sheet outlined rounded="lg" elevation="3">
    <div class="text-center py-5 text-h6 font-weight-bold">New Mission</div>
    <v-divider />
    <div class="py-7 px-auto d-flex flex-column ml-5">
      <!-- STEP 1 -->
      <div class="d-flex text-h6 neutral-10--text font-weight-bold mb-8">
        <v-sheet class="blue-diversity white--text text-center" width="35" height="35" outlined rounded="lg">
          1
        </v-sheet>
        <span class="ml-2">Mission infor</span>
      </div>
      <!-- STEP 2 -->
      <div class="d-flex text-h6 neutral-10--text font-weight-bold mb-8">
        <v-sheet class="text-center neutral-10--text" width="35" height="35" outlined rounded="lg">2</v-sheet>
        <span class="ml-2">App infor</span>
      </div>
      <!-- STEP 3 -->
      <div class="d-flex text-h6 neutral-10--text font-weight-bold mb-8">
        <v-sheet class="text-center neutral-10--text" outlined rounded="lg" width="35" height="35">3</v-sheet>
        <span class="ml-2">Task setting</span>
      </div>
      <!-- ------ -->
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'

@Observer
@Component
export default class MissionSteppers extends Vue {}
</script>

<style scoped></style>
