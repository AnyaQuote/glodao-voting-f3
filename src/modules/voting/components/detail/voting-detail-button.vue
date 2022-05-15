<template>
  <v-sheet v-if="connected && !voted" class="d-flex justify-center align-center bluePrimary" height="80" v-ripple>
    <v-icon large color="white" class="mt-n1 mr-1">mdi-star-outline</v-icon>
    <span class="text-h5 white--text">VOTE NOW</span>
  </v-sheet>
  <v-sheet v-else height="150">
    <v-sheet v-if="!voted" class="bluePrimary fill-height d-flex justify-center align-center">
      <span class="white--text text-h5">Please connect wallet to vote for project</span>
    </v-sheet>
    <!-- I DONT KNOW WHY BUT DO NOT REMOVE mx-0 FROM row -->
    <v-sheet v-else class="row ma-0 px-6 fill-height blue lighten-5 d-flex align-center">
      <div class="col-md-5 col-12">
        <div class="text-subtitle-1">Your connected wallet:</div>
        <div class="text-subtitle-2 d-flex align-center">
          <icon-chain class="mr-1" />
          <span>GxmhrPKccNjjfv898RSXXPZqrCM7LkdcMRfYNA65ywQT</span>
        </div>
      </div>
      <div class="col-2">
        <div class="text-subtitle-1">Staking</div>
        <div class="text-subtitle-2">1000 GLD</div>
      </div>
      <div class="col-2 d-flex align-start">
        <v-sheet class="rounded pa-3 d-flex align-center" outlined>
          <span class="mr-1">TRIBE</span>
          <v-icon>mdi-fingerprint</v-icon>
        </v-sheet>
      </div>
      <v-spacer />
      <div class="col-2 d-flex justify-center">
        <!-- DIALOG SECTION START -->
        <v-btn color="bluePrimary" class="white--text rounded-lg" depressed @click="$emit('buttonClick')">
          <span class="px-5">Vote</span>
        </v-btn>
        <!-- DIALOG SECTION END -->
      </div>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    'icon-chain': () => import('@/assets/icons/icon-chain.vue')
  }
})
export default class VotingDetailButton extends Vue {
  connected = false
  voted = true
}
</script>

<style scoped></style>
