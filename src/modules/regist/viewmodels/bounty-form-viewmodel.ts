import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, computed, observable } from 'mobx'
import { get } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { toISO } from '@/helpers/date-helper'
import { apiService } from '@/services/api-service'
import { appProvider } from '@/app-providers'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: '',
  keywords: [],
  socials: {},
  researchProject: '',
}

const tokenInfoDefault = {
  tokenName: '',
  chain: {},
  tokenContract: '',
  additionLink: '',
}

const paymentInfoDefault = {
  immediate: false,
  openDate: {
    date: '',
    time: '',
  },
}
export class BountyFormViewModel {
  @observable step = 1.2
  @observable unlockedStep = 3.1
  @observable projectInfo = projectInfoDefault
  @observable tokenInfo = tokenInfoDefault
  // @observable fundInfo = fundInfoDefault
  @observable paymentInfo = paymentInfoDefault
  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: string) {
    if (property.includes('socials')) {
      const nestedProp = property.split('.')[1]
      this.projectInfo.socials[nestedProp] = value
    } else this.projectInfo[property] = value
  }

  @action.bound changeTokenInfo(property: string, value: string) {
    if (property === 'chain') {
      this.tokenInfo[property] = { name: get(value, 'name'), icon: get(value, 'icon') }
    } else this.tokenInfo[property] = value
  }

  @action.bound changePaymentInfo(property: string, value: string) {
    if (property.includes('openDate')) {
      const prop = property.split('.')[0]
      const nestedProp = property.split('.')[1]
      this.paymentInfo[prop][nestedProp] = value
    } else this.paymentInfo[property] = value
  }

  @action nextStep(value: number) {
    this.unlockedStep = this.step = value
  }

  @asyncAction *submit() {
    try {
      const { projectName, ...projectInfo } = this.projectInfo
      const { immediate, openDate } = this.paymentInfo
      const data = {
        projectName,
        type: 'bounty',
        status: immediate ? 'voting' : 'pending',
        startTime: toISO(openDate),
        metadata: {
          ...projectInfo,
          ...this.tokenInfo,
          chain: { ...(this.tokenInfo.chain && this.tokenInfo.chain) },
        },
      }

      const res = yield apiService.voting.create(data)
      console.log('bounty.submit:::', res)
    } catch (error) {
      snackController.commonError(error)
    }
  }
}
