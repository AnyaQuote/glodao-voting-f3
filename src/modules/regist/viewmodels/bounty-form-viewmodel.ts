import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, computed, observable } from 'mobx'
import { get, set } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { toISO } from '@/helpers/date-helper'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: null,
  projectLogo: null,
  keywords: [],
  socials: {},
  tokenAddress: '',
}

// const tokenInfoDefault = {
//   tokenName: '1',
//   chain: {},
//   tokenContract: '1',
//   additionLink: '1',
// }

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
  // @observable tokenInfo = tokenInfoDefault
  @observable confirmInfo = confirmInfoDefault
  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: any) {
    // console.log(property, value)
    set(this.projectInfo, property, value)
  }

  // @action.bound changeTokenInfo(property: string, value: string) {
  //   set(this.tokenInfo, property, value)
  // }

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

      // console.log('form data:::', media)

      const data = {
        projectName,
        type: 'bounty',
        status: immediate ? 'voting' : 'pending',
        startTime: toISO(openDate),
        metadata: {
          ...projectInfo,
          projectLogo: getApiFileUrl(res[0]),
          projectCover: getApiFileUrl(res[1]),
        },
      }

      res = yield apiService.voting.create(data)
      console.log('bounty.submit:::', res)
    } catch (error) {
      snackController.commonError(error)
    }
  }
}
