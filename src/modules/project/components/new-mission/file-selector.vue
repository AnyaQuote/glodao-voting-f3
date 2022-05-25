<template>
  <v-sheet outlined v-ripple class="pa-5 d-flex align-center cursor-pointer rounded transparent--bg" @click.stop="open">
    <v-file-input
      v-show="false"
      v-bind="$attrs"
      v-on="$listeners"
      ref="file-selector"
      @change="handleChange"
      accept=".csv, .md"
    />
    <div class="d-flex flex-column flex-grow-1">
      <span class="text-subtitle-1 font-weight-bold">{{ fileName || 'Upload your file' }}</span>
      <span class="text-subtitle-2 font-weight-regular">{{
        fileSize || 'Please upload follow our template. Max is 20mb'
      }}</span>
    </div>
    <v-icon>mdi-upload</v-icon>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { convertBytes } from '@/helpers/file-helper'
import { get, isNil } from 'lodash'
import { Observer } from 'mobx-vue'

@Observer
@Component
export default class ImageUploadField extends Vue {
  @Ref('file-selector') selector
  file: File | null = null

  maximum15mb = (value) => !value || value.size < 15000000 || 'File size should be less than 15 MB!'
  required = (value) => !!value || 'Must select this field'

  open() {
    this.selector.$refs.input.click()
  }

  handleChange(file) {
    this.file = file
    this.$emit('change', this.file)
  }

  get fileSize() {
    return !isNil(this.file) && convertBytes(this.file!.size)
  }

  get fileName() {
    return !isNil(this.file) && this.file.name
  }
}
</script>

<style scoped></style>
