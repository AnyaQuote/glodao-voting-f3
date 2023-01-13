import { Editor } from '@tiptap/vue-2'

export type CommandType = 'bold' | 'italic'

export type ComponentType = 'bold'

export abstract class Command {
  constructor(protected editor: Editor) {}
  abstract get active(): boolean
  abstract get type(): CommandType
  abstract get component(): ComponentType
  abstract undo(): void
  abstract execute(): void
}
