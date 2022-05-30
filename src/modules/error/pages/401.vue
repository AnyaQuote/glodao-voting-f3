<template>
  <v-container class="fill-height">
    <div class="d-flex justify-center align-center fill-height fill-width text-center">
      <div class="text-center">
        <div class="text-h1">401</div>
        <div class="primary--text font-weight-bold text-h6 mt-2">You are not authenticated to enter this page</div>
        <div
          :class="{
            'w-50': $vuetify.breakpoint.mdAndUp,
          }"
          class="mx-auto mt-2"
        >
          Look likes you are trying to enter a page that requires login. Please sign in to continue.
        </div>
        <v-btn class="linear-blue--bg white--text mt-6" depressed @click="openLoginDialog">Open sign in dialog</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { loginController } from '@/components/login-dialog/login-dialog-controller'
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
@Observer
@Component
export default class NotAuthenticated extends Vue {
  async openLoginDialog() {
    const res = await loginController.open()
    if (res) {
      //
    }
  }
}
</script>

<style scoped lang="scss"></style>
