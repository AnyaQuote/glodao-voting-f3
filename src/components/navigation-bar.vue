<template>
  <v-app-bar height="80px" class="navigation-bar" app flat :color="$vuetify.theme.dark ? 'neutral15' : 'white'">
    <div class="nav-container mx-auto" style="width: 100%; max-width: 1090px">
      <v-row class="d-flex align-center justify-space-between">
        <v-col col="12" sm="12" md="1">
          <div class="pl-4 cursor-pointer" @click="openLink('https://glodao.io/')">
            <v-img :src="require('@/assets/images/' + logoImg + '.svg')" max-height="50" max-width="75"></v-img>
          </div>
        </v-col>
        <!-- ----------------------------------------------------------------------------------------------- -->
        <v-col class="d-flex align-center justify-space-between pr-10">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div class="text-none nav-btn-text cursor-pointer px-4" v-bind="attrs" v-on="on">Launchpad</div>
            </template>
            <span>Coming Soon!</span>
          </v-tooltip>
          <!-- ----------------------------------------------------------------------------------------------- -->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div class="text-none nav-btn-text d-flex align-center bluePrimary--text" v-on="on" v-bind="attrs">
                Bounty Hunter <v-icon color="bluePrimary">mdi-chevron-down</v-icon>
              </div>
            </template>
            <v-sheet class="neutral100" width="250">
              <v-list>
                <v-list-item-group>
                  <v-list-item-content>
                    <v-list-item-title>
                      <router-link
                        to="/bounty"
                        class="text-decoration-none px-4 text-none text-body-2 d-flex align-center"
                        active-class="filter-bluePrimary black--text font-weight-600"
                      >
                        <img :src="require('@/assets/icons/nav-bar/bounty.svg')" class="filter-neutral10 mr-1" />
                        Bounty project
                      </router-link>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>
                      <router-link
                        to="/bounty-history"
                        class="text-decoration-none px-4 text-none text-body-2 d-flex align-center"
                        active-class="filter-bluePrimary black--text font-weight-600"
                      >
                        <img :src="require('@/assets/icons/nav-bar/launchpad.svg')" class="filter-neutral10 mr-1" />
                        Bounty history
                      </router-link>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="d-flex align-center px-4 neutral10--text text-body-2">
                        <v-icon class="mr-2" size="20">mdi-check</v-icon>
                        <div>Apply project (Coming soon)</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item-group>
              </v-list>
            </v-sheet>
          </v-menu>
          <!-- ----------------------------------------------------------------------------------------------- -->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div class="text-none nav-btn-text d-flex align-center" v-on="on" v-bind="attrs">
                Staking <v-icon>mdi-chevron-down</v-icon>
              </div>
            </template>
            <v-sheet class="neutral100" width="220">
              <v-list>
                <v-list-item-group>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="d-flex align-center px-4 cursor-pointer neutral10--text text-body-2">
                        <div>$Staking (Coming soon)</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="d-flex align-center px-4 cursor-pointer neutral10--text text-body-2">
                        <div>Farm (Coming soon)</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item-group>
              </v-list>
            </v-sheet>
          </v-menu>
          <!-- ----------------------------------------------------------------------------------------------- -->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div class="text-none nav-btn-text d-flex align-center" v-on="on" v-bind="attrs">
                DAO Voting <v-icon>mdi-chevron-down</v-icon>
              </div>
            </template>
            <v-sheet class="neutral100" width="250">
              <v-list>
                <v-list-item-group>
                  <v-list-item-content>
                    <v-list-item-title>
                      <router-link tag="button" class="px-4 d-flex align-center fill-width cursor-pointer" to="/voting">
                        <v-icon class="mr-2" size="20">mdi-vote</v-icon>
                        <div class="neutral10--text text-body-2">Voting</div>
                      </router-link>
                    </v-list-item-title>
                  </v-list-item-content>
                  <!-- ---------------------- -->
                  <v-list-item-content>
                    <v-list-item-title>
                      <router-link tag="div" class="px-4 d-flex align-center cursor-pointer" to="/new-project">
                        <v-icon class="mr-2" size="20">mdi-application-edit-outline</v-icon>
                        <div class="neutral10--text text-body-2">My Application</div>
                      </router-link>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item-group>
              </v-list>
            </v-sheet>
          </v-menu>
          <!-- ----------------------------------------------------------------------------------------------- -->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div class="text-none nav-btn-text d-flex align-center" v-on="on" v-bind="attrs">
                Utilities <v-icon>mdi-chevron-down</v-icon>
              </div>
            </template>
            <v-sheet class="neutral100" width="250">
              <v-list>
                <v-list-item-group>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="d-flex align-center px-4 neutral10--text text-body-2">
                        <v-icon class="mr-2" size="20">mdi-lock-outline</v-icon>
                        <div>Locker (Coming soon)</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="d-flex align-center px-4 neutral10--text text-body-2">
                        <v-icon class="mr-2" size="20">mdi-cached</v-icon>
                        <div>Bulkclaimer (Coming soon)</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="d-flex align-center px-4 neutral10--text text-body-2">
                        <v-icon class="mr-2" size="20">mdi-flare</v-icon>
                        <div>Claimer (Coming soon)</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="d-flex align-center px-4 neutral10--text text-body-2">
                        <v-icon class="mr-2" size="20">mdi-alert-circle-outline</v-icon>
                        <div>Unapprove (Coming soon)</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item-group>
              </v-list>
            </v-sheet>
          </v-menu>
        </v-col>

        <v-col class="d-flex justify-end align-center col-auto">
          <connect-wallet class="fill-width" />
          <!-- <div class="ml-6 d-flex align-center justify-end pr-6">
            <v-btn
              depressed
              outlined
              class="rounded blue-diversity--text"
              height="40"
              width="110"
              v-if="!authStore.jwt"
              @click="authStore.changeTwitterLoginDialog(true)"
            >
              <v-icon class="mr-2">mdi-twitter</v-icon> Log in
            </v-btn>
            <v-menu offset-y v-else>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar size="40" v-bind="attrs" v-on="on">
                  <img :src="authStore.user.avatar" alt="Avatar" />
                </v-avatar>
              </template>
              <v-sheet width="240" class="neutral100--bg" outlined>
                <v-sheet class="d-flex align-center pa-4 neutral100--bg">
                  <v-avatar size="32">
                    <img :src="authStore.user.avatar" alt="Avatar" />
                  </v-avatar>
                  <div class="ml-3 font-weight-600">{{ authStore.user.hunter.name }}</div>
                </v-sheet>
                <v-divider></v-divider>
                <v-sheet class="neutral100--bg">
                  <v-btn
                    plain
                    block
                    class="menu-btn"
                    height="40"
                    depressed
                    @click="authStore.changeAttachWalletDialog(true)"
                  >
                    <v-icon class="mr-3 ml-0" left size="24">mdi-wallet-outline</v-icon> Attached wallet
                  </v-btn>
                  <v-btn plain block class="menu-btn" height="40" depressed @click="goToHuntingHistoryScreen()">
                    <v-img
                      :src="require('@/assets/icons/crown-mini.svg')"
                      max-height="22"
                      max-width="22"
                      class="mr-2 ml-0"
                    ></v-img>

                    My account
                  </v-btn>
                  <v-btn plain block class="menu-btn" height="40" depressed @click="authStore.logout()">
                    Log out
                  </v-btn>
                </v-sheet>
              </v-sheet>
            </v-menu>
          </div> -->
          <div class="ml-4">
            <v-btn icon @click="changeTheme" class="rounded-circle change-theme-btn" width="40" height="40" outlined>
              <v-icon color="bluePrimary">
                {{ !$vuetify.theme.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { authStore } from '@/stores/auth-store'
import { AppProvider } from '@/app-providers'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    'connect-wallet': () => import('@/components/connect-wallet.vue'),
  },
})
export default class NavigationBar extends Vue {
  @Inject() providers!: AppProvider
  authStore = authStore
  chainId = process.env.VUE_APP_CHAIN_ID
  openLink(url) {
    window.open(url, '_self')
  }
  changeTheme() {
    this.providers.toggleLightMode(this.$vuetify)
  }
  get logoImg() {
    return this.$vuetify.theme.dark ? 'glodao-logo-dark' : 'glodao-logo'
  }
}
</script>

<style scoped lang="scss">
.change-theme-btn {
  border-color: var(--v-bluePrimary-base) !important;
  background: var(--v-bluePrimary-lighten1) !important;
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
}
.nav-container {
  max-width: 1280px;
}
.connect-wallet {
  border: 1px solid #ffffff;
  box-sizing: border-box;
}
.nav-btn-text {
  font-style: normal;
  font-weight: 600;
  font-size: 0.875rem !important;
  line-height: 20px;
  color: var(--v-neutral10-base);
}
.active {
  color: var(--v-twitter-base) !important;
}
.blue-diversity--text {
  color: var(--v-bluePrimary-base);
}
.cursor-pointer {
  cursor: pointer;
}
</style>
