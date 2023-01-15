import { Editor } from '@tiptap/vue-2'
import { HandlerBase, HandlerType } from './handler.base'

export class StrikeHandler extends HandlerBase {
  constructor(editor: Editor) {
    super(editor)
  }
  get active(): boolean {
    return this.editor.isActive('strike') ?? false
  }
  get type(): HandlerType {
    return 'strike'
  }
  execute(): void {
    this.editor.chain().focus().toggleStrike().run()
  }
}
