import { Editor } from '@tiptap/vue-2'
import { action, computed, observable, runInAction } from 'mobx'
import { HandlerBase, HandlerType } from './handler.base'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import moment from 'moment'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { imageHelper } from '@/helpers/image-helper'

export class EmbedImageHandler extends HandlerBase {
  @observable locals: Image[] = []
  @observable dialog = false
  @observable loading = false
  @action.bound open() {
    this.dialog = true
  }
  @action.bound close() {
    this.dialog = false
    this.locals = []
  }

  constructor(editor: Editor) {
    super(editor)
  }

  @action add(files: File[]): any {
    if (files.length) {
      this.locals = [...this.locals, ...files.map((file) => new Image(file))]
    } else this.locals = []
  }

  async upload() {
    this.loading = true

    await Promise.allSettled(this.locals.map((image) => image.upload()))

    this.loading = false
  }

  @action
  execute(): void {
    const imgs = this.locals
      .filter((image) => !!image.url)
      .map((image) => ({
        type: 'image',
        attrs: {
          src: image.url,
        },
      }))

    this.editor.chain().focus().insertContent(imgs).run()

    this.close()
  }

  @computed
  get files(): File[] {
    return this.locals.map((image) => image.local)
  }

  get active(): boolean {
    return this.dialog === true
  }

  get type(): HandlerType {
    return 'embed-image'
  }
}

class Image {
  local: File
  @observable server: any

  constructor(model: File) {
    this.local = model
  }

  async upload() {
    try {
      const data = new FormData()
      data.append('files', this.local)
      const [res] = await apiService.uploadFile(data)
      runInAction(() => (this.server = res))
    } catch (error) {
      snackController.commonError(error)
    }
  }

  get path(): string {
    return URL.createObjectURL(this.local)
  }

  @computed
  get url(): string {
    return getApiFileUrl(this.server) || ''
  }
}