<template>
  <v-sheet class="rounded-lg pa-4 pa-md-6" :outlined="!$vuetify.theme.dark">
    <div class="font18 text-md-h5 font-weight-bold">Bounty pool information setting</div>
    <v-row no-gutters dense class="my-4 my-md-6">
      <v-col cols="12" md="4" class="d-flex flex-md-column justify-space-between mb-2 mb-md-0">
        <div class="neutral-10--text mb-md-1">Total reward amount</div>
        <div class="font-weight-bold">
          {{ vm.poolStore.requiredAmount | formatNumber }} {{ vm.poolStore.tokenName }}
        </div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex flex-md-column justify-space-between mb-2 mb-md-0">
        <div class="neutral-10--text mb-md-1">Total mission</div>
        <div class="font-weight-bold">{{ vm.poolStore.totalMission }}</div>
      </v-col>
      <v-col cols="12" md="4" class="d-flex flex-md-column justify-space-between">
        <div class="neutral-10--text mb-md-1">Reward/mission</div>
        <div class="font-weight-bold">
          {{ vm.poolStore.rewardPerMission | formatNumber }} {{ vm.poolStore.tokenName }}
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div class="d-flex justify-space-between justify-md-start mt-4 mt-md-6">
      <div class="pr-6">Campaign time:</div>
      <div class="d-md-flex">
        <div class="font-weight-bold">Jan 21st, 10:00 pm</div>
        <div
          v-if="$vuetify.breakpoint.mdAndUp"
          style="width: 4px; height: 4px; background: #d9d9d9 !important"
          class="rounded-circle mx-2 align-self-center"
        ></div>
        <div class="font-weight-bold">Jan 21st, 10:00 pm</div>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel
}
</script>

<style scoped></style>
