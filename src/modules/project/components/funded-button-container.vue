<template>
  <div>
    <v-sheet class="rounded-lg pa-6 row dense no-gutters" v-if="!isFunded" outlined elevation="3" color="neutral100">
      <v-col class="d-flex align-center">
        <div class="red--text font-italic text-decoration-underline" style="font-size: 14px">
          You have not funded your reward yet! Please fund your rewards for users
        </div>
      </v-col>
      <v-col cols="auto">
        <v-btn class="white--text linear-blue--bg" @click="toggleDialog"> Fund rewards </v-btn>
      </v-col>
    </v-sheet>
    <v-dialog v-model="dialog" max-width="600" class="overflow-hidden">
      <v-sheet color="neutral100" class="pa-4">
        <v-form ref="form">
          <div class="text-h5 font-weight-bold d-flex justify-center">Fund your rewards</div>
          <div class="d-flex mt-4">
            <div class="font-weight-bold">Fund amount:</div>
            <div class="ml-2">300 TOKEN</div>
          </div>

          <div class="font-weight-bold mt-4">Token address</div>
          <app-text-field
            v-model="tokenAddress"
            height="40"
            :rules="[$rules.required]"
            placeholder="Enter your token address"
            @input="onTokenAddressChange"
          >
          </app-text-field>

          <div class="text-caption text-decoration-underline font-italic">
            Please make sure your wallet has enough tokens so that the funding process won't go wrong
          </div>

          <div class="mt-4 d-flex justify-center">
            <v-btn
              class="white--text"
              :class="{
                'linear-blue--bg': valid,
              }"
              @click="onSubmit"
              :disabled="!valid"
              >Fund rewards</v-btn
            >
          </div>
        </v-form>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop, Ref } from 'vue-property-decorator'
import { get } from 'lodash-es'
import { RoutePaths } from '@/router'
import { Observer } from 'mobx-vue'
import { EMPTY_STRING } from '@/constants'

@Component
export default class FundedButtonContainer extends Vue {
  @Prop({ required: true }) isFunded!: boolean
  @Ref('form') readonly form!: HTMLFormElement
  dialog = false
  tokenAddress = EMPTY_STRING
  valid = false

  toggleDialog() {
    this.dialog = !this.dialog
  }

  onTokenAddressChange() {
    if (this.form.validate()) {
      this.valid = true
    } else {
      this.valid = false
    }
  }

  onSubmit() {
    this.form.validate()
  }
}
</script>

<style></style>
