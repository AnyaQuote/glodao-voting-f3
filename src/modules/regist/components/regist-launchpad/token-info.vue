<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip class="text-h6 font-weight-bold text-center ma-5 pa-6" color="bluePrimary" label outlined>
      Token information
    </v-chip>
    <div class="pa-6">
      <div class="d-flex align-center">
        <img src="@/assets/icons/mock-crypto.svg" alt="currency" width="36" height="36" />
        <div class="text-h5 font-weight-bold text-capitalize line-height-1 ml-3" height="fit-content">hydro wind</div>
      </div>
      <div class="d-flex flex-column flex-sm-row">
        <div class="mt-6">
          <div class="label font-weight-bold">Token name</div>
          <app-text-field placeholder="Enter name of token"></app-text-field>
        </div>
        <div class="pl-0 pl-sm-6 mt-6 flex-grow-1">
          <div class="label font-weight-bold">Chain</div>
          <app-select :items="tokens">
            <template #selection="{ item }">
              <img class="mr-2" width="24" height="24" :src="require(`@/assets/${item.icon}`)" :alt="item.name" />
              {{ item.name }}
            </template>
            <template #item="{ item }">
              <img class="mr-2" width="24" height="24" :src="require(`@/assets/${item.icon}`)" :alt="item.name" />
              {{ item.name }}
            </template>
          </app-select>
        </div>
      </div>

      <div class="label font-weight-bold mt-6">Token contract</div>
      <app-text-field placeholder="Enter your link"></app-text-field>
      <div class="label font-weight-bold mt-6">Addtional link (coinmarketcap,...)</div>
      <app-text-field placeholder="Enter your link"></app-text-field>
      <v-btn class="linear-blue--bg white--text font-weight-bold text-none mt-6" depressed block height="40">
        Continue
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TokenInfo extends Vue {
  tokens = [
    {
      icon: 'icons/bsc-icon.svg',
      name: 'Chain 1',
    },
    {
      icon: 'icons/bsc-icon.svg',
      name: 'Chain 2',
    },
  ]
}
</script>

<style lang="scss" scoped>
.label {
  font-size: em(18);
  margin-bottom: em(8);
}
</style>
