<template>
  <v-dialog :value="vm.cancelDialog" v-if="vm.poolStore" persistent max-width="438">
    <div class="rounded-lg pa-6 neutral-100">
      <!-- HEADER -->
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="font-weight-bold font-18">Cancel project</div>
        <v-icon size="18" :disabled="vm.cancelling" @click="vm.changeCancelDialog(false)">mdi-close</v-icon>
      </div>

      <!-- CAPTION -->
      <div class="mb-6">Your project is rejected for launch so you can withdraw the total amount of tokens sent!</div>

      <!-- TOTAL SENT -->
      <div class="d-flex justify-space-between mb-4">
        <div class="font-18 neutral-10--text">Total sent</div>
        <div class="font-18 font-weight-bold">
          {{ $_get(vm.poolStore, 'requiredAmount') | formatNumber }} {{ $_get(vm.poolStore, 'tokenName') }}
        </div>
      </div>

      <!-- WITHDRAW AMOUNT -->
      <div class="rounded-lg text-center py-4" style="border: 1px solid var(--v-neutral-20-base)">
        <div class="font-18 neutral-10--text">Withdraw amount</div>
        <div class="text-h5 font-weight-600">
          {{ $_get(vm.poolStore, 'requiredAmount') | formatNumber }} {{ $_get(vm.poolStore, 'tokenName') }}
        </div>
      </div>

      <div class="text-subtitle-2 font-italic font-weight-regular mb-6 mt-1">*Cancel fee is 5% reward amount</div>

      <!-- BUTTON -->
      <v-btn
        depressed
        block
        class="linear-blue--bg rounded text-subtitle-1 app-blue--text text--lighten-1"
        :loading="vm.cancelling"
        @click="vm.cancelAndWithdraw()"
      >
        Withdraw all
      </v-btn>
    </div>
  </v-dialog>
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
