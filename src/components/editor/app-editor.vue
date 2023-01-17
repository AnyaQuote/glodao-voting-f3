<template>
  <div v-if="editor">
    <v-card rounded="lg" outlined>
      <v-card-title>
        <commands v-for="(command, index) in controller.commands" :key="index" :command="command" />
        <v-btn icon :disabled="!controller.undoable" @click="controller.undo()" class="ml-2">
          <v-icon>mdi-undo</v-icon>
        </v-btn>
        <v-btn icon :disabled="!controller.redoable" @click="controller.redo()">
          <v-icon>mdi-redo</v-icon>
        </v-btn>
      </v-card-title>
      <editor-content
        class="editor pa-4"
        :class="{ 'grey lighten-1': $vuetify.theme.dark, 'grey lighten-3': !$vuetify.theme.dark }"
        :editor="editor"
      ></editor-content>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AppEditorController } from './app-editor.controller'
import { EditorContent } from '@tiptap/vue-2'
import { Observer } from 'mobx-vue'

@Observer
@Component({
  components: {
    commands: () => import('./views/commands.vue'),
    EditorContent,
  },
})
export default class AppEditor extends Vue {
  @Prop({ required: true }) controller!: AppEditorController

  editor = this.controller.editor
}
</script>

<style scoped lang="scss">
.editor {
  ::v-deep .ProseMirror {
    outline: none;
    min-height: 200px;
    overflow-y: visible;
    > * + * {
      margin-top: 0.75em;
    }

    img {
      max-width: 60%;
      height: auto;

      &.ProseMirror-selectednode {
        outline: 2px solid var(--v-primary-base);
      }
    }
  }
}
</style>
