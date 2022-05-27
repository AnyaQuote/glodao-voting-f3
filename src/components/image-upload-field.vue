<template>
  <v-sheet
    outlined
    v-ripple
    class="d-flex align-center cursor-pointer rounded transparent--bg"
    :class="dense ? 'pa-2' : 'pa-5'"
    @click.stop="open"
    @change="handleChange"
  >
    <input type="file" ref="file-dialog" accept=".jpg,.png,.svg" hidden />
    <v-img v-if="image" :src="source" class="rounded" max-width="50" aspect-ratio="1"></v-img>
    <v-img v-else :src="require('@/assets/icons/file-logo.svg')" class="rounded" max-height="42" max-width="42"></v-img>
    <div class="d-flex flex-column flex-grow-1 ml-5">
      <span class="text-subtitle-1 font-weight-bold">{{ name ? name : 'Upload your image' }}</span>
      <span class="text-subtitle-2 font-weight-regular">{{ imgSize ? imgSize : 'Allowed file types: png, jpg' }}</span>
    </div>
    <div v-if="dense" class="app-blue--text text-subtite-1 font-weight-600">Change</div>
    <v-icon v-else>mdi-upload</v-icon>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from 'vue-property-decorator'
import { get } from 'lodash'
import { imageHelper } from '@/helpers/image-helper'
@Component
export default class ImageUploadField extends Vue {
  @Prop({ default: null }) value!: File | string
  @Ref('file-dialog') dialog
  image: File | string | null = null
  @Prop({ type: Boolean }) dense

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

  get name() {
    return imageHelper.name(this.image)
  }

  get imgSize() {
    return imageHelper.size(this.image)
  }

  get source() {
    return imageHelper.url(this.image)
  }
}
</script>

<style scoped></style>
