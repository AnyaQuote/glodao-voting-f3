<template>
  <glodao-dialog ref="dialog">
    <v-sheet class="dialog-container d-flex flex-column pa-6">
      <div class="d-flex justify-space-between align-center">
        <div class="text-h6">Confirm your vote</div>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="d-flex flex-column">
        <span>Voting for</span>
        <div class="d-flex align-center">
          <v-chip label class="rounded-lg white--text" color="green">👍 YES</v-chip>
          <span class="ml-2 text-body-1 font-weight-bold">We want the project to launch </span>
        </div>
      </div>
      <div class="d-flex flex-column align-start">
        <span>Your voting power</span>
        <v-sheet outlined class="rounded d-flex align-center pa-3">
          <span class="mr-1">TRIBE</span>
          <v-icon>mdi-fingerprint</v-icon>
        </v-sheet>
      </div>
      <div v-if="staked" class="d-flex flex-column">
        <span>GLD burn amount</span>
        <div class="d-flex align-center">
          <v-avatar size="24" class="mr-1">
            <v-img src="@/assets/icons/icon-glodao.svg" />
          </v-avatar>
          <span class="font-weight-bold text-h5">0.02 GLD</span>
        </div>
      </div>
      <v-sheet v-else outlined class="error-border pa-4 rounded-lg d-flex align-start">
        <v-icon color="error" class="mr-2 mt-1">mdi-information-outline</v-icon>
        <div class="font-weight-bold">
          Stake some GLD in your wallet at the snapshot block to get voting power for projects.
        </div>
      </v-sheet>
      <div class="d-flex flex-column">
        <v-btn class="btnA white--text text-none mb-2" depressed>Confirm</v-btn>
        <v-btn class="text-none" color="blue" @click="close" outlined depressed>Cancel</v-btn>
      </div>
    </v-sheet>
  </glodao-dialog>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

@Component
export default class VoteConfirmDialog extends Vue {
  @Ref('dialog') dialog

  staked = false

  open() {
    this.dialog.open()
  }
  close() {
    this.dialog.close()
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  & > div:not(div:first-child) {
    margin-top: em(8);
    margin-bottom: em(8);
    & > span {
      color: var(--v-bluePrimary-base);
      font-weight: 500;
      margin-bottom: em(4);
    }
  }
  .error-border {
    border-color: var(--v-error-base);
  }
}
</style>
