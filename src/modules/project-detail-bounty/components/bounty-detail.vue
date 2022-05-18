<template>
  <div style="height: 124px" class="rounded-lg blue lighten-1 pa-6 d-flex justify-space-between">
    <div class="d-flex align-stretch">
      <v-sheet height="76" width="76" color="pa-2 mr-6 d-flex align-center justify-center white rounded">
        <v-img :src="require(`@/assets/icons/voting-trending--logo.png`)" width="100%"></v-img>
      </v-sheet>
      <div class="d-flex flex-column justify-center">
        <div class="text-h5 font-weight-bold mb-1">Dragon Gaming</div>
        <div class="font-weight-bold neutral10--text d-flex align-center">
          <div class="text-h6 font-weight-bold mr-1">$SB</div>
          <div
            style="height: 24px; width: 74px"
            class="green lighten-1 neutral100--text d-flex align-center justify-center rounded-pill font-weight-regular text-caption"
          >
            Approve
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex align-center">
      <div style="width: 162px">
        <div class="neutral0--text">Total misstion</div>
        <div class="text-h6 font-weight-bold">100</div>
      </div>
      <div style="width: 162px">
        <div class="neutral0--text">Total reward</div>
        <div class="text-h6 font-weight-bold">1000 BUSD</div>
      </div>
      <v-btn width="162" height="48" class="linear-blue--bg neutral100--text text-subtitle-1 text-none" elevation="0">
        Create misstion
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {}
</script>

<style scoped></style>
