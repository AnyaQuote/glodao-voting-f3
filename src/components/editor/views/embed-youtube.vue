<template>
  <div>
    <v-btn icon @click="command.open" :class="{ 'bluePrimary--text': command.active }">
      <v-icon>mdi-youtube</v-icon>
    </v-btn>

    <v-dialog :value="command.dialog" persistent width="400" height="200">
      <v-card>
        <v-card-title>
          <v-icon>mdi-youtube</v-icon>
          <span class="text-body-1 ml-2">Paste video url</span>
          <v-spacer />
          <v-icon @click="close">mdi-close-circle</v-icon>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" class="mt-2">
            <v-text-field
              outlined
              dense
              :rules="[$rules.required, $rules.youtubeUrl]"
              :value="command.content"
              @input="command.edit"
              prepend-inner-icon="mdi-link"
            />
            <v-btn depressed block :disabled="!valid" @click="execute">Add</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { EmbedYoutubeHandler } from '../commands'

@Observer
@Component
export default class YoutubeEmbedButton extends Vue {
  @Prop({ required: true }) command!: EmbedYoutubeHandler
  @Ref('form') form
  valid = false

  close() {
    this.command.close()
    this.form.resetValidation()
  }

  execute() {
    this.command.execute()
    this.form.resetValidation()
  }
}
</script>

<style scoped></style>
