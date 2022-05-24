<template>
  <v-dialog max-width="438" :value="vm.withdrawDialog" persistent>
    <v-sheet class="pa-6 pa-6">
      <div class="font-weight-bold mb-4 neutral0--text d-flex justify-space-between" style="font-size: 18px">
        <div>Withdraw token</div>
        <v-icon size="22" @click="vm.changeWithdrawDialog(false)">mdi-close</v-icon>
      </div>
      <div class="font-weight-400 neutral0--text mb4 text-subtitle-1 mb-4">
        Your project is rejected for launch so you can withdraw the total amount of tokens sent!
      </div>
      <div class="d-flex justify-space-between mn-4" style="font-size: 18px">
        <div class="neutral10--text">Total sent</div>
        <div class="neutral0--text">{{ 1000 | formatNumber(2, 2) }}HWD</div>
      </div>

      <div style="border: 1px solid var(--v-neutral20-base)" class="rounded-lg py-4 text-center mb-4">
        <div style="font-size: 18px" class="neutral10--text mb-1">Withdraw amount</div>
        <div class="text-h5 neutral0--text font-weight-bold">{{ 1000 | formatNumber(2, 2) }} HWD</div>
      </div>

      <v-btn
        block
        elevation="0"
        color="linear-blue--bg"
        class="rounded text-none neutral100--text"
        style="letter-spacing: 0px"
      >
        Withdraw all
      </v-btn>
    </v-sheet>
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
