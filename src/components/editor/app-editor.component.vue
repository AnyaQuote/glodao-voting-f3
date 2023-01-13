<template>
  <div v-if="editor">
    <v-sheet>
      <command-factory v-for="command in controller.commands" :key="command.type" :command="command" />
    </v-sheet>
    <editor-content class="editor pa-4 grey" :editor="editor"></editor-content>
    <div class="debug" v-html="controller.content"></div>
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
    'command-factory': () => import('./views/command.factory.vue'),
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

    // img {
    //   max-width: 20%;
    //   height: auto;

    //   &.ProseMirror-selectednode {
    //     outline: 2px solid var(--v-primary-base);
    //   }
    // }
  }
}
</style>
