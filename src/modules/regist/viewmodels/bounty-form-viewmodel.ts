import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, observable } from 'mobx'
import { set } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { toMoment } from '@/helpers/date-helper'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { appProvider } from '@/app-providers'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: null,
  projectLogo: null,
  keywords: [],
  socials: {},
  tokenAddress: '',
}

const confirmInfoDefault = {
  immediate: false,
  openDate: {
    date: '',
    time: '',
  },
}
export class BountyFormViewModel {
  @observable step = 1.1
  @observable unlockedStep = 2.1
  @observable projectInfo = projectInfoDefault
  @observable confirmInfo = confirmInfoDefault
  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: any) {
    set(this.projectInfo, property, value)
  }

  @action.bound changePaymentInfo(property: string, value: string) {
    set(this.confirmInfo, property, value)
  }

  @action nextStep(value: number) {
    this.unlockedStep = this.step = value
  }

  @asyncAction *submit() {
    try {
      const { projectName, projectLogo, projectCover, ...projectInfo } = this.projectInfo
      const { immediate, openDate } = this.confirmInfo

      let res

      const media = new FormData()
      media.append('files', projectLogo!)
      media.append('files', projectCover!)
      res = yield apiService.uploadFile(media)

      const data = {
        projectId: '',
        name: projectName,
        type: 'bounty',
        ownderAddress: '',
        status: immediate ? 'voting' : 'pending',
        startDate: toMoment(openDate).toISOString(),
        endDate: toMoment(openDate).add(3, 'days').toISOString(),
        data: {
          ...projectInfo,
          projectLogo: getApiFileUrl(res[0]),
          projectCover: getApiFileUrl(res[1]),
        },
      }
      res = yield apiService.voting.create(data)
      appProvider.router.push({ name: 'project-list' })
    } catch (error) {
      appProvider.snackbar.commonError(error)
    }
  }
}
