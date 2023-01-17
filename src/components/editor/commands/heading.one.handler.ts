import { Editor } from '@tiptap/vue-2'
import { HandlerBase, HandlerType } from './handler.base'

export class HeadingOneHandler extends HandlerBase {
  constructor(editor: Editor) {
    super(editor)
  }

  get active(): boolean {
    return this.editor.isActive('heading', { level: 1 })
  }

  get type(): HandlerType {
    return 'heading-one'
  }

  execute(): void {
    this.editor.chain().focus().toggleHeading({ level: 1 }).run()
  }
}
