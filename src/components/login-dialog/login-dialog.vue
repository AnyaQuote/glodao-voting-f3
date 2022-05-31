<template>
  <v-dialog :value="controller.show" max-width="480px">
    <v-card class="neutral100--bg" outlined>
      <v-card-title class="text-none">
        <v-spacer />
        <v-icon v-show="!controller.config.hideClose" @click="controller.close">mdi-close</v-icon>
      </v-card-title>
      <v-card-title> Please sign in with your wallet</v-card-title>
      <v-card-text class="red--text">{{ controller.config.message }}</v-card-text>
      <v-card-text>
        Remember that this wallet will be the pool owner's address. Only the pool owner can update pool information.
      </v-card-text>
      <v-card-text>
        <span class="font-weight-bold">Your wallet address:</span>
        <v-sheet height="54" class="rounded text-subtitle-1 text-truncate pa-3 text-center" outlined>{{
          controller.address
        }}</v-sheet>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="linear-blue--bg white--text mb-2"
          :loading="controller.loading"
          @click="controller.confirm"
          depressed
          block
        >
          Sign message
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { loginController } from './login-dialog-controller'
@Component
export default class LoginDialog extends Vue {
  controller = loginController
  beforeDestroy() {
    this.controller.destroy()
  }
}
</script>

<style scoped></style>
