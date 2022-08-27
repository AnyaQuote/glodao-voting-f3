<template>
  <div>
    <div class="d-flex ma-n1 flex-wrap">
      <v-sheet
        v-for="(file, index) in files"
        class="py-1 dashed-border ma-1"
        :key="index"
        rounded="lg"
        :height="height"
        :width="width"
        outlined
      >
        <v-img width="100%" height="100%" contain :src="sourceFrom(file)">
          <div class="d-flex flex-column fill-height px-1">
            <v-hover v-slot="{ hover }">
              <v-icon class="align-self-end" :color="whenHover(hover)" small @click="onRemove(index)">mdi-close</v-icon>
            </v-hover>
            <v-icon class="flex-grow-1 pb-3" color="neutral-20">mdi-file-image</v-icon>
          </div>
        </v-img>
      </v-sheet>
      <v-sheet
        v-show="!maxFilesReached"
        class="py-1 dashed-border ma-1"
        @click.stop="openFileExplorer"
        rounded="lg"
        :height="height"
        :width="width"
        v-ripple
        outlined
      >
        <v-file-input
          ref="file-input"
          multiple
          @change="onFileChange"
          :accept="acceptType"
          class="d-none"
          :error="error"
          :key="key"
        />
        <v-img height="100%" width="100%" contain>
          <v-icon class="d-flex fill-height" color="neutral-20">mdi-file-image-plus</v-icon>
        </v-img>
      </v-sheet>
    </div>
    <v-slide-y-transition hide-on-leave>
      <v-sheet height="12" class="app-red--text text-subtitle-2 font-weight-regular mt-1">{{
        isDirty ? message : ''
      }}</v-sheet>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import {
  ERROR_MSG_FIELD_REQUIRED,
  ERROR_MSG_FILE_EXCEED_MAX_SIZE,
  ERROR_MSG_FILE_IS_NOT_IMAGE,
  MAX_IMAGE_FILE_SIZE,
  MAX_SCREENSHOT_ACCEPTED,
} from '@/constants'
import { isEmpty } from 'lodash-es'
import { Observer } from 'mobx-vue'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

const defaultProp = () => []

@Observer
@Component
export default class ScreenShotFileUpload extends Vue {
  @Ref('file-input') fileInput
  @Prop({ default: defaultProp }) value!: File[]
  @Prop({ default: defaultProp }) rules!: any[]
  @Prop(Boolean) mobileScreenSize!: boolean

  readonly acceptType = 'image/png, image/jpeg, image/jpg'
  readonly height = 184
  isDirty = false
  files: File[] = []
  message = ''
  key = 0

  mounted() {
    if (this.value && this.value.length) {
      this.files = this.value
      this.isDirty = true
    }
  }

  /**
   * Validate files, populate message and emit value to parent
   * @param files
   */
  @Watch('files', { immediate: true })
  onErrorCheck(files) {
    this.message = ''
    const isExceedMaxSize = files.some((file) => file.size > MAX_IMAGE_FILE_SIZE)
    const isNotImageFile = files.some((file) => /^(image)\/.*$/.test(file.type) === false)
    if (!this.files || !this.files.length) {
      this.message = ERROR_MSG_FIELD_REQUIRED
    } else if (isNotImageFile) {
      this.message = ERROR_MSG_FILE_IS_NOT_IMAGE
    } else if (isExceedMaxSize) {
      this.message = ERROR_MSG_FILE_EXCEED_MAX_SIZE
    } else {
      this.$emit('onChange', files)
    }
  }

  onFileChange(files: any) {
    const acceptedFiles = files.splice(0, MAX_SCREENSHOT_ACCEPTED - this.files.length)
    this.files = this.files.concat(acceptedFiles)
    this.key++
  }

  openFileExplorer() {
    this.fileInput.$refs.input.click()
    this.isDirty = true
  }

  onRemove(position: number) {
    const updatedFiles = this.files.filter((_, index) => index !== position)
    this.files = updatedFiles
    this.key++
  }

  get sourceFrom() {
    return (file: File | null) => (file ? URL.createObjectURL(file) : '')
  }

  get whenHover() {
    return (hover: boolean) => (hover ? 'red' : 'neutral-20')
  }

  get maxFilesReached() {
    return MAX_SCREENSHOT_ACCEPTED === this.files.length
  }

  get error() {
    return !!this.message
  }

  get width() {
    return this.mobileScreenSize ? 120 : 270
  }
}
</script>

<style scoped></style>
