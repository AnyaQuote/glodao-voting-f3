import { Editor } from '@tiptap/vue-2'
import { Command, CommandType, ComponentType } from './command.abstract.base'

export class BoldCommand extends Command {
  constructor(editor: Editor) {
    super(editor)
  }

  undo(): void {
    this.editor.chain().focus().toggleBold().run()
  }

  execute(): void {
    this.editor.chain().focus().toggleBold().run()
  }

  get active(): boolean {
    return this.editor.isActive('bold')
  }

  get type(): CommandType {
    return 'bold'
  }

  get component(): ComponentType {
    return 'bold'
  }
}
