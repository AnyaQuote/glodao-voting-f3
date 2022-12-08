<template>
  <v-sheet outlined class="d-flex align-center rounded px-5">
    <div v-if="isImageFile" class="mr-5">
      <v-img v-if="source" :src="source" class="rounded" height="50" width="50" />
      <v-img v-else :src="require('@/assets/icons/file-logo.svg')" max-height="42" max-width="42" />
    </div>
    <v-file-input
      ref="file-input"
      class="py-5"
      show-size
      prepend-icon=""
      persistent-hint
      truncate-length="20"
      :label="config.label"
      :hint="config.hint"
      :accept="config.accept"
      :rules="rules"
      :value="data"
      :error-messages="config.error"
      @change="onChange"
    >
      <template v-slot:selection="{ text }">
        <span class="font-weight-600"> {{ text }} </span>
      </template>
    </v-file-input>
    <div @click="openFileInput()" class="pl-5 py-5 cursor-pointer">
      <span v-if="config.isEdit" class="app-blue--text text-subtite-1 font-weight-600">Change</span>
      <v-icon v-else>mdi-upload</v-icon>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { checkQuizFile } from '@/helpers/file-helper'
import { Component, Vue, Prop, Ref } from 'vue-property-decorator'

@Component
export default class AppUploadField extends Vue {
  @Prop({ default: null }) value!: File | null
  @Prop(Boolean) isImageFile!: boolean
  @Prop(Boolean) isQuizFile!: boolean
  @Prop({ default: () => [] }) rules!: any
  @Ref('file-input') fileInput: any

  data = this.value
  config: FileConfig = {
    label: `Upload your ${this.isImageFile ? 'image' : 'file'}`,
    hint: this.isImageFile ? 'Allow file types: png, jpg, svg' : 'Allowed file types: csv, txt',
    accept: this.isImageFile ? '.png,.jpg,.svg' : '.csv,.txt',
    isEdit: !!this.data,
    error: '',
  }

  openFileInput() {
    this.fileInput.$refs.input.click()
  }

  async onChange(event: any) {
    let value = (this.data = event)
    if (this.isQuizFile) {
      const res = await checkQuizFile(value)
      if (typeof res == 'string') {
        this.config.error = res
      } else {
        this.config.error = undefined
        this.$emit('count:quiz', res.count)
      }
      value = this.config.error ? null : value
    }
    this.$emit('change', value)
  }

  get source() {
    return this.data && this.data instanceof File && /^(image)\/.*$/.test(this.data.type)
      ? URL.createObjectURL(this.data)
      : ''
  }
}

interface FileConfig {
  label?: string
  hint?: string
  accept?: string
  isEdit?: boolean
  error?: string
}
</script>

<style lang="scss" scoped></style>
