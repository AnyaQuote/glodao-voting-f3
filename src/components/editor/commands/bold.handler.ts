import { Editor } from '@tiptap/vue-2'
import { HandlerBase, HandlerType } from './handler.base'

export class BoldHandler extends HandlerBase {
  constructor(editor: Editor) {
    super(editor)
  }

  execute(): void {
    this.editor.chain().focus().toggleBold().run()
  }

  get active(): boolean {
    return this.editor.isActive('bold')
  }

  get type(): HandlerType {
    return 'bold'
  }
}
