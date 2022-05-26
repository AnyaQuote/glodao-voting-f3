<template>
  <app-dialog ref="dialog">
    <v-sheet class="dialog-container d-flex flex-column pa-6 neutral-100">
      <div class="d-flex align-center justify-space-between">
        <span class="font-weight-bold text-h6">Cast your vote</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </div>
      <div class="d-flex align-center">
        <v-img max-width="48" aspect-ratio="1" contain src="@/assets/icons/voting-trending--logo.png" />
        <span class="ml-2 text-h5 font-weight-bold">Dragon Gaming</span>
      </div>
      <div class="d-flex align-center">
        <div class="d-flex flex-column justify-center flex-grow-1">
          <div class="text-subtitle-1">Your connected wallet</div>
          <div class="d-flex align-center text-subtitle-1 font-weight-bold">
            <icon-chain />
            <span class="ml-1">{{ walletStore.shortAccount }}</span>
          </div>
        </div>
        <div>
          <v-sheet outlined class="rounded d-flex align-center pa-3">
            <span class="mr-1">TRIBE</span>
            <v-icon>mdi-fingerprint</v-icon>
          </v-sheet>
        </div>
        <v-spacer />
      </div>
      <div>
        <v-radio-group v-model="result">
          <v-sheet class="blue lighten-4 rounded-lg rounded-b-0 mb-0" outlined>
            <v-radio class="ma-4" value="yes">
              <template v-slot:label>
                <div>
                  <v-chip class="mr-1" color="green">👍YES</v-chip>
                  <span class="text-subtitle-1 font-weight-medium">We want the project to launch</span>
                </div>
              </template>
            </v-radio>
          </v-sheet>

          <v-sheet class="rounded-lg rounded-t-0 mt-0" outlined>
            <v-radio class="ma-4" value="no">
              <template v-slot:label>
                <v-chip class="mr-1" color="error">👎NO</v-chip>
                <span class="text-subtitle-1 font-weight-medium">We don't want the project to launch</span>
              </template>
            </v-radio>
          </v-sheet>
        </v-radio-group>
      </div>
      <div class="d-flex flex-column">
        <span>*By voting, you will burn 0.002 GLD in your staked</span>
      </div>
      <div>
        <v-btn
          block
          class="linear-blue--bg white--text font-weight-bold text-none"
          depressed
          @click="$emit('openConfirmDialog', result)"
        >
          Cast vote
        </v-btn>
      </div>
    </v-sheet>
  </app-dialog>
</template>

<script lang="ts">
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue, Ref } from 'vue-property-decorator'

@Component({
  components: {
    'icon-chain': () => import('@/assets/icons/icon-chain.vue'),
  },
})
export default class VotePrepDialog extends Vue {
  @Ref('dialog') dialog
  walletStore = walletStore
  result = 'yes'

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
  }
}
</style>
