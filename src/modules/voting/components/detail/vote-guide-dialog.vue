<template>
  <app-dialog ref="dialog" v-slot="{ close }">
    <v-card>
      <v-card-title>
        <v-spacer />
        <v-icon @click="close">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="text-center text-subtitle-2 font-weight-bold">
        Your voting power is determined by the amount of GLD you staked ( Detail is below). GLD in other places does not
        contribute to your voting power
      </v-card-text>
      <v-card-text class="text-subtitle-1 font-weight-bold">
        <span class="bullet">Normal users</span>
        <span class="bullet">Their vote has low weight</span>
      </v-card-text>
      <v-divider />
      <v-card-text class="mt-6 text-subtitle-1 font-weight-bold">
        <span class="bullet">Stakers are staking a minimum GLD value of $100 </span>
        <span class="bullet">Their vote has medium weight</span>
      </v-card-text>
      <v-divider />
      <v-card-text class="mt-6 text-subtitle-1 font-weight-bold">
        <span class="bullet">Stakers are staking a minimum GLD value of $500 </span>
        <span class="bullet">Their vote has high weight </span>
      </v-card-text>
      <v-divider />
      <v-card-text class="mt-6 text-subtitle-1 font-weight-bold">
        <span class="bullet">Stakers are staking a minimum GLD value of $1000 </span>
        <span class="bullet">Their vote has strong weight</span>
      </v-card-text>
    </v-card>
  </app-dialog>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

@Component
export default class VoteGuideDialog extends Vue {
  @Ref('dialog') dialog
  open() {
    this.dialog.open()
  }
}
</script>

<style scoped>
.bullet {
  display: list-item;
  list-style-type: disc;
  list-style-position: inside;
}
</style>
