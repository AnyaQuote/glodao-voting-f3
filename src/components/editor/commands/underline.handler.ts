import { Editor } from '@tiptap/vue-2'
import { HandlerBase, HandlerType } from './handler.base'

export class UnderlineHandler extends HandlerBase {
  constructor(editor: Editor) {
    super(editor)
  }
  get active(): boolean {
    return this.editor.isActive('underline') ?? false
  }
  get type(): HandlerType {
    return 'underline'
  }
  execute(): void {
    this.editor.chain().focus().toggleUnderline().run()
  }
}
