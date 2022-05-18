<template>
  <v-sheet
    outlined
    v-ripple
    class="pa-5 d-flex align-center cursor-pointer rounded transparent--bg"
    @click.stop="open"
    @change="handleChange"
  >
    <input type="file" ref="file-dialog" accept=".jpg,.png,.svg" hidden />
    <img v-if="image" :src="source" width="48" height="48" class="rounded" />
    <img v-else :src="require('@/assets/icons/file-logo.svg')" width="42" height="42" class="rounded" />
    <div class="d-flex flex-column flex-grow-1 ml-5">
      <span class="text-subtitle-1 font-weight-bold">{{ image ? image.name : 'Upload your image' }}</span>
      <span class="text-subtitle-2 font-weight-regular">{{ imgSize || 'Allowed file types: png, jpg' }}</span>
    </div>
    <v-icon>mdi-upload</v-icon>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from 'vue-property-decorator'
import { convertBytes } from '@/helpers/file-helper'
import { get, isNil } from 'lodash'
@Component
export default class ImageUploadField extends Vue {
  @Prop({ default: null }) value!: File
  @Ref('file-dialog') dialog

  image: File | null = null

  created() {
    console.log('mounted:::', this.value)
  }

  open() {
    this.dialog.click()
  }

  handleChange(event) {
    this.image = get(event, 'target.files[0]')
    this.$emit('change', this.image)
  }

  @Watch('value', { immediate: true })
  onPropChange(value: File) {
    this.image = value
  }

  get imgSize() {
    return !isNil(this.image) && convertBytes(this.image!.size)
  }

  get source() {
    return !isNil(this.image) ? URL.createObjectURL(this.image) : ''
  }
}
</script>

<style scoped></style>
