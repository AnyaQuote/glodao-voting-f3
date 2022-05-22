<template>
  <v-sheet v-if="connected && !voted" class="d-flex justify-center align-center bluePrimary" height="80" v-ripple>
    <v-icon large color="white" class="mt-n1 mr-1">mdi-star-outline</v-icon>
    <span class="text-h5 white--text">VOTE NOW</span>
  </v-sheet>
  <v-sheet v-else-if="!connected && !voted" class="bluePrimary fill-height d-flex justify-center align-center">
    <span class="white--text text-h5">Please connect wallet to vote for project</span>
  </v-sheet>
  <!-- I DONT KNOW WHY BUT DO NOT REMOVE mx-0 FROM row -->
  <v-sheet v-else class="pa-6 fill-height blue lighten-5 overflow-hidden">
    <div v-if="$vuetify.breakpoint.mdAndUp" class="d-flex flex-row">
      <div class="mr-4">
        <div class="text-subtitle-1">Your connected wallet:</div>
        <div class="text-subtitle-2 d-flex align-center">
          <icon-chain class="mr-1" />
          <span>{{ wallet.account }}</span>
        </div>
      </div>
      <div class="d-flex flex-column mr-4">
        <span class="text-subtitle-1">Staking</span>
        <span class="text-subtitle-2">1000 GLD</span>
      </div>
      <v-sheet class="rounded pa-3 d-flex align-center" outlined>
        <span class="mr-1">TRIBE</span>
        <v-icon>mdi-fingerprint</v-icon>
      </v-sheet>
      <v-spacer />
      <v-btn color="bluePrimary" height="48" class="white--text rounded-lg" depressed @click="$emit('buttonClick')">
        <span class="px-5">Vote</span>
      </v-btn>
    </div>
    <div v-else class="d-flex flex-column">
      <div class="mb-4">
        <div class="text-subtitle-1">Your connected wallet:</div>
        <div class="text-subtitle-2 d-flex align-center">
          <icon-chain class="mr-1" />
          <span>{{ wallet.account }}</span>
        </div>
      </div>
      <div class="d-flex mb-4">
        <div class="d-flex flex-column mr-6">
          <span class="text-subtitle-1">Staking</span>
          <span class="text-subtitle-2">1000 GLD</span>
        </div>
        <v-sheet class="rounded pa-3 d-flex align-center" outlined>
          <span class="mr-1">TRIBE</span>
          <v-icon>mdi-fingerprint</v-icon>
        </v-sheet>
      </div>
      <v-btn
        color="bluePrimary"
        height="48"
        block
        class="white--text rounded-lg"
        depressed
        @click="$emit('buttonClick')"
      >
        <span class="px-5">Cast your vote</span>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { walletStore } from '@/stores/wallet-store'
import { Component, Vue, Inject } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../../viewmodels/voting-detail-viewmodel'

@Component({
  components: {
    'icon-chain': () => import('@/assets/icons/icon-chain.vue'),
  },
})
export default class VotingDetailButton extends Vue {
  @Inject() vm!: VotingDetailViewModel
  connected = false
  voted = true
  wallet = walletStore
}
</script>

<style scoped></style>
