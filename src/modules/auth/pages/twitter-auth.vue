<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="d-flex flex-column align-center">
        <v-progress-circular indeterminate size="100" class="mb-8" color="blue-diversity"></v-progress-circular>
        <div class="text-h5 font-weight-bold">Please wait a minute!</div>
        <div class="text-h5 font-weight-bold">We are trying to sign you in</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue } from 'vue-property-decorator'
import { authStore } from '@/stores/auth-store'

@Observer
@Component
export default class TwitterAuthenticationPage extends Vue {
  authStore = authStore

  mounted() {
    const access_token = this.$route.query.access_token as string
    const access_secret = this.$route.query.access_secret as string
    if (access_token && access_secret) {
      this.authStore.fetchUser(access_token, access_secret)
    }
  }
}
</script>

<style scoped lang="scss"></style>
