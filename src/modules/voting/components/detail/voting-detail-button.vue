<template>
  <div v-if="vm.poolStore">
    <v-sheet v-if="connected && !voted" class="d-flex justify-center align-center bluePrimary" height="80" v-ripple>
      <v-icon large color="white" class="mt-n1 mr-1">mdi-star-outline</v-icon>
      <span class="text-h5 white--text">VOTE NOW</span>
    </v-sheet>
    <v-sheet v-else-if="!connected && !voted" class="bluePrimary fill-height d-flex justify-center align-center">
      <span class="white--text text-h5">Please connect wallet to vote for project</span>
    </v-sheet>
    <v-sheet v-else class="pa-6 fill-height blue lighten-5 overflow-hidden">
      <v-row>
        <v-col cols="12" sm="6" md="5">
          <div class="mr-4">
            <div class="text-subtitle-2 d-flex align-center">
              <div v-if="!walletStore.account">
                <ConnectWallet />
              </div>
              <div v-else>
                <div class="text-subtitle-1">Your connected wallet:</div>
                <span>{{ walletStore.account }}</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="d-flex flex-column mr-4">
            <span class="text-subtitle-1">Staking</span>
            <span class="text-subtitle-2">{{ vm.userStakeBalance | formatNumber }} GLD</span>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="4" :class="{ 'text-right': $vuetify.breakpoint.mdAndUp }">
          <v-btn height="48" class="rounded-lg" depressed v-if="vm.voted" disabled width="100%">
            <span class="px-5">Voted</span>
          </v-btn>
          <v-btn
            v-else-if="vm.poolStore.onVoting"
            color="bluePrimary"
            height="48"
            class="white--text rounded-lg"
            depressed
            :disabled="vm.poolStore.completed || !walletStore.account"
            @click="$emit('buttonClick')"
          >
            <span class="px-5">Vote</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue, Inject } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../../viewmodels/voting-detail-viewmodel'

@Component({
  components: {
    'icon-chain': () => import('@/assets/icons/icon-chain.vue'),
    ConnectWallet: () => import('@/components/connect-wallet.vue'),
  },
})
export default class VotingDetailButton extends Vue {
  @Inject() vm!: VotingDetailViewModel
  connected = false
  voted = true
  walletStore = walletStore
}
</script>

<style scoped></style>
