<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <div class="text-h6 font-weight-bold text-center pa-6">New application</div>
    <v-divider></v-divider>
    <div class="pa-6">
      <div class="d-flex align-center text-h6 font-weight-bold" :class="{ 'neutral10--text': section !== 1 }">
        <v-sheet
          class="d-flex justify-center align-center text-h6 font-weight-bold mr-6"
          :class="section === 1 ? 'blue white--text bg--border' : 'neutral100--bg neutral10--text'"
          width="35"
          height="35"
          outlined
        >
          1
        </v-sheet>
        Application
      </div>
      <div class="d-flex mt-3">
        <v-sheet class="transparent d-flex justify-center" width="35">
          <v-divider vertical></v-divider>
        </v-sheet>
        <div class="pl-6 pb-6">
          <div
            class="cursor-pointer"
            :class="vm.step === 1.1 ? 'blue--text' : 'neutral10--text'"
            @click="vm.changeStep(1.1)"
          >
            Project information
          </div>
          <div
            class="cursor-pointer mt-3"
            :class="vm.step === 1.2 ? 'blue--text' : 'neutral10--text'"
            @click="vm.changeStep(1.2)"
          >
            Token information
          </div>
          <div
            class="cursor-pointer mt-3"
            :class="vm.step === 1.3 ? 'blue--text' : 'neutral10--text'"
            @click="vm.changeStep(1.3)"
          >
            Raising fund information
          </div>
        </div>
      </div>
      <div class="d-flex align-center text-h6 font-weight-bold mt-3" :class="{ 'neutral10--text': section !== 2 }">
        <v-sheet
          class="d-flex justify-center align-center text-h6 font-weight-bold mr-6"
          :class="section === 2 ? 'blue white--text bg--border' : 'neutral100--bg neutral10--text'"
          width="35"
          height="35"
          outlined
        >
          2
        </v-sheet>
        Confirm
      </div>
      <div class="d-flex mt-3">
        <v-sheet class="transparent d-flex justify-center" width="35">
          <v-divider vertical></v-divider>
        </v-sheet>
        <div class="pl-6 pb-6">
          <div
            class="cursor-pointer"
            :class="vm.step === 2.1 ? 'blue--text' : 'neutral10--text'"
            @click="vm.changeStep(2.1)"
          >
            Confirm and pay fee
          </div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { floor } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'
import { BountyFormViewModel } from '../../viewmodels/bounty-form-viewmodel'

@Observer
@Component
export default class ApplicationTimeline extends Vue {
  @Inject() vm!: BountyFormViewModel

  get section() {
    return floor(this.vm.step)
  }
}
</script>

<style scoped lang="scss">
.bg--border {
  border-color: var(--v-background-base) !important;
}
</style>
