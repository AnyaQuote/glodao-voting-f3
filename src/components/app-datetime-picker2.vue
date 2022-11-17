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
              :value="start.date"
              :error-messages="startDateError"
              placeholder="DD/MM/YYYY"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            :min="min"
            :max="max"
            v-model="start.date"
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
              :value="start.time"
              :error-messages="startDateError"
              placeholder="HH:mm"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            format="24hr"
            v-model="start.time"
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
              :value="end.date"
              :error-messages="endDateError"
              placeholder="DD/MM/YYYY"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            :min="min"
            :max="max"
            v-model="end.date"
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
              :value="end.time"
              :error-messages="endDateError"
              placeholder="HH:mm"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-time-picker
            format="24hr"
            v-model="end.time"
            :color="$vuetify.theme.dark ? 'blue-2 white--text' : 'blue-diversity white--text'"
          />
        </v-menu>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import EventBus from '@/plugins/event-bus'
import moment, { Moment } from 'moment'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

interface DateTime {
  date?: string | null
  time?: string | null
}

interface MomentDateTime {
  start?: Moment | null
  end?: Moment | null
}

@Component
export default class AppDateTimePicker2 extends Vue {
  @Prop({ default: null }) value?: string[]
  @Prop(String) max?: string
  @Prop(String) min?: string
  @Prop({ default: () => [] }) rules!: any[]

  start: DateTime = { date: null, time: null }
  end: DateTime = { date: null, time: null }
  mt: MomentDateTime = { start: null, end: null }
  mtCurrent: Moment = moment()

  mounted() {
    EventBus.$on('subscribe-time', this.updateCurrentTime)
    this.value?.forEach((iso, index) => {
      const miso = iso ? moment(iso) : null
      if (index === 0 && miso !== null) {
        this.start.date = miso.format('yyyy-MM-DD')
        this.start.time = miso.format('HH:mm')
      }
      if (index === 1 && miso !== null) {
        this.end.date = miso.format('yyyy-MM-DD')
        this.end.time = miso.format('HH:mm')
      }
    })
  }

  beforeDestroy() {
    EventBus.$off('subscribe-time', this.updateCurrentTime)
  }

  updateCurrentTime(e: Moment) {
    this.mtCurrent = e
  }

  @Watch('start', { deep: true })
  onStartDateTimeChanged(start: DateTime) {
    if (start.time && start.date) {
      this.mt.start = moment(`${start.date} ${start.time}`)
    }
  }

  @Watch('end', { deep: true })
  onEndDateTimeChanged(end: DateTime) {
    if (end.time && end.date) {
      this.mt.end = moment(`${end.date} ${end.time}`)
    }
  }

  @Watch('mt', { deep: true })
  onEndMomentChange(mt: MomentDateTime) {
    if (this.startDateError || this.endDateError) return
    const start = mt.start?.toISOString() || null
    const end = mt.end?.toISOString() || null
    this.$emit('change', [start, end])
  }

  get mtMin(): Moment | null {
    return this.min ? moment(this.min) : null
  }

  get mtMax(): Moment | null {
    return this.max ? moment(this.max) : null
  }

  get startDateError() {
    if (!this.mt.start) return ''

    if (this.mtMin?.isAfter(this.mt.start)) {
      return `Must be after ${this.mtMin.format('DD/MM/yyyy HH:mm')}`
    }

    if (this.mtMax?.isBefore(this.mt.start)) {
      return `Must be before ${this.mtMax.format('DD/MM/yyyy HH:mm')}`
    }

    if (this.mtCurrent.isAfter(this.mt.start)) {
      return `Must be after ${this.mtCurrent.format('DD/MM/yyyy HH:mm')}`
    }

    if (this.mt.end?.isBefore(this.mt.start)) {
      return `Must be before ${this.mt.end.format('DD/MM/yyyy HH:mm')}`
    }
    return ''
  }

  get endDateError() {
    if (!this.mt.end) return ''

    if (this.mtMin?.isAfter(this.mt.end)) {
      return `Must be after ${this.mtMin.format('DD/MM/yyyy HH:mm')}`
    }

    if (this.mtMax?.isBefore(this.mt.start)) {
      return `Must be before ${this.mtMax.format('DD/MM/yyyy HH:mm')}`
    }

    if (this.mtCurrent.isAfter(this.mt.end)) {
      return `Must be after ${this.mtCurrent.format('DD/MM/yyyy HH:mm')}`
    }

    if (this.mt.start?.isAfter(this.mt.end)) {
      return `Must be after ${this.mt.start.format('DD/MM/yyyy HH:mm')}`
    }
    return ''
  }
}
</script>

<style scoped></style>
