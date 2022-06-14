<template>
  <v-sheet outlined class="d-flex align-center rounded px-5">
    <div v-if="isImageFile" class="flex-shrink-0 py-5 mr-5">
      <v-img v-if="preview.value" :src="preview.value" class="rounded" max-with="50" aspect-ratio="1"></v-img>
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
      truncate-length="20"
      :label="config.label"
      :hint="config.hint"
      :accept="config.accept"
      :value="data"
      :error-messages="config.error"
      @change="onChange"
    >
      <template v-slot:selection="{ text }">
        <span class="font-weight-bold">
          {{ preview.name || text }}
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
import { checkQuizFile } from '@/helpers/file-helper'
import { Component, Vue, Prop } from 'vue-property-decorator'

type AppFile = File | string | null

interface FileConfig {
  label?: string
  hint?: string
  accept?: string
  isEdit?: boolean
  error?: string
}

@Component
export default class AppUploadField extends Vue {
  @Prop({ default: null }) value!: AppFile
  @Prop(Boolean) isImageFile!: boolean
  @Prop(Boolean) isQuizFile!: boolean

  data: AppFile = null
  config: FileConfig = {}
  preview = { name: '', value: '' }

  mounted() {
    this.config = {
      label: `Upload your ${this.isImageFile ? 'image' : 'file'}`,
      hint: this.isImageFile ? 'Allow file types: png, jpg, svg' : 'Allowed file types: csv, txt, markdown',
      accept: this.isImageFile ? '.png,.jpg,.svg' : '.csv,.md,.txt,.rtf',
      isEdit: !!this.value,
      error: '',
    }

    if (this.value && typeof this.value === 'string') {
      this.preview = { value: this.getSource(this.value), name: this.value.split('/').pop() || '' }
    } else if (this.value && this.value instanceof File) {
      this.data = this.value

      if (/^(image)\/.*$/.test(this.value.type)) {
        this.preview = { ...this.preview, value: this.getSource(this.value) }
      }
    }
  }

  async onChange(event: any) {
    let value = (this.data = event)
    if (this.isQuizFile) {
      this.config.error = await checkQuizFile(value)
      value = this.config.error ? null : value
    }

    if (this.isImageFile) {
      this.preview.name && (this.preview.name = '')
      this.preview.value = this.getSource(value)
    }
    this.$emit('change', value)
  }

  getSource(value: AppFile) {
    if (value && value instanceof File && /^(image)\/.*$/.test(value.type)) {
      return URL.createObjectURL(value)
    } else if (value && typeof value === 'string') return value
    return ''
  }
}
</script>

<style lang="scss" scoped></style>
