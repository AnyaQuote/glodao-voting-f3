<template>
  <v-snackbar
    :value="controller.show"
    @input="controller.close()"
    :color="controller.config.color"
    :timeout="controller.config.timeout"
    min-width="375px"
    top
    class="plugin__alert"
  >
    <div class="message-text d-flex align-center">
      <v-icon class="mr-3">{{ controller.config.icon }}</v-icon>
      <div v-html="controller.config.message"></div>
    </div>
    <template v-slot:action="{ attrs }">
      <v-btn icon text v-bind="attrs" @click="controller.close()"><v-icon>mdi-close</v-icon></v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { snackController } from './snack-bar-controller'
@Component
export default class SnackBar extends Vue {
  controller = snackController
}
</script>

<style scoped>
.message-text {
  font-style: normal;
  font-weight: 700 !important;
  font-size: 18px !important;
  line-height: 130%;
}
</style>
