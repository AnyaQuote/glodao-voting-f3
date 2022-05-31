<template>
  <v-dialog
    :value="walletStore.showConnectDialog"
    @input="walletStore.changeShowConnectDialog"
    width="500"
    scrollable
    :retain-focus="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn
          v-if="!walletStore.account"
          depressed
          class="rounded linear-blue--bg white--text"
          large
          :class="$attrs.btnClass"
          :height="height"
        >
          Connect Wallet
        </v-btn>
        <div v-else class="d-flex address-container align-center justify-center" :class="$attrs.btnClass">
          <img width="24" :src="require(`@/assets/icons/${walletStore.chainIcon}`)" />
          <div class="align-center ml-2 caption py-1 primary--text font-weight-medium">
            {{ walletStore.shortAccount }}
            <v-btn icon x-small @click="copyAddress()"><v-icon color="primary">mdi-autorenew</v-icon></v-btn>
          </div>
        </div>
      </div>
    </template>

    <v-card class="pa-0 neutral100--bg">
      <v-card-title class="d-flex justify-space-between pa-4 pb-0 neutral100--bg">
        <div>Connect your wallet</div>
        <v-btn icon small @click="walletStore.changeShowConnectDialog(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-4 pt-0 neutral100--bg">
        <v-card class="px-4 py-2 my-2 neutral100--bg" elevation="0">
          <div class="text-center my-2 neutral100--bg">
            <div
              class="d-flex align-center"
              v-if="
                walletStore.solanaConnected && (!walletStore.requestingChain || walletStore.requestingChain === 'sol')
              "
            >
              <img class="mr-4" width="24" :src="require(`@/assets/icons/${walletStore.chainIcon}`)" />
              <address-copy-board
                :index="0"
                :address="walletStore.account || 'TBA'"
                class="success--text caption font-weight-medium"
                :iconColor="'green'"
              />
            </div>
            <div
              class="d-flex align-center"
              v-else-if="
                walletStore.solidityConnected && (!walletStore.requestingChain || walletStore.requestingChain !== 'sol')
              "
            >
              <img class="mr-4" width="24" :src="require(`@/assets/icons/${walletStore.chainIcon}`)" />
              <address-copy-board
                :index="1"
                :address="walletStore.account || 'TBA'"
                class="success--text caption font-weight-medium"
                :iconColor="'green'"
              />
            </div>
            <div v-else>Connect one of your wallets to use GloDAO!</div>
          </div>
        </v-card>

        <div class="text-h6" v-if="!walletStore.requestingChain || walletStore.requestingChain !== 'sol'">
          ETH/BSC Chain
        </div>
        <v-card
          @click="walletStore.connectSolidity()"
          v-if="!walletStore.requestingChain || walletStore.requestingChain !== 'sol'"
          elevation="0"
          outlined
          class="wallet-card neutra100--bg"
        >
          <div class="d-flex align-center neutral100--bg">
            <div class="d-flex align-center ma-4">
              <img width="24" :src="require('@/assets/icons/metamask-fox.svg')" />
            </div>
            <span>MetaMask </span>
            <v-spacer></v-spacer>
            <span v-if="walletStore.solidityConnected" class="success--text caption font-weight-medium caption">
              Connected
            </span>
            <v-icon class="mr-2">mdi-chevron-right</v-icon>
          </div>
        </v-card>

        <div class="text-h6 mt-4" v-if="!walletStore.requestingChain || walletStore.requestingChain === 'sol'">
          SOLANA Chain
        </div>
        <div v-if="!walletStore.requestingChain || walletStore.requestingChain === 'sol'">
          <v-card
            disabled
            v-for="(wallet, index) in walletStore.solWalletItems"
            :key="index"
            outlined
            elevation="0"
            class="my-1 wallet-card neutal100--bg"
          >
            <div @click="connectSolana(wallet)" class="d-flex align-center neutral100--bg">
              <div class="d-flex align-center ma-4">
                <img width="24" :src="wallet.icon" />
              </div>
              <span>{{ wallet.name }} </span>
              <v-spacer></v-spacer>
              <!-- <div v-if="walletStore.selectedWallet === wallet" class="error--text">Click to Disconnect</div> -->
              <div>Coming soon</div>
              <v-icon class="mr-2">mdi-chevron-right</v-icon>
            </div>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { walletStore } from '@/stores/wallet-store'
import { Observer } from 'mobx-vue'
import { Component, Prop, Provide, Vue } from 'vue-property-decorator'
import { AppProvider, appProvider } from '../app-providers'
import { alertController } from './alert/alert-controller'

@Observer
@Component({
  components: {
    'address-copy-board': () => import('@/components/address-copy-board.vue'),
  },
})
export default class extends Vue {
  @Provide() providers: AppProvider = appProvider
  @Provide() walletStore = walletStore
  private readonly SOLLET_WALLET_NAME = 'Sollet'

  @Prop({ default: 55 }) height!: number

  copyAddress() {
    navigator.clipboard.writeText(this.walletStore?.account || '')
  }

  connectSolana(wallet) {
    if (wallet === walletStore.selectedWallet) {
      walletStore.disconnectSolana()
    } else if (wallet.name === this.SOLLET_WALLET_NAME) {
      alertController
        .confirm(
          'Warning',
          'The Sollet wallet sometime encounter error when register for whitelist. Are you sure you want to use this wallet?',
          'Continue',
          'Cancel'
        )
        .then((confirm) => {
          if (confirm) walletStore.connectSolana(wallet)
        })
    } else walletStore.connectSolana(wallet)
  }
}
</script>

<style scoped lang="scss">
.address-container {
  border-radius: 4px;
  border: 1px solid var(--v-primary-base);
  padding: 4px 14px;
}
.wallet-card {
  cursor: pointer;
  border-radius: 8px;
}
.wallet-card:hover {
  background: var(--v-primary-base) !important;
}
</style>
