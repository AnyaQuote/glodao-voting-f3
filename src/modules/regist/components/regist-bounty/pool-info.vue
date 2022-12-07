<template>
  <v-sheet class="neutral100--bg rounded-lg" outlined>
    <v-chip
      class="font-18 font-weight-bold neutral-0--text text-uppercase text-center ma-5 pa-6"
      color="app-blue"
      label
      outlined
    >
      Bounty Pool Information
    </v-chip>

    <v-form ref="fund-info-form" @input="vm.changeFormState" class="pa-6">
      <!-- ----------------------------------- REWARD INFORMATION ----------------------------------------- -->
      <div class="blue-diversity--text font-18 font-weight-bold">Mission Information</div>
      <div class="flex-grow-1 mb-2 d-flex flex-column flex-sm-row justify-space-between">
        <span class="font-weight-bold font-18 mr-1">Total missions<span class="app-red--text">*</span></span>
        <i class="red--text">*Each mission requires amount of {{ vm.feePerMission }} BUSD</i>
      </div>
      <app-text-field
        class="font-18"
        :rules="[$rules.required, $rules.integer, $rules.min(1)]"
        :value="$_get(vm.projectInfo, 'totalMissions')"
        @input="vm.changeProjectInfo('totalMissions', $event)"
        placeholder="Enter number of missions"
      ></app-text-field>
      <!-- <div class="font-18 font-weight-bold mb-2">Token reward address<span class="app-red--text">*</span></div> -->
      <!-- <app-text-field
        :rules="[$rules.required, $rules.isAddress]"
        :value="$_get(vm.projectInfo, 'tokenAddress')"
        @change="vm.changeProjectInfo('tokenAddress', $event)"
        placeholder="Enter address"
      ></app-text-field> -->
      <div class="d-flex flex-column flex-sm-row">
        <div class="flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Mission fee amount</div>
          <app-text-field
            readonly
            :rules="[$rules.required, $rules.floatNumberOnly]"
            :value="vm.missionFee"
            placeholder="Enter amount"
            class="pb-0"
          ></app-text-field>
        </div>
        <div class="pl-sm-6 flex-grow-1">
          <div class="font-18 font-weight-bold mb-2">Token name<span class="app-red--text">*</span></div>
          <v-autocomplete
            item-text="tokenName"
            item-value="tokenAddress"
            :items="vm.tokenList"
            solo
            outlined
            flat
            :value="$_get(vm.projectInfo, 'tokenAddress')"
            :rules="[$rules.required]"
            @input="vm.changeProjectInfo('tokenAddress', $event)"
          ></v-autocomplete>
        </div>
      </div>

      <!-- ----------------------------------- VOTING DURATION --------------------------------------------- -->
      <!-- <div class="mt-2">
        <span class="font-18 font-weight-bold blue-diversity--text">Voting duration</span>
        <i class="neutral-10--text ml-2">(Locale time)</i>
      </div>
      <div class="font-italic text-subtitle-1 neutral-10--text mb-2">
        *Voting duration is 3 days counting from the project creation date. The time is mark when you begin creating
        this project.
      </div>
      <div class="mb-1 font-18">
        <span class="font-weight-bold">Your project voting will start in: </span>
        <span>{{ $_get(vm.projectInfo, 'votingStart') | ddmmyyyy }}</span>
      </div>
      <div class="font-18">
        <span class="font-weight-bold">Your project voting will end in: </span>
        <span>{{ $_get(vm.projectInfo, 'votingEnd') | ddmmyyyy }}</span>
      </div> -->

      <!-- ----------------------------------- PROJECT REWARD ---------------------------------------------- -->
      <reward-distribution-info />
      <!-- ------------------------------------------------------------------------------------------------- -->

      <!-- ------------------------------------ CAMPAIGN INFORMATION --------------------------------------- -->
      <div class="mt-7">
        <span class="font-18 font-weight-bold blue-diversity--text">Campaign Information</span>
        <i class="neutral-10--text ml-2">(Local time)</i>
      </div>

      <app-datetime-picker2
        class="font-18"
        :min="vm.currentTime.toISOString()"
        :rules="[$rules.required]"
        @change="vm.changeProjectInfo('projectDates', $event)"
        :value="[vm.projectInfo.startDate, vm.projectInfo.endDate]"
      />

      <!-- ------------------------------------------------------------------------------------------------- -->

      <div class="d-flex">
        <v-btn
          class="font-weight-bold text-none text-subtitle-1 mt-6 flex-grow"
          depressed
          outlined
          height="40"
          width="100%"
          :disabled="!vm.formState || vm.tokenInfoLoading"
          @click.prevent="goBackPreviousStep"
        >
          Back
        </v-btn>
        <div class="mx-3" />
        <v-btn
          class="mt-7 font-weight-600 text-none text-subtitle-1 flex-grow"
          :class="{ 'linear-blue--bg white--text': vm.formState && !vm.tokenInfoLoading }"
          :disabled="!vm.formState || vm.tokenInfoLoading"
          width="100%"
          height="40"
          depressed
          @click="submit"
        >
          Continue
        </v-btn>
      </div>
    </v-form>
    <confirm-campaign-dialog ref="confirm-dialog" />
  </v-sheet>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'
import { BountyApplyViewModel } from '../../viewmodels/bounty-apply-viewmodel'

@Observer
@Component({
  components: {
    'confirm-campaign-dialog': () => import('../regist-bounty/confirm-campaign-dialog.vue'),
    'app-datetime-picker2': () => import('@/components/app-datetime-picker2.vue'),
    'reward-distribution-info': () => import('./reward-distribution-info.vue'),
  },
})
export default class RaisingInfo extends Vue {
  @Inject() vm!: BountyApplyViewModel
  @Ref('confirm-dialog') dialog
  @Ref('fund-info-form') form
  submit() {
    this.form.validate() && this.dialog.open()
  }
  goBackPreviousStep() {
    this.vm.changeStep(1.1)
  }
}
</script>

<style lang="scss" scoped></style>
