import { Editor } from '@tiptap/vue-2'
import { HandlerBase, HandlerType } from './handler.base'

export class HeadingThreeHandler extends HandlerBase {
  constructor(editor: Editor) {
    super(editor)
  }

  get active(): boolean {
    return this.editor.isActive('heading', { level: 3 })
  }
  get type(): HandlerType {
    return 'heading-three'
  }
  execute(): void {
    this.editor.chain().focus().toggleHeading({ level: 3 }).run()
  }
}
