<template>
  <div>
    <v-sheet
      class="rounded-lg pa-6 row dense no-gutters"
      v-if="!vm.isFunded && vm.poolVersion === 'v2'"
      outlined
      elevation="3"
      color="neutral100"
    >
      <v-col class="d-flex align-center">
        <div class="red--text font-italic text-decoration-underline" style="font-size: 14px">
          You have not funded your reward yet! Please fund your rewards for users
        </div>
      </v-col>
      <v-col cols="auto">
        <v-btn class="white--text linear-blue--bg" @click="toggleDialog"> Fund rewards </v-btn>
      </v-col>
    </v-sheet>
    <v-dialog v-model="dialog" max-width="600" class="overflow-hidden" :persistent="vm.funding">
      <v-sheet color="neutral100" class="pa-4">
        <v-form ref="form" v-model="valid">
          <div class="text-h5 font-weight-bold d-flex justify-center">Fund your rewards</div>
          <div class="d-flex mt-4">
            <div class="font-weight-bold">Fund amount:</div>
            <div class="ml-2">{{ vm.tokenBAmount }} {{ vm.tokenBName }}</div>
          </div>
          <div class="d-flex mt-4">
            <div class="font-weight-bold">Platform Fee ({{ platformFeePercent }}%):</div>
            <div class="ml-2">{{ vm.platformFee }} {{ vm.tokenBName }}</div>
          </div>
          <div class="d-flex mt-4">
            <div class="font-weight-bold">Total:</div>
            <div class="ml-2">{{ vm.totalToFund }} {{ vm.tokenBName }}</div>
          </div>

          <div class="font-weight-bold mt-4">Token address</div>
          <app-text-field
            v-model="vm.tokenBAddress"
            height="40"
            :rules="[$rules.required, $rules.isAddress]"
            :disabled="vm.funding || vm.approving"
            placeholder="Enter your token address"
            @input="vm.onTokenAddressChange($event)"
          >
          </app-text-field>

          <div class="text-caption text-decoration-underline font-italic">
            Please make sure your wallet has enough tokens so that the funding process won't go wrong
          </div>

          <div class="mt-4 d-flex justify-center">
            <v-btn
              v-if="!valid || !vm.approved"
              class="white--text"
              :class="{
                'linear-blue--bg': valid,
              }"
              @click="vm.approve()"
              :disabled="!valid"
              :loading="vm.approvedChecking || vm.approving"
              >Approve</v-btn
            >
            <v-btn
              v-else
              class="white--text"
              :class="{
                'linear-blue--bg': valid,
              }"
              @click="fund"
              :disabled="!valid"
              :loading="vm.funding"
              >Fund rewards</v-btn
            >
          </div>
        </v-form>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop, Ref, Inject } from 'vue-property-decorator'
import { get } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'
import { EMPTY_STRING } from '@/constants'
import { ProjectDetailViewModel } from '../viewmodels/project-detail-viewmodel'

@Observer
@Component
export default class FundedButtonContainer extends Vue {
  @Inject() vm!: ProjectDetailViewModel

  @Ref('form') readonly form!: HTMLFormElement
  dialog = false
  tokenAddress = EMPTY_STRING
  valid = false
  platformFeePercent = process.env.VUE_APP_FEE_PERCENT

  toggleDialog() {
    this.dialog = !this.dialog
    this.form && this.form.reset()
    this.form && this.form.resetValidation()
  }

  async fund() {
    await this.vm.fund()
    this.dialog = false
  }
}
</script>

<style></style>
