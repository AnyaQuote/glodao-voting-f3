import { Editor } from '@tiptap/vue-2'
import { HandlerBase, HandlerType } from './handler.base'

export class HeadingTwoHandler extends HandlerBase {
  constructor(editor: Editor) {
    super(editor)
  }
  get active(): boolean {
    return this.editor.isActive('heading', { level: 2 })
  }
  get type(): HandlerType {
    return 'heading-two'
  }
  execute(): void {
    this.editor.chain().focus().toggleHeading({ level: 2 }).run()
  }
}
