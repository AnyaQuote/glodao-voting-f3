import { action, observable, set } from 'mobx'
import { HandlerName, HandlerType, IBaseHandler } from '@/modules/new-mission/handlers/base.handler'
import { SocialType, TaskConfig } from '@/models/MissionModel'
import { EMPTY_ARRAY, EMPTY_STRING } from '@/constants'
import { appProvider } from '@/app-providers'
import { extractTaskSettings, getDefaultSettingConfig } from '@/helpers'
import { getApiFileUrl } from '@/helpers/file-helper'
import { assign } from 'lodash-es'

export class SocialHandler implements IBaseHandler {
  type: HandlerType = HandlerType.social
  name: HandlerName = HandlerName.social

  @observable valid = false

  @observable telegram: TaskConfig[] = EMPTY_ARRAY
  @observable twitter: TaskConfig[] = EMPTY_ARRAY
  @observable facebook: TaskConfig[] = EMPTY_ARRAY
  @observable custom: TaskConfig[] = EMPTY_ARRAY
  @observable discord: TaskConfig[] = EMPTY_ARRAY

  @observable showSelectDialog = false
  @observable selectedSocialType = EMPTY_STRING

  private snackbar = appProvider.snackbar
  private router = appProvider.router
  private auth = appProvider.authStore
  private api = appProvider.api

  private _key = 0

  constructor() {
    //
  }

  @action.bound updateSelectDialogState(shown: boolean, type?: SocialType) {
    this.selectedSocialType = type || EMPTY_STRING
    this.showSelectDialog = shown
  }

  @action.bound updateSetting(socialType: SocialType, key: number, value: any) {
    this[socialType] = this[socialType].map((setting) => {
      return setting.key === key ? value : setting
    })
  }

  @action.bound removeSetting(socialType: SocialType, key: number) {
    this[socialType] = this[socialType].filter((setting) => setting.key !== key)
  }

  @action appendSetting(socialType: string, taskType: string) {
    try {
      const setting = getDefaultSettingConfig(socialType, taskType, this._key++)
      this[socialType] = [...this[socialType], setting]
    } catch (error) {
      this.snackbar.commonError(error)
    }
  }

  async getImageSource(imageFile: File) {
    const media = new FormData()
    media.append('files', imageFile)
    const imageResult = await this.api.uploadFile(media)
    return getApiFileUrl(imageResult[0])
  }

  getSocialMissionSettings() {
    const settings = {}
    if (this.telegram.length > 0) {
      assign(settings, { [SocialType.TELEGRAM]: extractTaskSettings(this.telegram) })
    }
    if (this.twitter.length > 0) {
      assign(settings, { [SocialType.TWITTER]: extractTaskSettings(this.twitter) })
    }
    if (this.facebook.length > 0) {
      assign(settings, { [SocialType.FACEBOOK]: extractTaskSettings(this.facebook) })
    }
    if (this.discord.length > 0) {
      assign(settings, { [SocialType.DISCORD]: extractTaskSettings(this.discord) })
    }
    if (this.custom.length > 0) {
      assign(settings, { optional: extractTaskSettings(this.custom) })
    }
    return settings
  }

  getData() {
    return this.getSocialMissionSettings()
  }
}
