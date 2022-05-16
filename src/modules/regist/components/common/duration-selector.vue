<template>
  <div>
    <div class="pr-3 mb-5" :width="$vuetify.breakpoint.xs ? '100%' : '50%'">
      <app-select :items="tokenDistributeTime" :value="selectedTokenDistributeTime" @change="onSelectDistributeTime">
        <template v-slot:selection="{ item }">
          {{ `${item} ${selectedTokenDistributeTimeOption}${item > 1 ? 's' : ''}` }}
        </template>
        <template v-slot:item="{ item }">
          {{ `${item} ${selectedTokenDistributeTimeOption}${item > 1 ? 's' : ''}` }}
        </template>
      </app-select>
    </div>
    <v-radio-group
      row
      hide-details
      :value="selectedTokenDistributeTimeOption"
      @change="onSelectTokenDistributeTimeOption"
    >
      <v-radio v-for="option in tokenDistributeTimeOptions" :key="option" :value="option">
        <template #label>
          <div class="font-weight-600 text-capitalize pr-6">
            {{ option + 'ly' }}
          </div>
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DurationField extends Vue {
  tokenDistributeTimeOptions = ['week', 'month', 'year']
  selectedTokenDistributeTimeOption = this.tokenDistributeTimeOptions[0]
  selectedTokenDistributeTime = this.tokenDistributeTime[0] ?? 1

  get tokenDistributeTime() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }

  onSelectDistributeTime(val: any): void {
    this.selectedTokenDistributeTime = val
  }
  onSelectTokenDistributeTimeOption(val: string): void {
    this.selectedTokenDistributeTimeOption =
      this.tokenDistributeTimeOptions.find((option) => option === val) ?? this.selectedTokenDistributeTimeOption
  }
}
</script>

<style scoped></style>
