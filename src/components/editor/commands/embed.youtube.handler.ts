import { Editor } from '@tiptap/vue-2'
import { action, computed, observable } from 'mobx'
import { HandlerBase, HandlerType } from './handler.base'

export class EmbedYoutubeHandler extends HandlerBase {
  @observable content = ''
  @observable dialog = false

  constructor(editor: Editor) {
    super(editor)
  }

  @action.bound edit(value: string) {
    this.content = value
  }

  @action.bound open() {
    this.dialog = true
  }

  @action.bound close() {
    this.dialog = false
    this.content = ''
  }

  execute(): void {
    if (!this.content) return
    this.editor.chain().focus().setYoutubeVideo({ src: this.content }).run()
    this.close()
  }

  @computed
  get active(): boolean {
    return this.dialog === true
  }

  get type(): HandlerType {
    return 'embed-youtube'
  }
}
