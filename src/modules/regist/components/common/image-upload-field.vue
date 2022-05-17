<template>
  <v-sheet
    outlined
    v-ripple
    class="px-4 py-3 d-flex flex-column flex-md-row align-center cursor-pointer rounded transparent--bg"
    @click.stop="open"
    @change="handleChange"
  >
    <input type="file" ref="file-dialog" accept=".jpg,.png,.svg" hidden />
    <img :src="source" width="42" height="42" class="rounded" />
    <div class="d-flex flex-column flex-grow-1 ml-4">
      <span class="text-subtitle-1 font-weight-bold">{{ image ? image.name : 'Upload your image' }}</span>
      <span class="text-subtitle-2 font-weight-regular">{{ imgSize ? imgSize : 'Allowed file types: png, jpg' }}</span>
    </div>
    <v-icon>mdi-upload</v-icon>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { get } from 'lodash'
import { convertBytes } from '@/helpers/file-helper'
@Component
export default class ImageUploadField extends Vue {
  @Ref('file-dialog') dialog

  image: any | null = null

  open() {
    this.dialog.click()
  }

  handleChange(event) {
    this.image = get(event, 'target.files[0]')
    this.$emit('change', this.image)
  }

  get imgSize() {
    return this.image && convertBytes(this.image!.size)
  }

  get source() {
    return this.image ? URL.createObjectURL(this.image) : require('@/assets/icons/file-logo.svg')
  }
}
</script>

<style scoped></style>
