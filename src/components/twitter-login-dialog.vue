<template>
  <v-dialog v-model="authStore.twitterLoginDialog" max-width="450" class="rounded-lg" persistent>
    <v-card>
      <v-card-title class="text-none">
        <v-spacer />
        <v-icon>mdi-close</v-icon>
      </v-card-title>
      <v-card-text tag="div" class="text-center" v-if="!logined">
        <div>
          <v-icon color="blue-diversity" size="30">fab fa-twitter</v-icon>
        </div>
        <div class="mt-2 font-weight-bold">Connect twitter</div>
        <div class="mt-1">To vote projects</div>
        <div class="mt-4">
          <v-btn depressed outlined color="blue-diversity" class="rounded-pill" :href="`${apiEndPoint}connect/twitter`">
            Login with twitter
          </v-btn>
        </div>
        <div class="mt-8">
          By connect you accept GloDAO’s <br />
          <a href="https://glodao.io/doc/TERMS-OF-USE.pdf" class="blue-diversity--text" target="_blank">Terms of use</a>
          and
          <a href="https://glodao.io/doc/Privacy-Policy.pdf" class="blue-diversity--text" target="_blank"
            >Privacy Policy</a
          >
        </div>
      </v-card-text>
      <v-card-text v-else></v-card-text>
    </v-card>
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
// .close-icon {
//   position: absolute !important;
//   top: 0;
//   right: 0;
// }
// .dialog-normal-text {
//   font-size: 14px;
//   line-height: 20px;
// }
// .dialog-button {
//   padding: 10px !important;
// }
// .neutral10--text {
//   color: var(--v-neutral10-base);
// }
// .blue-diversity--text {
//   color: var(--v-bluePrimary-base);
// }
// .dialog-small-text {
//   font-size: 9px;
//   line-height: 12px;
// }
// .background-twitter {
//   background-color: var(--v-twitter-base);
// }
// .login-btn {
//   font-size: 14px;
//   line-height: 24px;
//   border: 1px solid var(--v-bluePrimary-base);
//   text-transform: unset;
// }
</style>
