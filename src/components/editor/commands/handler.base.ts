import { Editor } from '@tiptap/vue-2'

export type HandlerType =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'underline'
  | 'blank'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'embed-youtube'
  | 'embed-image'

export abstract class HandlerBase {
  constructor(protected editor: Editor) {}
  abstract get active(): boolean
  abstract get type(): HandlerType
  abstract execute(): void
}
