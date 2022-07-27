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
import { Component, Vue, Inject } from 'vue-property-decorator'
import { get } from 'lodash-es'
import { AppProvider } from '@/app-providers'
import router, { RouteName } from '@/router'

@Observer
@Component
export default class TwitterAuthenticationPage extends Vue {
  @Inject() providers!: AppProvider

  private _snackbar = this.providers.snackbar
  private _auth = this.providers.authStore

  mounted() {
    this.loginAndRedirect()
  }

  async loginAndRedirect() {
    try {
      const access_token = get(this.$route, 'query.access_token')
      const access_secret = get(this.$route, 'query.access_secret')
      const res = await this._auth.fetchUser(access_token, access_secret)

      if (res) {
        router.replace({ name: RouteName.PROJECT_LIST })
      }
    } catch (error) {
      this._snackbar.commonError(error)
    }
  }
}
</script>

<style scoped lang="scss"></style>
