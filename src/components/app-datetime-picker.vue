<template>
  <v-form ref="form">
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
              placeholder="DD/MM/YYYY"
            />
          </template>
          <v-date-picker
            reactive
            color="blue-diversity"
            :min="minDate"
            :max="maxDate"
            :value="data.date"
            @change="onDateChange"
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
              placeholder="HH:mm (24 hrs)"
            />
          </template>
          <v-time-picker format="24hr" color="blue-diversity" :value="data.time" @change="onTimeChange" />
        </v-menu>
      </div>
    </v-sheet>
  </v-form>
</template>

<script lang="ts">
import { set, isEmpty } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Vue, Watch, Prop, Ref } from 'vue-property-decorator'
import { getDateFromISO, toISO, getTimeFromISO } from '@/helpers/date-helper'
import moment from 'moment'

@Observer
@Component
export default class AppDateTimePicker extends Vue {
  @Ref() form: any
  @Prop({ default: '' }) value!: string
  @Prop({ default: '' }) maxDate!: any
  @Prop({ default: '' }) minDate!: any
  @Prop({ default: false }) disabled!: any
  @Prop({ default: 'Date' }) dateLabel!: string
  @Prop({ default: 'Time' }) timeLabel!: string
  @Prop({ default: () => [] }) rules!: any[]

  data = { date: '', time: '' }

  get formattedDate() {
    return this.data.date ? moment(this.data.date).format('DD/MM/YYYY') : ''
  }

  mounted() {
    if (this.value) {
      this.data = {
        date: getDateFromISO(this.value),
        time: getTimeFromISO(this.value),
      }
    }
  }

  onDateChange(value: any) {
    this.data = set(this.data, 'date', value)
    this.form.validate()
  }

  onTimeChange(value: any) {
    this.data = set(this.data, 'time', value)
    this.form.validate()
  }

  @Watch('data', { deep: true })
  onDataUpdate(value: any) {
    if (Object.values(value).every((x) => !isEmpty(x))) {
      this.$emit('change', toISO(value))
    }
  }
}
</script>

<style lang="scss" scoped></style>
