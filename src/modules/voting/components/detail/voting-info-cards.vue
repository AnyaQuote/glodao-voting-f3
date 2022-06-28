<template>
  <div class="row no-gutters">
    <!-- Total reward card -->
    <v-sheet
      class="col-12 col-md-3 mb-2 mb-md-0 mr-md-4 mr-0 rounded-lg pa-6 neutral10--text d-flex flex-row flex-md-column align-md-start align-center justify-start justify-space-between flex-wrap text-truncate"
      elevation="3"
      outlined
    >
      <div class="font-weight-medium">Total reward</div>
      <div class="d-flex align-center">
        <span class="text-h6 font-weight-bold"
          >{{ $_get(vm.poolStore, 'requiredAmount') | formatNumber(2) }} {{ $_get(vm.poolStore, 'tokenName') }}
        </span>
        <v-img src="@/assets/icons/crypto.svg" class="ml-2" max-width="24" max-height="24" />
      </div>
    </v-sheet>
    <!-- Total mission card -->
    <v-sheet
      class="col-12 col-md-3 mb-2 mb-md-0 mr-md-4 mr-0 rounded-lg pa-6 neutral10--text mr-4 d-flex flex-row flex-md-column align-md-start align-center justify-start justify-space-between flex-wrap text-truncate"
      elevation="3"
      outlined
    >
      <div class="font-weight-medium">Total missions</div>
      <div class="d-flex align-center">
        <span class="text-h6 font-weight-bold">{{ $_get(vm.poolStore, 'totalMission') }} </span>
        <v-img src="@/assets/icons/bulleyes.svg" class="ml-2" max-width="24" max-height="24" />
      </div>
    </v-sheet>
    <!-- Mission reward card -->
    <v-sheet
      class="col-12 col-md-3 mb-2 mb-md-0 mr-0 mr-md-4 rounded-lg pa-6 neutral10--text d-flex flex-row flex-md-column align-md-start align-center justify-start justify-space-between flex-wrap text-truncate"
      elevation="3"
      outlined
    >
      <span class="font-weight-medium">Mission reward</span>
      <div class="d-flex align-center">
        <span class="text-h6 font-weight-bold"
          >{{ $_get(vm.poolStore, 'rewardPerMission') | formatNumber(2) }} {{ $_get(vm.poolStore, 'tokenName') }}</span
        >
        <v-img src="@/assets/icons/crypto.svg" class="ml-2" max-width="24" max-height="24" />
      </div>
    </v-sheet>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on" class="align-stretch mt-2" color="grey2">mdi-information</v-icon>
      </template>
      <span>Token rewards are calculated according to the price at the time of pool closing</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator'
import { VotingDetailViewModel } from '../../viewmodels/voting-detail-viewmodel'

@Component
export default class DetailInfoCard extends Vue {
  @Inject() vm!: VotingDetailViewModel
}
</script>

<style scoped></style>
