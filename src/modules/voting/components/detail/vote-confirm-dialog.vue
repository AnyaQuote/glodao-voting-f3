<template>
  <app-dialog ref="dialog">
    <v-sheet class="dialog-container d-flex flex-column pa-6 neutral-100">
      <div class="d-flex justify-space-between align-center">
        <div class="text-h6">Confirm your vote</div>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="d-flex flex-column">
        <div class="d-flex flex-column justify-center flex-grow-1">
          <div class="text-subtitle-1">Your connected wallet</div>
          <div class="d-flex align-center text-subtitle-1 font-weight-bold">
            <span class="ml-1">{{ walletStore.account }}</span>
          </div>
        </div>

        <span class="mt-2">Voting for</span>
        <div class="d-flex align-center" v-if="voteResult === 'yes'">
          <v-chip label class="rounded-lg white--text" color="green">👍 YES</v-chip>
          <span class="ml-2 text-body-1 font-weight-bold">We want the project to launch </span>
        </div>
        <div class="d-flex align-center" v-else>
          <v-chip label class="rounded-lg white--text" color="error">👎NO</v-chip>
          <span class="ml-2 text-body-1 font-weight-bold">We don't want the project to launch </span>
        </div>
      </div>

      <!-- <div v-if="vm.stakeBalanceInsufficient" class="error--text text-center">Stake Balance insufficient!</div> -->
      <!-- <div class="d-flex flex-column">
        <v-btn
          class="white--text font-weight-bold text-none"
          :class="!vm.stakeBalanceInsufficient && 'linear-blue--bg'"
          depressed
          @click="vote"
          :disabled="vm.stakeBalanceInsufficient"
          :loading="dialog && dialog.requesting"
          >Confirm</v-btn
        >
        <v-btn
          class="text-none mt-4"
          color="blue"
          @click="close"
          :disabled="dialog && dialog.requesting"
          outlined
          depressed
          >Cancel</v-btn
        >
      </div> -->
    </v-sheet>
  </app-dialog>
</template>

<script lang="ts">
import { appProvider } from '@/app-providers'
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue, Ref, Prop, Inject } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../../viewmodels/voting-detail-viewmodel'

@Component
export default class VoteConfirmDialog extends Vue {
  @Ref('dialog') dialog
  @Prop({ default: 'yes' }) voteResult
  @Inject() vm!: VotingDetailViewModel

  staked = true
  walletStore = walletStore

  open() {
    this.dialog.open()
  }
  close() {
    this.dialog.close()
  }

  async vote() {
    this.dialog.increaseRequest()
    try {
      // await this.vm.vote()
      this.dialog.decreaseRequest()
      this.close()
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.dialog.decreaseRequest()
    }
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
