import { assign, isEqual, set, get, isEmpty, toNumber } from 'lodash-es'
import { action, observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { RouteName, RoutePaths } from '@/router'
import {
  ALLOW_PASS_THROUGH,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  EMPTY_STRING,
  ERROR_MSG_COULD_NOT_GET_AVG_COMMUNITY_REWARD,
  HUNDRED,
  PRIORITY_AMOUNT_RATIO,
  Zero,
} from '@/constants'
import { getDefaultSettingConfig, extractTaskSettings } from '@/helpers'
import { IBaseHandler } from '../handlers/base.handler'
import { GeneralInformationHandler } from '../handlers/general-information/general-information-handler'
import { SocialHandler } from '@/modules/new-mission/handlers/social/social-handler/social.handler'
import { ProjectInfo } from '@/models/VotingModel'
import { ConfirmHandler } from '../handlers/confirm/confirm-handler'

export class NewSocialMissionViewModel {
  @observable loading = false
  @observable btnLoading = false
  @observable step = 0
  @observable handlers: IBaseHandler[] = []

  constructor() {
    this.initData()
  }

  @action initData() {
    this.loading = true
    this.handlers = [new GeneralInformationHandler(), new SocialHandler(), new ConfirmHandler()]
    this.loading = false
  }

  @action changeStep(step: number) {
    this.step = step
  }

  @action backStep() {
    if (this.step > 0) this.changeStep(this.step - 1)
  }

  @action nextStep() {
    if (this.step === this.handlers.length - 1) this.submit()
    else if (this.step < this.handlers.length - 1) {
      if (this.step == 1) {
        const projectInfo = this.handlers[0].getData()
        ;(this.handlers[2] as ConfirmHandler).setProjectInfo(projectInfo)
      }
      this.changeStep(this.step + 1)
    }
  }

  @computed get currentHandler() {
    if (this.handlers.length === 0) return null
    return this.handlers[this.step]
  }

  @computed get isCurrentHandlerValid() {
    return this.currentHandler?.valid ?? false
  }

  @computed get isLastStep() {
    return this.step === this.handlers.length - 1
  }

  @action submit() {
    const projectInfo: ProjectInfo = this.handlers[0].getData()
    const socialInfo = this.handlers[1].getData()
    const mission = {
      endTime: projectInfo.endDate,
      startTime: projectInfo.startDate,
      name: projectInfo.projectName,
      tokenBasePrice: projectInfo.tokenBasePrice,
      rewardAmount: projectInfo.optionalRewardAmount,
      maxPriorityParticipant: projectInfo.maxPriorityParticipants,
      data: socialInfo,
      metadata: {
        shortDescription: projectInfo.shortDescription,
        decimals: 0,
        projectLogo: projectInfo.projectLogo,
        tokenLogo: projectInfo.optionalTokenLogo,
        coverImage: projectInfo.projectCover,
        caption: projectInfo.shortDescription,
        tokenContractAddress: projectInfo.optionalTokenAddress,
        rewardToken: projectInfo.optionalTokenName,
        socialLink: projectInfo.socialLinks,
      },
      priorityRatio: projectInfo.priorityRatio,
      tokenAddress: projectInfo.optionalTokenAddress,
      tokenName: projectInfo.optionalTokenName,
      feeTokenName: 'BUSD',
      feeTokenAmout: 0.01,
      feeTokenAddress: process.env.VUE_APP_BUSD_ADDRESS,
      version: 'v2',
      poolId: 19,
    }
    console.log(mission)
  }
}
