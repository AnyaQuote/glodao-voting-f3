<template>
  <v-dialog :value="controller.attachWalletDialog" content-class="rounded overflow-hidden" max-width="500" persistent>
    <v-card>
      <v-card-title>
        <v-spacer />
        <v-icon @click="controller.changeAttachWalletDialog(false)">mdi-close</v-icon>
      </v-card-title>
      <v-avatar size="64">
        <v-img :src="$_get(controller, 'user.avatar')" alt="Avatar" />
      </v-avatar>
      <v-card-text tag="div" class="text-center">
        <div class="font-weight-600">Set the attached wallet</div>
        <div>Connect your wallet to continue:</div>

        <app-text-field class="rounded-r-0 mt-6" hide-details :value="walletStore.account" readonly>
          <template v-slot:append>
            <v-btn
              class="px-8"
              @click="controller.saveAttachWallet"
              :loading="controller.isWalletUpdating"
              :disabled="!walletStore.account"
            >
              Set
            </v-btn>
          </template>
        </app-text-field>

        <div class="mt-3">
          <connect-wallet btnClass="fill-width" />
        </div>

        <div class="neutral10--text mt-3 font-italic">
          *This wallet is used to get reward when participating in Bounty Hunter. And you can edit this address for any
          bounty project!
        </div>
      </v-card-text>

      <!-- <v-sheet outlined class="d-flex align-center justify-center mt-4 pa-1 neutral100--bg rounded"> -->
      <!-- <v-text-field
          hide-details
          dense
          placeholder="Your wallet address"
          flat
          solo
          class="neutral100--bg link-submit-custom-input"
          @input="controller.changeWalletDialogInput"
          :value="walletStore.account"
          readonly
        > -->
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
}
</script>

<style lang="scss" scoped>
.dialog-normal-text {
  font-size: 14px;
  line-height: 20px;
}
.dialog-btn {
  text-transform: unset;
  width: 100%;
}
.close-icon {
  position: absolute;
  top: 0;
  right: 0;
}
.v-btn--disabled {
  background-image: none;
}
</style>
