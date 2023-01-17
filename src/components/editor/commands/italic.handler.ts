import { Editor } from '@tiptap/vue-2'
import { HandlerBase, HandlerType } from './handler.base'

export class ItalicHandler extends HandlerBase {
  constructor(editor: Editor) {
    super(editor)
  }
  get active(): boolean {
    return this.editor.isActive('italic') ?? false
  }
  get type(): HandlerType {
    return 'italic'
  }
  execute(): void {
    this.editor.chain().focus().toggleItalic().run()
  }
}
