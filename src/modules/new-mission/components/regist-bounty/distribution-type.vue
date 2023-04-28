<template>
  <div class="mt-n3">
    <v-radio-group :rules="[$rules.required]" mandatory :value="type" @change="onChange">
      <div class="d-flex">
        <div class="flex-grow">
          <v-sheet class="rounded pa-5 fill-height" outlined :class="isActive(tokenType)">
            <v-radio color="blue-diversity" :value="tokenType">
              <template #label>
                <span class="font-18 font-weight-bold" :class="isActive(tokenType)">
                  <span>Project token</span>
                </span>
              </template>
            </v-radio>
            <div class="text-subtitle-2 font-weight-regular">Distribute reward using project token</div>
          </v-sheet>
        </div>

        <div class="mx-3" />

        <div class="flex-grow">
          <v-sheet class="rounded pa-5 fill-height" outlined :class="isActive(busdType)">
            <v-radio color="blue-diversity" :value="busdType">
              <template #label>
                <span class="font-18 font-weight-bold" :class="isActive(busdType)">BUSD</span>
              </template>
            </v-radio>
            <div class="text-subtitle-2 font-weight-regular">Distribute reward using BUSD</div>
          </v-sheet>
        </div>
      </div>
    </v-radio-group>
  </div>
</template>

<script lang="ts">
import { RewardDistributionType } from '@/models/VotingModel'
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Observer
@Component
export default class DistributionType extends Vue {
  @Prop(String) value!: string
  type = this.value
  readonly busdType = RewardDistributionType.BUSD
  readonly tokenType = RewardDistributionType.TOKEN
  onChange(value: string) {
    this.type = value
    this.$emit('change', this.type)
  }
  get isActive() {
    return (type: string) => (this.type === type ? 'active-type' : '')
  }
}
</script>

<style scoped>
.active-type {
  color: var(--v-blue-diversity-base);
  border-color: var(--v-blue-diversity-base);
  background-color: var(--v-blue-2-base) !important;
}
</style>
