<template>
  <v-dialog :value="controller.twitterLoginDialog" max-width="450" class="rounded-lg" persistent>
    <v-card>
      <v-card-title>
        <v-spacer />
      </v-card-title>
      <v-card-text tag="div" class="text-center">
        <div>
          <v-icon color="blue-diversity" size="30">fab fa-twitter</v-icon>
        </div>
        <div class="mt-2 font-weight-bold">Connect twitter</div>
        <div class="mt-1">To vote projects</div>
        <div class="mt-4">
          <v-btn depressed outlined color="blue-diversity" class="rounded-pill" :href="twitterLoginRedirect">
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
  controller = authStore
  twitterLoginRedirect = `${process.env.VUE_APP_API_STRAPI_ENDPOINT}connect/twitter`
}
</script>

<style lang="scss" scoped></style>
