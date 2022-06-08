<template>
  <v-dialog :value="controller.show" content-class="rounded" max-width="500" persistent>
    <v-card>
      <v-card-title> </v-card-title>

      <v-card-text tag="div" class="text-center">
        <v-avatar size="64">
          <v-img class="neutral-20" :src="controller.authUser" alt="Avatar" />
        </v-avatar>
        <div class="font-weight-600 mt-6">Set the attached wallet</div>
        <div>Connect your wallet to continue:</div>

        <div class="d-flex align-center mt-6">
          <app-text-field class="rounded-r-0" hide-details height="45" :value="controller.connectedAddress" readonly />
          <v-btn
            class="px-8 rounded-l-0"
            :class="controller.connectedAddress && 'linear-blue--bg white--text'"
            @click="controller.setAddress"
            :loading="controller.isUpdating"
            :disabled="!controller.connectedAddress"
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
import { attachWalletDialogController } from './attach-wallet-dialog-controller'

@Observer
@Component
export default class AttachWalletDialog extends Vue {
  controller = attachWalletDialogController
}
</script>

<style lang="scss" scoped></style>
