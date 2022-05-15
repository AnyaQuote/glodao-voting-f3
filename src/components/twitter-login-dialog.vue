<template>
  <v-dialog v-model="authStore.twitterLoginDialog" class="rounded-lg overflow-hidden" max-width="450" persistent>
    <v-sheet
      outlined
      class="position-relative pa-8 rounded-lg text-center dialog-normal-text position-relative overflow-hidden neutral100--bg"
    >
      <v-sheet min-height="300" class="d-flex align-center justify-center neutral100--bg" v-if="!logined">
        <v-sheet class="neutral100--bg">
          <div class="d-flex justify-center">
            <v-sheet width="64" height="64" class="background-twitter rounded-circle d-flex justify-center">
              <v-icon class="white--text" size="30">mdi-twitter</v-icon>
            </v-sheet>
          </div>
          <div class="mt-3 font-weight-bold card-big-title-text">Connect Twitter</div>
          <div class="mt-1 card-title-text">To complete task & earn reward</div>
          <div class="mt-4">
            <v-btn
              outlined
              depressed
              class="rounded-pill neutral100--bg login-btn"
              :href="`${apiEndPoint}connect/twitter`"
            >
              <span> Log in with Twitter </span>
            </v-btn>
          </div>
          <div class="mt-8 px-10">
            By connect you accept GloDAO’s <br />
            <a href="https://glodao.io/doc/TERMS-OF-USE.pdf" class="blue-diversity--text" target="_blank"
              >Terms of use</a
            >
            and
            <a href="https://glodao.io/doc/Privacy-Policy.pdf" class="blue-diversity--text" target="_blank"
              >Privacy Policy</a
            >
          </div>
        </v-sheet>
      </v-sheet>

      <v-sheet v-if="logined" class="neutral100--bg">
        <div class="d-flex align-center justify-center blue-diversity--text">
          <v-icon size="18" class="mr-2 blue-diversity--text">mdi-twitter</v-icon>
          Log in with Twitter
        </div>
        <div class="mt-6">
          <div>
            <v-avatar size="48" color="blue"></v-avatar>
          </div>
          <div class="mt-2 card-title-text font-weight-600">GloDAO is requesting access to:</div>
          <div class="mt-2 neutral10--text">Your name, profile picture, activity</div>
        </div>
        <div class="mt-6"><a href="#" class="blue-diversity--text">View access</a></div>
        <v-btn
          class="mt-6 text-capitalize background-blue-diversity white--text rounded-0 dialog-button dialog-normal-text"
          depressed
          height="40"
          block
        >
          Continue as Tommy
        </v-btn>
        <v-btn
          class="mt-3 text-capitalize background-neutral neutral10--text rounded-0 dialog-button dialog-normal-text"
          depressed
          height="40"
          block
        >
          Cancel
        </v-btn>
        <div class="dialog-small-text neutral10--text mt-6">
          By continuing, GloDAO will receive ongoing access to the information you share. <br />
          <a class="blue-diversity--text" href="https://glodao.io/doc/TERMS-OF-USE.pdf">Learn more</a> about this
          sharing and the settings you have.<br />
          GloDAO's <a class="blue-diversity--text" href="https://glodao.io/doc/Privacy-Policy.pdf">Privacy Policy</a>
        </div>
      </v-sheet>
      <v-icon class="close-icon" @click="authStore.changeTwitterLoginDialog(false)">mdi-window-close</v-icon>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
import { authStore } from '@/stores/auth-store'

@Observer
@Component({
  components: {},
})
export default class TwitterLoginDialog extends Vue {
  dialog = true
  logined = false
  authStore = authStore

  apiEndPoint = process.env.VUE_APP_API_STRAPI_ENDPOINT
  changeLoginState() {
    this.logined = !this.logined
  }
}
</script>

<style lang="scss" scoped>
.close-icon {
  position: absolute;
  top: 0;
  right: 0;
}
.dialog-normal-text {
  font-size: 14px;
  line-height: 20px;
}
.dialog-button {
  padding: 10px !important;
}
.neutral10--text {
  color: var(--v-neutral10-base);
}
.blue-diversity--text {
  color: var(--v-bluePrimary-base);
}
.dialog-small-text {
  font-size: 9px;
  line-height: 12px;
}
.background-twitter {
  background-color: var(--v-twitter-base);
}
.login-btn {
  font-size: 14px;
  line-height: 24px;
  border: 1px solid var(--v-bluePrimary-base);
  text-transform: unset;
}
</style>
