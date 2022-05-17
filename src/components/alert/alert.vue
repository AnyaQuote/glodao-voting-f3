<template>
  <v-dialog
    max-width="460px"
    :value="controller.show"
    @input="controller.changeShow"
    scrollable
    :persistent="controller.config && controller.config.persistent"
  >
    <card-hover :disable-hover="true" class="pa-5" :class="$vuetify.theme.dark ? 'primary lighten-2' : 'white'">
      <div class="d-flex justify-space-between align-center">
        <div class="text-medium">{{ controller.config.title }}</div>
        <v-btn icon @click="controller.cancel" small>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="mt-6 mb-5" v-html="controller.config.message"></div>
      <div class="d-flex justify-end mt-2">
        <v-btn
          class="border-radius-8 text-none btn-text py-5"
          color="grey1--text"
          depressed
          outlined
          @click="controller.cancel"
          v-if="controller.config.close"
        >
          {{ controller.config.close }}
        </v-btn>
        <v-btn
          class="border-radius-8 text-none btn-text ml-4 py-5"
          height="42px"
          depressed
          color="primary"
          @click="controller.ok"
        >
          <span>{{ controller.config.ok }}</span>
        </v-btn>
      </div>
    </card-hover>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { alertController } from './alert-controller'
@Component
export default class Alert extends Vue {
  controller = alertController
}
</script>

<style scoped>
.text-medium {
  font-size: 20px;
  font-weight: 600;
}
</style>
