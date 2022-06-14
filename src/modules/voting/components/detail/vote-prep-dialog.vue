<template>
  <app-dialog ref="dialog">
    <v-sheet class="dialog-container d-flex flex-column pa-6 neutral-100">
      <div class="d-flex align-center justify-space-between">
        <span class="font-weight-bold text-h6">Cast your vote</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </div>

      <!-- -------------------------------------- PROJECT NAME AND LOGO ------------------------------------------ -->
      <div class="d-flex align-center">
        <v-img max-width="48" aspect-ratio="1" contain src="$_get(vm.poolStore, 'projectLogo')" />
        <span class="ml-2 text-h5 font-weight-bold"> {{ $_get(vm.poolStore, 'projectName') }}</span>
      </div>
      <div class="d-flex align-center">
        <div class="d-flex flex-column justify-center flex-grow-1">
          <div class="text-subtitle-1">Your connected wallet</div>
          <div class="d-flex align-center text-subtitle-1 font-weight-bold">
            <icon-chain />
            <span class="ml-1">{{ walletStore.account | shortAddress(10, 10) }}</span>
          </div>
        </div>
        <v-spacer />
      </div>

      <!-- -------------------------------------- RADIO BUTTON GROUP (YES/NO) -------------------------------------- -->
      <div>
        <v-radio-group mandatory v-model="result">
          <v-sheet class="rounded-lg rounded-b-0 mb-0" :class="{ 'active-bg': result }" outlined>
            <v-radio class="ma-4" :value="true">
              <template v-slot:label>
                <div>
                  <v-chip class="mr-1" color="green">👍YES</v-chip>
                  <span class="text-subtitle-1 font-weight-medium">We want the project to launch</span>
                </div>
              </template>
            </v-radio>
          </v-sheet>

          <v-sheet class="rounded-lg rounded-t-0 mt-0" :class="{ 'active-bg': !result }" outlined>
            <v-radio class="ma-4" :value="false">
              <template v-slot:label>
                <v-chip class="mr-1" color="error">👎NO</v-chip>
                <span class="text-subtitle-1 font-weight-medium">We don't want the project to launch</span>
              </template>
            </v-radio>
          </v-sheet>
        </v-radio-group>
      </div>

      <!-- -------------------------------------- SUBMIT BUTTON ------------------------------------------------------ -->
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
    <!-- ------------------------------------------------------------------------------------------------------------- -->
  </app-dialog>
</template>

<script lang="ts">
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue, Ref, Inject } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../../viewmodels/voting-detail-viewmodel'

@Component({
  components: {
    'icon-chain': () => import('@/assets/icons/icon-chain.vue'),
  },
})
export default class VotePrepDialog extends Vue {
  @Inject() vm!: VotingDetailViewModel
  @Ref('dialog') dialog

  walletStore = walletStore
  result = true
  isLoading = false

  open() {
    this.dialog.open()
  }

  close() {
    !this.isLoading && this.dialog.close()
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  & > div:not(div:first-child) {
    margin-top: em(8);
    margin-bottom: em(8);
  }
  .active-bg {
    background-color: var(--v-blue-2-base) !important;
  }
}
</style>
