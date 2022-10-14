<template>
  <div>
    <v-sheet class="d-flex flex-column flex-sm-row">
      <div class="flex-grow">
        <div class="font-weight-bold mb-2">Start date<span class="app-red--text">*</span></div>
        <v-menu absolute offset-y min-width="auto" transition="scale-transition">
          <template #activator="{ on, attrs }">
            <v-text-field
              readonly
              outlined
              :rules="rules"
              :value="data.startDate | date('DD/MM/YYYY')"
              :error-messages="startDateError"
              placeholder="DD/MM/YYYY"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            reactive
            :min="min"
            :max="max"
            v-model="data.startDate"
            :color="$vuetify.theme.dark ? 'blue-2 white--text' : 'blue-diversity white--text'"
          />
        </v-menu>
      </div>
      <div class="px-4" />
      <div class="flex-grow">
        <div class="font-weight-bold mb-2">Start time<span class="app-red--text">*</span></div>
        <v-menu absolute offset-y min-width="auto" :close-on-content-click="false" transition="scale-transition">
          <template #activator="{ on, attrs }">
            <v-text-field
              readonly
              outlined
              :rules="rules"
              :value="data.startTime"
              :error-messages="startDateError"
              placeholder="HH:mm"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            format="24hr"
            v-model="data.startTime"
            :color="$vuetify.theme.dark ? 'blue-2 white--text' : 'blue-diversity white--text'"
          />
        </v-menu>
      </div>
    </v-sheet>

    <!-- ======================================================================================================== -->

    <v-sheet class="d-flex flex-column flex-sm-row">
      <div class="flex-grow">
        <div class="font-weight-bold mb-2">End date<span class="app-red--text">*</span></div>
        <v-menu absolute offset-y min-width="auto" transition="scale-transition">
          <template #activator="{ on, attrs }">
            <v-text-field
              readonly
              outlined
              :rules="rules"
              :value="data.endDate | date('DD/MM/YYYY')"
              :error-messages="endDateError"
              placeholder="DD/MM/YYYY"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            reactive
            :min="min"
            :max="max"
            v-model="data.endDate"
            :color="$vuetify.theme.dark ? 'blue-2 white--text' : 'blue-diversity white--text'"
          />
        </v-menu>
      </div>
      <div class="px-4" />
      <div class="flex-grow">
        <div class="font-weight-bold mb-2">End time<span class="app-red--text">*</span></div>
        <v-menu absolute offset-y min-width="auto" :close-on-content-click="false" transition="scale-transition">
          <template #activator="{ on, attrs }">
            <v-text-field
              readonly
              outlined
              :rules="rules"
              :value="data.endTime"
              :error-messages="endDateError"
              placeholder="HH:mm"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            format="24hr"
            v-model="data.endTime"
            :color="$vuetify.theme.dark ? 'blue-2 white--text' : 'blue-diversity white--text'"
          />
        </v-menu>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import 'reflect-metadata'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class AppDateTimePicker2 extends Vue {
  @Prop() value?: string[]
  @Prop() max?: string
  @Prop() min?: string
  @Prop({ default: () => [] }) rules!: any[]

  data = {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  }

  @Watch('value', { deep: true })
  onValueChange() {
    this.value?.forEach((e, i) => {
      if (!e) return
      const date = moment(e)
      if (i == 0) {
        this.data.startDate = date.format('YYYY-MM-DD')
        this.data.startTime = date.format('HH:mm')
      } else {
        this.data.endDate = date.format('YYYY-MM-DD')
        this.data.endTime = date.format('HH:mm')
      }
    })
  }

  @Watch('data', { deep: true })
  onStartDateChange() {
    if (this.startDateError || this.endDateError) return

    if (this.mtStart && this.mtEnd) {
      this.$emit('change', [this.mtStart.toISOString(), this.mtEnd.toISOString()])
    }
  }

  get mtStart(): moment.Moment | null {
    if (!this.data.startDate || !this.data.startTime) return null
    return moment(`${this.data.startDate} ${this.data.startTime}`)
  }

  get mtEnd(): moment.Moment | null {
    if (!this.data.endDate || !this.data.endTime) return null
    return moment(`${this.data.endDate} ${this.data.endTime}`)
  }

  get startDateError() {
    if (!this.mtStart) return ''

    if (this.mtEnd && this.mtStart.isAfter(this.mtEnd)) return `Must be before ${this.mtEnd.format('DD/MM/yyyy HH:mm')}`
    return ''
  }

  get endDateError() {
    if (!this.mtEnd) return ''

    if (this.mtStart && this.mtEnd.isBefore(this.mtStart))
      return `Must be after ${this.mtStart.format('DD/MM/yyyy HH:mm')}`
    return ''
  }
}
</script>

<style scoped></style>
