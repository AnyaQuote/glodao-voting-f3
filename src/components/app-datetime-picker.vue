<template>
  <v-sheet class="row ma-0">
    <div class="col-12 col-sm-6 pa-0 pr-4">
      <div class="font-weight-bold mb-2">
        <slot name="date-label">{{ dateLabel }}</slot>
      </div>
      <v-menu min-width="auto" offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <app-text-field
            readonly
            v-on="on"
            :disabled="disabled"
            :rules="rules"
            :value="data.date"
            placeholder="YYYY-MM-DD"
          />
        </template>
        <v-date-picker
          reactive
          color="blue-diversity"
          :min="min"
          :max="max"
          :value="data.date"
          @change="onDateChange"
        />
      </v-menu>
    </div>
    <v-spacer />
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
            placeholder="hh:mm"
          />
        </template>
        <v-time-picker format="24hr" color="blue-diversity" :value="data.time" @change="onTimeChange" />
      </v-menu>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { set, isEmpty } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getDateFromISO, getTheDateAfterISO, toISO, getTimeFromISO } from '@/helpers/date-helper'

@Observer
@Component
export default class AppDateTimePicker extends Vue {
  @Prop({ default: '' }) value!: string
  @Prop({ default: null }) maxDate!: any
  @Prop({ default: null }) minDate!: any
  @Prop({ default: false }) disabled!: any
  @Prop({ default: 'Date' }) dateLabel!: string
  @Prop({ default: 'Time' }) timeLabel!: string
  @Prop({ default: () => [] }) rules!: any[]

  data = { date: '', time: '' }

  mounted() {
    if (this.value) {
      this.data = {
        date: getDateFromISO(this.value),
        time: getTimeFromISO(this.value),
      }
    }
  }

  get min() {
    return this.minDate ? getTheDateAfterISO(this.minDate) : null
  }

  get max() {
    return this.maxDate ? getDateFromISO(this.maxDate) : null
  }

  onDateChange(value: any) {
    this.data = set(this.data, 'date', value)
  }

  onTimeChange(value: any) {
    this.data = set(this.data, 'time', value)
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
