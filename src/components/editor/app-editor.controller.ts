import { Editor } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import { action, observable } from 'mobx'
import { EditorView } from 'prosemirror-view'
import {
  BoldHandler,
  EmbedImageHandler,
  EmbedYoutubeHandler,
  HandlerBase,
  HeadingOneHandler,
  HeadingThreeHandler,
  HeadingTwoHandler,
  ItalicHandler,
  StrikeHandler,
  UnderlineHandler,
} from './commands'

EditorView.prototype.updateState = function updateState(state) {
  const self = this as any
  if (!self.docView) {
    return
  }
  self.updateStateInner(state, this.state.plugins != state.plugins)
}

export class AppEditorController {
  editor: Editor

  @observable private _content = ''

  @observable commands: HandlerBase[] = []

  constructor() {
    this.editor = new Editor({
      extensions: [
        Underline,
        Youtube.configure({
          width: 480,
          height: 320,
          nocookie: true,
          autoplay: false,
          disableKBcontrols: true,
        }),
        Image,
        StarterKit.configure({
          dropcursor: false,
          gapcursor: false,
          blockquote: false,
          codeBlock: false,
          code: false,
          // listItem: false,
          horizontalRule: false,
          // hardBreak: false,
          heading: { levels: [1, 2, 3] },
        }),
      ],
      onUpdate: (props) => {
        this.edit(props.editor.getHTML())
      },
    })

    this.commands.push(new BoldHandler(this.editor))
    this.commands.push(new ItalicHandler(this.editor))
    this.commands.push(new StrikeHandler(this.editor))
    this.commands.push(new UnderlineHandler(this.editor))
    this.commands.push(new HeadingOneHandler(this.editor))
    this.commands.push(new HeadingTwoHandler(this.editor))
    this.commands.push(new HeadingThreeHandler(this.editor))
    this.commands.push(new EmbedYoutubeHandler(this.editor))
    this.commands.push(new EmbedImageHandler(this.editor))
  }

  @action.bound edit(value: string) {
    this._content = value
  }

  @action setContent(value: string) {
    this.editor.commands.setContent(value, false)
    this.edit(value)
  }

  get content(): string {
    return this._content
  }

  redo(): void {
    this.editor.chain().focus().redo().run()
  }

  undo(): void {
    this.editor.chain().focus().undo().run()
  }

  get redoable(): boolean {
    return this.editor.can().redo()
  }

  get undoable(): boolean {
    return this.editor.can().undo()
  }
}
