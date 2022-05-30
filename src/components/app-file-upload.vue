<template>
  <v-sheet outlined v-ripple class="d-flex align-center rounded px-5">
    <div v-if="imageOnly" class="flex-shrink-0 py-5 pr-5">
      <v-img v-if="preview.value" :src="preview.value" class="rounded" max-height="50" max-width="50"></v-img>
      <v-img
        v-else
        :src="require('@/assets/icons/file-logo.svg')"
        class="rounded"
        max-height="42"
        max-width="42"
      ></v-img>
    </div>
    <v-file-input
      v-bind="$attrs"
      class="flex-grow-1 py-5"
      show-size
      prepend-icon=""
      persistent-hint
      single-line
      :hint="config.hint"
      :accept="config.accept"
      :value="data"
      @change="onChange"
      truncate-length="20"
    >
      <template v-slot:label>
        <span class="font-weight-bold">
          {{ preview.text ? preview.text : `Upload your ${config.type}` }}
        </span>
      </template>
    </v-file-input>
    <div class="pl-5 py-5">
      <span v-if="config.isEdit" class="app-blue--text text-subtite-1 font-weight-600">Change</span>
      <v-icon v-else>mdi-upload</v-icon>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { isNil } from 'lodash-es'

type AppFile = File | string | null

const defaultConfig = {
  type: 'file',
  hint: 'Allowed file types: csv, txt, markdown',
  accept: '.csv,.md,.txt',
  isEdit: false,
}

@Component
export default class AppUploadField extends Vue {
  @Prop({ required: true }) value!: AppFile
  @Prop(Boolean) imageOnly!: boolean

  data: AppFile = null
  config = defaultConfig
  preview = { text: '', value: '' }

  mounted() {
    this.config = { ...this.config, isEdit: typeof this.value === 'string' }
    this.preview.value = this.getSource(this.value)
    this.preview.text = this.preview.value.substring(this.preview.value.lastIndexOf('/') + 1)
    this.config = this.imageOnly
      ? { ...this.config, hint: 'Allow file types: png, jpg, svg', accept: '.png,.jpg,.svg', type: 'image' }
      : this.config
  }

  onChange(value: any) {
    this.data = value
    if (this.preview.text) this.preview.text = ''
    this.preview.value = this.getSource(value)
    this.$emit('change', value)
  }

  getSource(value: AppFile) {
    return !isNil(value) ? (typeof value === 'string' ? value : URL.createObjectURL(value)) : ''
  }
}
</script>

<style lang="scss" scoped></style>
