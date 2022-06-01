<template>
  <v-sheet class="row ma-0">
    <div class="col-12 col-sm-6 pa-0 pr-4">
      <div class="font-weight-bold mb-2">
        <slot name="date-label">{{ dateLabel }}</slot>
      </div>
      <v-menu min-width="auto" offset-y>
        <template v-slot:activator="{ on }">
          <app-text-field
            readonly
            v-on="on"
            :disabled="disabled"
            :rules="rules"
            :value="formattedDate"
            :error-messages="invalidDateRange"
            placeholder="DD/MM/YYYY"
          />
        </template>
        <v-date-picker
          reactive
          color="blue-diversity"
          :min="minDate"
          :max="maxDate"
          :value="data.date"
          @change="onDateTimeChange('date', $event)"
        />
      </v-menu>
    </div>
    <div class="col-12 col-sm-6 pa-0">
      <div class="font-weight-bold mb-2">
        <slot name="time-label">{{ timeLabel }}</slot>
      </div>
      <v-menu min-width="auto" offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <app-text-field
            readonly
            v-on="on"
            :disabled="disabled"
            :rules="rules"
            :value="data.time"
            :errorMessages="invalidDateRange"
            placeholder="HH:mm (24 hrs)"
          />
        </template>
        <v-time-picker
          format="24hr"
          color="blue-diversity"
          :value="data.time"
          @change="onDateTimeChange('time', $event)"
        />
      </v-menu>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { set } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getValueByFormat, toISO, isDateInRange } from '@/helpers/date-helper'

@Observer
@Component
export default class AppDateTimePicker extends Vue {
  @Prop({ default: '' }) value!: string
  @Prop({ default: '' }) maxDate!: any
  @Prop({ default: '' }) minDate!: any
  @Prop({ default: false }) disabled!: any
  @Prop({ default: 'Date' }) dateLabel!: string
  @Prop({ default: 'Time' }) timeLabel!: string
  @Prop({ default: () => [] }) rules!: any[]

  data = { date: '', time: '' }

  mounted() {
    if (this.value) {
      this.data = {
        date: getValueByFormat(this.value),
        time: getValueByFormat(this.value, 'HH:mm'),
      }
    }
  }

  checkPropNotEmpty(value: { [key: string]: string }) {
    return Object.values(value).every((x) => x !== '')
  }

  onDateTimeChange(property: string, value: string) {
    this.data = set(this.data, property, value)
    if (this.checkPropNotEmpty(this.data)) {
      this.$emit('change', toISO(this.data))
    }
  }

  get formattedDate() {
    return this.data.date ? getValueByFormat(this.data.date, 'DD/MM/YYYY') : ''
  }

  get invalidDateRange() {
    if (this.maxDate && this.minDate && this.checkPropNotEmpty(this.data)) {
      if (!isDateInRange(toISO(this.data), this.minDate, this.maxDate)) return 'Invalid date range'
    }
    return ''
  }
}
</script>

<style lang="scss" scoped></style>
