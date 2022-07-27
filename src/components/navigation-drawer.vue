<template>
  <v-navigation-drawer class="fill-height neutral100 m-w-320" fixed :value="value" @input="handleChange">
    <div class="px-4 py-1"></div>
    <v-divider></v-divider>
    <v-btn
      depressed
      class="rounded-0 blue-diversity--text neutral15"
      height="40"
      block
      v-if="!authStore.jwt"
      @click="openTwitterLoginDialog"
    >
      <v-icon class="mr-2">mdi-twitter</v-icon> Log in
    </v-btn>
    <v-sheet class="fill-width neutral100" v-else>
      <!-- <v-sheet class="d-flex align-center pa-4 neutral100">
        <v-avatar size="32">
          <img :src="authStore.user.avatar" alt="Avatar" />
        </v-avatar>
        <div class="ml-3 font-weight-600">{{ authStore.user.hunter.name }}</div>
      </v-sheet> -->
      <v-divider></v-divider>
      <v-sheet class="neutral100">
        <v-btn plain block class="menu-btn neutral10--text" height="40" depressed @click="openAttachWalletDialog">
          <v-icon class="mr-3 ml-0" left size="24">mdi-wallet-outline</v-icon> Attached wallet
        </v-btn>
        <v-btn plain block class="menu-btn neutral10--text" height="40" depressed>
          <v-img
            :src="require('@/assets/icons/crown-mini.svg')"
            max-height="22"
            max-width="22"
            class="mr-2 ml-0"
          ></v-img>

          My account
        </v-btn>
        <v-btn plain block class="menu-btn" height="40" depressed @click="authStore.logout()"> Log out </v-btn>
      </v-sheet>
    </v-sheet>
    <v-divider></v-divider>
    <div class="d-flex flex-column">
      <v-list class="px-4 mt-1" dense nav>
        <v-list-item class="neutral10--text">
          <v-list-item-title class="nav-btn-text text-capitalize neutral10--text">
            Launchpad (Coming soon)
          </v-list-item-title>
        </v-list-item>

        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item class="ml-0 pl-0">
              <v-list-item-title class="nav-btn-text text-none neutral-10--text">Bounty hunter</v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:appendIcon>
            <v-icon color="bluePrimary">mdi-chevron-down</v-icon>
          </template>
          <v-list-item
            active-class="filter-bluePrimary black--text"
            @click="openLink('https://dev-bounty.glodao.io/bounty')"
          >
            <v-list-item-icon class="mr-2">
              <v-img :src="require('@/assets/icons/nav-bar/bounty.svg')" class="filter-neutral10 fill-height"></v-img>
            </v-list-item-icon>
            <v-list-item-title class="text-none">Bounty hunter</v-list-item-title>
          </v-list-item>
          <v-list-item
            active-class="filter-bluePrimary black--text"
            @click="openLink('https://dev-bounty.glodao.io/bounty-history')"
          >
            <v-list-item-icon class="mr-2">
              <v-img
                :src="require('@/assets/icons/nav-bar/launchpad.svg')"
                class="filter-neutral10 fill-height"
              ></v-img>
            </v-list-item-icon>
            <v-list-item-title class="text-none">Bounty history</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon class="mr-2">
              <v-icon color="neutral10">mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-none neutral10--text">Apply project (Coming soon)</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- <v-list-item active-class="neutral10--text" @click="openLink('https://dev.glodao.io/staking')">
          <v-list-item-icon class="mr-2">
            <v-img :src="require('@/assets/icons/nav-bar/staking.svg')" class="filter-neutral10 fill-height"></v-img>
          </v-list-item-icon>
          <v-list-item-title class="nav-btn-text text-capitalize neutral10--text">$Staking</v-list-item-title>
        </v-list-item>

        <v-list-item active-class="neutral10--text" @click="openLink('https://dev.glodao.io/farm')">
          <v-list-item-icon class="mr-2">
            <v-img :src="require('@/assets/icons/nav-bar/farm.svg')" class="filter-neutral10 fill-height"></v-img>
          </v-list-item-icon>
          <v-list-item-title class="nav-btn-text text-capitalize neutral10--text">Farming</v-list-item-title>
        </v-list-item> -->
        <v-list-group no-action class="">
          <template v-slot:activator>
            <v-list-item class="ml-0 pl-0">
              <v-list-item-title class="nav-btn-text text-none neutral10--text">Staking</v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:appendIcon>
            <v-icon color="neutral10">mdi-chevron-down</v-icon>
          </template>
          <v-list-item active-class="filter-bluePrimary">
            <!-- <v-list-item-icon>
              <img :src="require('@/assets/icons/nav-bar/staking.svg')" class="filter-neutral10" />
            </v-list-item-icon> -->
            <v-list-item-title>
              <div class="neutral10--text">$Staking (Coming soon)</div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item active-class="filter-bluePrimary">
            <!-- <v-list-item-icon>
              <img :src="require('@/assets/icons/nav-bar/farm.svg')" class="filter-neutral10" />
            </v-list-item-icon> -->
            <v-list-item-title>
              <div class="neutral10--text">Farming (Coming soon)</div>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <!-- ---------------------- -->
        <!-- <v-list-item class="my-2">
          <v-list-item-title
            class="nav-btn-text neutral10--text"
            block
            depressed
            large
            rounded
            color="primary"
            outlined
          >
            DAO voting (Coming soon)
          </v-list-item-title>
        </v-list-item> -->
        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item class="ml-0 pl-0">
              <v-list-item-title class="nav-btn-text text-none neutral10--text blue-diversity--text"
                >DAO Voting</v-list-item-title
              >
            </v-list-item>
          </template>
          <template v-slot:appendIcon>
            <v-icon color="neutral10">mdi-chevron-down</v-icon>
          </template>
          <v-list-item active-class="filter-bluePrimary">
            <v-list-item-icon> <v-icon>mdi-vote</v-icon> </v-list-item-icon>
            <v-list-item-title>
              <router-link tag="div" to="/voting">
                <div class="neutral10--text">
                  <v-icon color="bluePrimary">mdi-fingerprint</v-icon>
                  <span>DAO Voting</span>
                </div>
              </router-link>
            </v-list-item-title>
          </v-list-item>
          <v-list-item active-class="filter-bluePrimary">
            <v-list-item-icon> <v-icon>mdi-application-edit-outline</v-icon> </v-list-item-icon>
            <v-list-item-title>
              <router-link tag="div" to="/projects">
                <div class="neutral10--text">Your project</div>
              </router-link>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <!-- ---------------------- -->
        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item class="ml-0 pl-0">
              <v-list-item-title class="nav-btn-text text-none neutral10--text">Utilities</v-list-item-title>
            </v-list-item>
          </template>
          <template v-slot:appendIcon>
            <v-icon color="neutral10">mdi-chevron-down</v-icon>
          </template>
          <v-list-item active-class="filter-bluePrimary">
            <v-list-item-title>
              <div class="d-flex align-center neutral10--text">
                <v-icon class="mr-2" size="20">mdi-lock-outline</v-icon>
                <div>Locker (Coming soon)</div>
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item active-class="filter-bluePrimary">
            <v-list-item-title>
              <div class="d-flex align-center neutral10--text">
                <v-icon class="mr-2" size="20">mdi-cached</v-icon>
                <div>Bulkclaimer (Coming soon)</div>
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item active-class="filter-bluePrimary">
            <v-list-item-title>
              <div class="d-flex align-center neutral10--text">
                <v-icon class="mr-2" size="20">mdi-flare</v-icon>
                <div>Claimer (Coming soon)</div>
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item active-class="filter-bluePrimary">
            <v-list-item-title>
              <div class="d-flex align-center neutral10--text">
                <v-icon class="mr-2" size="20">mdi-alert-circle-outline</v-icon>
                <div>Unapprove (Coming soon)</div>
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </div>
    <div class="d-flex align-center justify-space-between px-10">
      <connect-wallet btnClass="rounded fill-width"></connect-wallet>
      <v-btn icon @click="changeTheme" class="rounded-circle change-theme-btn" width="40" height="40" outlined>
        <v-icon color="bluePrimary">
          {{ !$vuetify.theme.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop } from 'vue-property-decorator'
import { Observer } from 'mobx-vue'
import { AppProvider } from '@/app-providers'
import { twitterLoginDialogController } from './twitter-login/twitter-login-dialog-controller'
import { attachWalletDialogController } from './attach-wallet/attach-wallet-dialog-controller'

@Observer
@Component({
  components: {
    'connect-wallet': () => import('@/components/connect-wallet.vue'),
  },
})
export default class NavigationDrawer extends Vue {
  @Inject() providers!: AppProvider
  @Prop(Boolean) value!: boolean
  authStore = this.providers.authStore

  openLink(url) {
    window.open(url, '_self')
  }
  changeTheme() {
    this.providers.toggleLightMode(this.$vuetify)
  }
  handleChange(state: boolean) {
    this.$emit('input', state)
  }
  async openAttachWalletDialog() {
    attachWalletDialogController.open({
      allowSetter: !this.authStore.attachedAddress,
      canClose: true,
    })
  }
  async openTwitterLoginDialog() {
    const res = await twitterLoginDialogController.open()
    if (res) {
      twitterLoginDialogController.close()
    }
  }
}
</script>

<style scoped>
.change-theme-btn {
  border-color: var(--v-bluePrimary-base) !important;
  background: var(--v-bluePrimary-lighten1) !important;
}
.btn-theme {
  position: absolute;
  bottom: 24px;
  left: 24px;
}
.menu-btn {
  border-radius: 0 !important;
  display: flex;
  justify-content: flex-start;
  text-transform: unset;
  font-size: 14px;
  line-height: 20px;
  margin-top: 4px;
  margin-bottom: 4px;
  color: var(--v-neutral10-base);
}
.position-sticky {
  position: sticky;
}
.nav-btn-text {
  font-size: 14px !important;
}
.m-w-320 {
  min-width: 320px !important;
}
</style>
