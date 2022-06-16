<template>
  <v-sheet class="row ma-0">
    <div class="col-12 col-md-6 pa-0 pr-md-4 pr-0">
      <div class="font-weight-bold mb-2">{{ dateLabel }}<span class="app-red--text">*</span></div>
      <app-text-field
        readonly
        :rules="rules"
        :disabled="disabled"
        :value="formattedDate"
        :error-messages="errorMessage"
        placeholder="DD/MM/YYYY"
        @click="show('datePickerConfig', $event)"
      />
      <v-menu
        absolute
        offset-y
        min-width="auto"
        v-model="datePickerConfig.show"
        :position-x="datePickerConfig.x"
        :position-y="datePickerConfig.y"
      >
        <v-date-picker
          reactive
          :color="pickerBackground"
          :min="minDate"
          :max="maxDate"
          :value="data.date"
          @input="onDateTimeChange('date', $event)"
        />
      </v-menu>
    </div>
    <div class="col-12 col-md-6 pa-0">
      <div class="font-weight-bold mb-2">{{ timeLabel }}<span class="app-red--text">*</span></div>
      <app-text-field
        readonly
        :rules="rules"
        :disabled="disabled"
        :value="data.time"
        :error-messages="errorMessage"
        placeholder="hh:mm (am - pm)"
        @click="show('timePickerConfig', $event)"
      />
      <v-menu
        absolute
        offset-y
        min-width="auto"
        v-model="timePickerConfig.show"
        :position-x="timePickerConfig.x"
        :position-y="timePickerConfig.y"
        :close-on-content-click="false"
      >
        <v-time-picker
          format="ampm"
          :color="pickerBackground"
          :value="data.time"
          @input="onDateTimeChange('time', $event)"
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
import moment from 'moment'

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
  datePickerConfig = { show: false, x: 0, y: 0 }
  timePickerConfig = { show: false, x: 0, y: 0 }

  mounted() {
    if (this.value) {
      this.data = {
        date: getValueByFormat(this.value),
        time: getValueByFormat(this.value, 'HH:mm'),
      }
    }
  }

  /**
   * Get pointer position on screen and set it as show position for v-menu
   * @param config config name
   * @param event
   */
  show(config: string, event: any) {
    event.preventDefault()
    this[config].show = false
    this[config].x = event.clientX
    this[config].y = event.clientY
    this.$nextTick(() => {
      this[config].show = true
    })
  }

  // /**
  //  * Check if all values in object is not empty string
  //  * @param value object
  //  */
  // checkPropNotEmpty(value: { [key: string]: string }) {
  //   return Object.values(value).every((x) => x !== '')
  // }

  onDateTimeChange(property: string, value: string) {
    this.data = set(this.data, property, value)
    if (this.data.date && this.data.time && !this.errorMessage) {
      this.$emit('change', toISO(this.data))
    }
  }

  get formattedDate() {
    return this.data.date ? getValueByFormat(this.data.date, 'DD/MM/YYYY') : ''
  }

  get errorMessage() {
    if (this.data.date && this.data.time) {
      if (this.minDate && !moment(toISO(this.data)).isAfter(moment(this.minDate))) {
        return `Selected date must be after ${moment(this.minDate).format('DD/MM/YYYY HH:mm')}`
      } else if (this.maxDate && !moment(toISO(this.data)).isBefore(moment(this.maxDate))) {
        return `Selected date must be before ${moment(this.maxDate).format('DD/MM/YYYY HH:mm')}`
      }
    }
    return ''
  }

  get pickerBackground() {
    return this.$vuetify.theme.dark ? 'blue-2 white--text' : 'blue-diversity white--text'
  }
}
</script>

<style lang="scss" scoped></style>
