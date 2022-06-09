<template>
  <v-dialog :value="controller.show" content-class="rounded" max-width="500">
    <v-card>
      <v-card-title>
        <v-spacer />
        <v-icon v-if="controller.config.canClose" @click="controller.close">mdi-close</v-icon>
      </v-card-title>

      <v-card-text tag="div" class="text-center">
        <v-avatar size="64">
          <v-img class="neutral-20" :src="controller.userAvatar" alt="Avatar" />
        </v-avatar>
        <div class="font-weight-600 mt-6">Set the attached wallet</div>
        <div>Connect your wallet to continue:</div>

        <div class="d-flex align-center mt-6">
          <app-text-field
            class="rounded-r-0"
            placeholder="...Waiting wallet to connect"
            hide-details
            height="45"
            :value="controller.connectedAddress"
            readonly
          />
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
          <connect-wallet height="45" btnClass="fill-width" />
        </div>

        <div class="neutral-10--text mt-3 font-italic">
          *This wallet is used to get reward when participating in Bounty Hunter. And you can edit this address for any
          bounty project!
        </div>
      </v-card-text>
      <v-card-text tag="div" v-if="controller.config.message" class="error--text text-center">
        {{ controller.config.message }}
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
