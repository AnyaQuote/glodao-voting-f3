import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, computed, observable } from 'mobx'
import { get, set } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { toISO } from '@/helpers/date-helper'
import { apiService } from '@/services/api-service'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: '',
  keywords: [],
  socials: {},
  tokenAddress: '',
}

const tokenInfoDefault = {
  tokenName: '',
  chain: {},
  tokenContract: '',
  additionLink: '',
}

const confirmInfoDefault = {
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
  @observable confirmInfo = confirmInfoDefault
  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: string) {
    set(this.projectInfo, property, value)
  }

  @action.bound changeTokenInfo(property: string, value: string) {
    set(this.tokenInfo, property, value)
  }

  @action.bound changePaymentInfo(property: string, value: string) {
    set(this.confirmInfo, property, value)
  }

  @action nextStep(value: number) {
    this.unlockedStep = this.step = value
  }

  @asyncAction *submit() {
    try {
      const { projectName, ...projectInfo } = this.projectInfo
      const { immediate, openDate } = this.confirmInfo
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
