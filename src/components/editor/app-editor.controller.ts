import { Editor } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
// import Underline from '@tiptap/extension-underline'
import { Command } from './commands/command.abstract.base'
import { BoldCommand } from './commands/bold.command'
import { action, observable, runInAction } from 'mobx'
import { EditorView } from 'prosemirror-view'

EditorView.prototype.updateState = function updateState(state) {
  const self = this as any
  if (!self.docView) {
    return
  }
  self.updateStateInner(state, this.state.plugins != state.plugins)
}

export class AppEditorController {
  editor?: Editor

  @observable content = ''

  @observable commands: Command[] = []

  constructor() {
    const editor = new Editor({
      extensions: [
        // Underline,
        StarterKit.configure({
          // dropcursor: false,
          // gapcursor: false,
          // blockquote: false,
          // codeBlock: false,
          // code: false,
          // listItem: false,
          // horizontalRule: false,
          // hardBreak: false,
          // heading: { levels: [1, 2, 3] },
        }),
      ],
      onUpdate: ({ editor }) => {
        this.sync(editor.getHTML())
      },
    })

    this.editor = editor
    this.commands.push(new BoldCommand(editor))
  }

  @action.bound sync(value: string) {
    this.content = value
  }
}
