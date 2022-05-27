<template>
  <v-dialog :value="vm.cancelDialog" v-if="vm.poolStore" persistent max-width="500">
    <v-sheet class="rounded-lg pa-6 neutral-100">
      <div class="d-flex mb-4">
        <v-spacer class="font-weight-bold neutral-0--text" style="font-size: 18px">Cancel project</v-spacer>
        <v-icon size="18" :disabled="vm.cancelling" @click="vm.changeCancelDialog(false)">mdi-close</v-icon>
      </div>
      <div class="neutral-0--text mb-4">
        Are you sure cancel this pool! You will only withdraw total token, the creating pool fee can not be pay back.
      </div>
      <div style="font-size: 18px" class="mb-6">
        <div class="d-flex justify-space-between">
          <div class="neutral10--text">Total sent</div>
          <div class="font-weight-bold neutral-0--text">
            {{ vm.poolStore.amount | formatNumber }} {{ vm.poolStore.tokenName }}
          </div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="neutral10--text">Withdraw amount:</div>
          <div class="font-weight-bold neutral-0--text">
            {{ vm.poolStore.amount | formatNumber }} {{ vm.poolStore.tokenName }}
          </div>
        </div>
      </div>
      <v-btn
        elevation="0"
        block
        class="linear-blue--bg text-none text-subtitle-1 rounded white--text"
        :loading="vm.cancelling"
        @click="vm.cancelAndWithdraw()"
      >
        Cancel and withdraw
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
