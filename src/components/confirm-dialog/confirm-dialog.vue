<template>
  <v-dialog v-model="controller.dialog" max-width="480px" persistent>
    <v-card class="pb-2 rounded">
      <v-card-title class="text-none">
        {{ controller.config.title }}
        <v-spacer />
        <v-icon @click="controller.cancel">mdi-close</v-icon>
      </v-card-title>
      <v-card-text tag="div" class="my-6">
        <v-icon color="red" class="mr-2" x-large>mdi-alert</v-icon>
        <div class="text-subtitle-1 font-weight-bold mb-0" v-if="controller.config.content">
          {{ controller.config.content }}
        </div>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-show="!controller.config.hideCancel"
          @click="controller.cancel"
          class="rounded text-none btn-text py-5 px-3 mr-4"
          depressed
          outlined
          >{{ controller.config.cancelText || 'Cancel' }}</v-btn
        >
        <v-btn
          v-show="!controller.config.hideDone"
          @click="controller.done"
          class="rounded text-none text-subtitle-2 btn-text py-5 px-3 linear-blue--bg"
          depressed
          color="accent"
          >{{ controller.config.doneText || 'Yes' }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
import { confirmDialogController } from './confirm-dialog-controller'

@Observer
@Component({})
export default class ConfirmDialog extends Vue {
  controller = confirmDialogController
}
</script>

<style></style>
