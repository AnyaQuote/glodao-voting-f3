<template>
  <v-footer padless class="d-flex flex-column neutral15">
    <v-container class="px-6 py-4">
      <v-row>
        <v-col cols="12" sm="6">
          <div
            class="d-flex align-center justify-center justify-sm-start cursor-pointer"
            @click="openLink('https://glodao.io/')"
          >
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              transition="scale-transition"
              :src="glodaoLogo"
              width="75"
              contain
            />
            <div class="neutral10--text text-caption text-capitalize">
              Global Decentralized <br />
              autonomous organization
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center justify-center justify-sm-end fill-height">
            <v-btn icon href="https://medium.com/@glodao-official">
              <v-icon> fab fa-medium-m </v-icon>
            </v-btn>
            <v-btn icon href="https://t.me/GloDAO_Group" class="ml-4">
              <v-icon> fab fa-telegram </v-icon>
            </v-btn>
            <v-btn icon href="https://twitter.com/GloDAO_Official" class="ml-4">
              <v-icon> fab fa-twitter </v-icon>
            </v-btn>
            <v-btn icon href="https://t.me/GloDAO_Channel" class="ml-4">
              <v-icon> fab fa-telegram-plane </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div class="py-1 text-caption fill-width text-center" :class="backgroundColor">
      Copyright © 2022 GLO DAO. All rights reserved.
    </div>
  </v-footer>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Inject } from 'vue-property-decorator'
import { AppProvider } from '@/app-providers'

@Observer
@Component
export default class Footer extends Vue {
  @Inject() providers!: AppProvider
  changeTheme() {
    this.providers.toggleLightMode(this.$vuetify)
  }
  openLink(url) {
    window.open(url, '_blank')
  }

  get glodaoLogo() {
    return this.$vuetify.theme.dark
      ? require(`@/assets/images/glodao-logo-dark.svg`)
      : require(`@/assets/images/glodao-logo.svg`)
  }

  get backgroundColor() {
    return {
      neutral100: this.$vuetify.theme.dark,
      'bluePrimary lighten-1': !this.$vuetify.theme.dark,
    }
  }
}
</script>

<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>
