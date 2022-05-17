import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, computed, observable } from 'mobx'
import { set, get } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { toISO } from '@/helpers/date-helper'
import { apiService } from '@/services/api-service'

// type ProjectInfo = 'projectName' | 'shortDescription' | 'projectCover' | 'keywords' | 'socials' | 'researchProject'
type TokenInfo = 'tokenName' | 'chain' | 'tokenContract' | 'additionLink'
type FundInfo =
  | 'totalRaise'
  | 'totalSale'
  | 'distributeDuration'
  | 'distributeTime.time'
  | 'distributeTime.date'
  | 'launchDate.date'
  | 'launchDate.time'
  | 'priceRatio'
type ConfirmInfo = 'immediate' | 'openDate'
type SendTokenInfo = 'lockToken'
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
const fundInfoDefault = {
  totalRaise: '',
  totalSale: '',
  priceRatio: '',
  distributeDuration: '',
  distributeTime: {
    date: '',
    time: '',
  },
  launchDate: {
    date: '',
    time: '',
  },
}
const confirmInfoDefault = {
  immediate: false,
  openDate: {
    date: '',
    time: '',
  },
}
const sendTokenInfoDefault = {
  lockToken: '',
}

export class LaunchpadFormViewModel {
  @observable step = 3.1
  @observable unlockedStep = 3.1
  @observable projectInfo = projectInfoDefault
  @observable tokenInfo = tokenInfoDefault
  @observable fundInfo = fundInfoDefault
  @observable confirmInfo = confirmInfoDefault
  @observable sendToken = sendTokenInfoDefault
  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: string) {
    set(this.projectInfo, property, value)
  }

  @action.bound changeTokenInfo(property: TokenInfo, value: string) {
    set(this.tokenInfo, property, value)
  }

  @action.bound changeFundInfo(property: FundInfo, value: string) {
    set(this.fundInfo, property, value)
  }

  @action.bound changeconfirmInfo(property: ConfirmInfo, value: string) {
    set(this.confirmInfo, property, value)
  }

  @action.bound changeSendTokenInfo(property: SendTokenInfo, value: string) {
    set(this.tokenInfo, property, value)
  }

  @action nextStep(value: number) {
    this.unlockedStep = this.step = value
  }

  @asyncAction *submit() {
    try {
      const { projectName, ...projectInfo } = this.projectInfo
      const { chain, ...tokenInfo } = this.tokenInfo
      const { distributeTime, launchDate, ...fundInfo } = this.fundInfo
      const { openDate, immediate } = this.confirmInfo

      const data = {
        projectName,
        type: 'launchpad',
        status: immediate ? 'voting' : 'pending',
        startTime: toISO(openDate),
        metadata: {
          ...projectInfo,
          ...tokenInfo,
          vesting: {
            ...fundInfo,
            distributeTime: toISO(distributeTime),
            launchDate: toISO(launchDate),
          },
        },
      }

      const res = yield apiService.voting.create(data)
      console.log('launchpad:::', res)
    } catch (error) {
      snackController.commonError(error)
    }
  }
}
