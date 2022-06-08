<template>
  <v-dialog :value="controller.attachWalletDialog" content-class="rounded overflow-hidden" max-width="500" persistent>
    <v-card>
      <v-card-title> </v-card-title>

      <v-card-text tag="div" class="text-center">
        <v-avatar size="64">
          <v-img class="neutral-20" :src="$_get(controller, 'user.avatar')" alt="Avatar" />
        </v-avatar>
        <div class="font-weight-600 mt-6">Set the attached wallet</div>
        <div>Connect your wallet to continue:</div>

        <div class="d-flex align-center mt-6">
          <app-text-field class="rounded-r-0" hide-details height="45" :value="walletStore.account" readonly />
          <v-btn
            class="px-8 rounded-l-0"
            :class="walletStore.account && 'linear-blue--bg white--text'"
            @click="setWallet"
            :loading="controller.isWalletUpdating"
            :disabled="!walletStore.account"
            height="45"
            depressed
          >
            Set
          </v-btn>
        </div>

        <div class="mt-3">
          <connect-wallet btnClass="fill-width" />
        </div>

        <div class="neutral-10--text mt-3 font-italic">
          *This wallet is used to get reward when participating in Bounty Hunter. And you can edit this address for any
          bounty project!
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
import { authStore } from '@/stores/auth-store'
import { walletStore } from '@/stores/wallet-store'

@Observer
@Component({
  components: {
    'connect-wallet': () => import('@/components/connect-wallet.vue'),
  },
})
export default class AttachWalletDialog extends Vue {
  controller = authStore
  walletStore = walletStore

  setWallet() {
    this.controller.saveAttachWallet(walletStore.account)
  }
}
</script>

<style lang="scss" scoped></style>
