<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-img src="@/assets/images/new-project--banner.png" />
    </v-col>
    <!-- --------------------------------------------------------------------------------------------------- -->
    <v-col cols="8" v-if="!vm.isLoggedIn">
      <v-sheet class="d-flex flex-column pa-8 rounded-lg" outlined>
        <div class="text-h6 font-weight-bold text-center mb-6">
          Please sign in with your wallet for applying project on DAO Voting
        </div>
        <div class="text-subtitle-1 font-weight-400 mb-6 text-center">
          Remember that this wallet will be the pool owner's address.
          <span class="font-weight-600">Only the pool</span> owner can
          <span class="font-weight-600">update pool information</span> and will
          <span class="font-weight-600">send the token and pay the fee</span> when creating the pool.
        </div>
        <v-sheet class="py-6 px-16 mb-6 rounded d-flex align-center neutral100--bg" outlined>
          <span class="bluePrimary--text font-weight-bold mr-2 text-center fill-width">{{ walletStore.account }}</span>
        </v-sheet>
        <v-btn class="linear-blue--bg white--text text-none" depressed @click="signMessage" :loading="vm.loading"
          >Sign message</v-btn
        >
      </v-sheet>
    </v-col>
    <!-- ---------------------------------------------------------------------------------------------------  -->
    <!-- <v-col cols="12" v-if="signed && !save">
      <v-sheet elevation="3" class="d-flex flex-column align-center py-9 rounded neutral100--bg">
        <div class="text-h6 font-weight-bold mb-6">Are you applying your project using connected wallet address?</div>
        <v-sheet class="py-6 px-16 mb-6 rounded d-flex align-center neutral100--bg" outlined>
          <span class="bluePrimary--text font-weight-bold mr-2 text-h6 text-center fill-width">{{
            walletStore.account
          }}</span>
        </v-sheet>
        <v-btn class="linear-blue--bg text-none white--text mb-6 px-13" height="48" @click="saveWallet">
          Confirm
        </v-btn>
        <div class="neutral10--text">If not, change your connected wallet you want to apply!</div>
      </v-sheet>
      <div class="mt-14">
        <div class="font-weight-bold mb-4">Pool owner address has notes:</div>
        <ul class="mb-4">
          <li>Only pool owner address can update pool.</li>
          <li>Pool owner address will send token and pay fee when creating pool.</li>
        </ul>
        <div>
          <span class="bluePrimary--text">Learn more</span>
          <v-icon>mdi-chevron-right</v-icon>
        </div>
      </div>
    </v-col> -->
    <!-- --------------------------------------------------------------------------------------------------- -->
    <v-col cols="12" v-else>
      <div class="text-h6 text-center mb-9">What type of project do you want to launch on GLoDAO?</div>
      <v-col class="row">
        <div class="col-6">
          <v-sheet
            class="d-flex flex-column px-6 pb-6 rounded-lg pt-72"
            v-ripple
            elevation="3"
            @click.stop="openBountyForm"
          >
            <v-avatar>
              <v-img src="@/assets/icons/bulleyes.svg" />
            </v-avatar>
            <div class="text-h6">Bounty Hunter</div>
            <div class="text-subtitle-1 font-weight-thin">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit.
            </div>
          </v-sheet>
        </div>
        <div class="col-6">
          <v-sheet
            class="d-flex flex-column px-6 pb-6 rounded-lg pt-72"
            v-ripple
            elevation="3"
            @click.stop="openLaunchpadForm"
          >
            <v-avatar>
              <v-img src="@/assets/icons/bulleyes.svg" />
            </v-avatar>
            <div class="text-h6">Launchpad Hunter</div>
            <div class="text-subtitle-1 font-weight-thin">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit.
            </div>
          </v-sheet>
        </div>
      </v-col>
    </v-col>
    <!-- --------------------------------------------------------------------------------------------------- -->
  </v-row>
</template>

<script lang="ts">
import { AppProvider } from '@/app-providers'
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue, Inject, Provide } from 'vue-property-decorator'
import { NewProjectViewModel } from '../viewmodels/new-project-viewmodel'

@Component
export default class ProjectRegist extends Vue {
  @Inject() providers!: AppProvider
  @Provide() vm = new NewProjectViewModel()

  walletStore = walletStore
  signed = false
  save = false

  signMessage() {
    this.vm.signAndLogin()
  }

  saveWallet() {
    this.save = true
  }

  openBountyForm() {
    this.providers.router.push({ name: 'bounty-apply' })
  }

  openLaunchpadForm() {
    this.providers.router.push({ name: 'launchpad-apply' })
  }
}
</script>

<style lang="scss" scoped>
.mb-120 {
  margin-bottom: em(120);
}
.pt-72 {
  padding-top: em(72);
}
</style>
