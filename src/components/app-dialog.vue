<template>
  <v-dialog persistent max-width="500" :value="show" @click:outside="close">
    <slot></slot>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AppDialog extends Vue {
  private show = false
  private request = 0

  increaseRequest() {
    this.request++
  }

  decreaseRequest() {
    this.request--
  }

  open() {
    this.show = true
  }

  close() {
    if (!this.requesting) {
      this.show = false
    }
  }

  get requesting() {
    return this.request > 0
  }
}
</script>

<style scoped></style>
