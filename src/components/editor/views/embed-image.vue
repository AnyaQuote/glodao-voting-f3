<template>
  <div>
    <v-btn icon @click="command.open" :class="{ 'bluePrimary--text': command.active }">
      <v-icon>mdi-file-image-plus</v-icon>
    </v-btn>

    <v-dialog :value="command.dialog" max-width="600" height="200">
      <v-card>
        <v-card-title>
          <span>Upload your images</span>
          <v-spacer />
          <v-icon @click="close">mdi-close-circle</v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-file-input
              :key="unique"
              ref="file"
              placeholder="Press to select image"
              dense
              outlined
              :clearable="false"
              :value="command.files"
              prepend-icon="mdi-file-image-plus"
              :loading="command.loading"
              :rules="[$rules.required, $rules.isImage, $rules.maxSize(5000000)]"
              @change="change"
            />
          </v-form>
          <v-sheet class="mb-8">
            <v-row>
              <v-col cols="4" v-for="image in command.locals" :key="image.key">
                <v-img class="rounded-lg" :src="image.path" contain />
              </v-col>
            </v-row>
          </v-sheet>
          <v-btn block :disabled="!valid" :loading="command.loading" @click="execute">Add</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { EmbedImageHandler } from '../commands'

@Observer
@Component
export default class EmbedImageButton extends Vue {
  @Prop({ required: true }) command!: EmbedImageHandler
  @Ref('file') file_input
  @Ref('form') form

  unique = 0
  valid = false

  close() {
    this.command.close()
    this.form.resetValidation()
  }

  async execute() {
    await this.command.upload()
    this.command.execute()
  }

  change(file: File) {
    this.command.add(file)
    this.unique++
  }
}
</script>

<style scoped></style>
