import { action, computed, observable } from 'mobx'
import { HandlerName, HandlerType, IBaseHandler } from '../base.handler'
import { IatInfoProp, InAppTrialInfo } from '@/models/MissionModel'
import { EMPTY_OBJECT, EMPTY_STRING, NULL } from '@/constants'
import { get, set } from 'lodash-es'
import { getApiFileUrl } from '@/helpers/file-helper'
import { appProvider } from '@/app-providers'
import { generateRandomString } from '@/helpers'

enum AppPlatform {
  MOBILE = 'mobile',
  WEB = 'web',
}

export class IatHandler implements IBaseHandler {
  type: HandlerType = HandlerType.iat
  name: HandlerName = HandlerName.iat

  @observable valid = false

  @observable iatInfo: InAppTrialInfo = EMPTY_OBJECT
  @observable platformType = AppPlatform.WEB

  private snackbar = appProvider.snackbar
  private router = appProvider.router
  private auth = appProvider.authStore
  private api = appProvider.api

  /**
   * Update property of iatInfo object
   * @param property property name of iatInfo object
   * @param value value to assign
   */
  @action.bound updateIatInfo(property: IatInfoProp, value: any) {
    if (property === 'missionDates') {
      this.iatInfo = { ...this.iatInfo, startDate: value[0], endDate: value[1] }
      return
    }
    this.iatInfo = set(this.iatInfo, property, value)
  }

  /**
   * Change UI form when inputting web, appstore link and screenshot files
   * @param value Web | Mobile
   */
  @action.bound changePlatformType(value: AppPlatform) {
    this.platformType = value
    if (value === AppPlatform.MOBILE) {
      if (this.chPlayLink) {
        this.updateIatInfo('chPlayLink', EMPTY_STRING)
      }
      if (this.appStoreLink) {
        this.updateIatInfo('appStoreLink', EMPTY_STRING)
      }
    } else {
      if (this.webAppLink) {
        this.updateIatInfo('webAppLink', EMPTY_STRING)
      }
    }
  }

  /**
   * Upload images and return image sources from server
   * @param files array of files/blobs
   * @returns array of image sources
   */
  async getImageSources(...files: (File | undefined | null)[]) {
    const media = new FormData()
    files.forEach((f) => f && media.append('files', f))
    const images = await this.api.uploadFile(media)
    return images.map((image: any) => getApiFileUrl(image))
  }

  getData() {
    return {
      ...this.iatInfo,
      taskData: this.iatInfo.tasks!.map((task) => {
        return {
          code: generateRandomString(),
          context: task.context!,
          required: true,
        }
      }),
    }
  }

  // ======== IN APP TRIAL APP INFO START ==========

  @computed get appTitle() {
    return get(this.iatInfo, 'appTitle', EMPTY_STRING)
  }

  @computed get appLogo() {
    return get(this.iatInfo, 'appLogo', NULL)
  }

  @computed get webAppLink() {
    return get(this.iatInfo, 'webAppLink', EMPTY_STRING)
  }

  @computed get appStoreLink() {
    return get(this.iatInfo, 'appStoreLink', EMPTY_STRING)
  }

  @computed get chPlayLink() {
    return get(this.iatInfo, 'chPlayLink', EMPTY_STRING)
  }

  @computed get appDescription() {
    return get(this.iatInfo, 'appDescription', EMPTY_STRING)
  }

  @computed get appScreenShots() {
    return get(this.iatInfo, 'screenShots', NULL)
  }

  @computed get isMobilePlatform() {
    return this.platformType === AppPlatform.MOBILE
  }

  // ======== IN APP TRIAL APP INFO END ============
}
