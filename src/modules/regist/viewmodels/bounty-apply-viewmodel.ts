import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, autorun, computed, IReactionDisposer, observable, reaction, when } from 'mobx'
import { set } from 'lodash'
import { asyncAction } from 'mobx-utils'
import { toMoment } from '@/helpers/date-helper'
import { apiService } from '@/services/api-service'
import { getApiFileUrl } from '@/helpers/file-helper'
import { walletStore } from '@/stores/wallet-store'
import { authStore } from '@/stores/auth-store'
import { Subject } from 'rxjs'
import { VotingHandler } from '@/blockchainHandlers/voting-contract-solidity'
import { VotingPools } from '@/models/VotingModel'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: null,
  projectLogo: null,
  fields: [],
  socialLinks: {},
  tokenAddress: '',
}

const confirmInfoDefault = {
  immediate: false,
  openDate: {
    date: '',
    time: '',
  },
}
export class BountyApplyViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable step = 1.1
  @observable unlockedStep = 2.1
  @observable projectInfo = projectInfoDefault
  @observable confirmInfo = confirmInfoDefault

  @observable votingHandler?: VotingHandler

  constructor() {
    this.loadData()
    this._disposers = [
      reaction(
        () => walletStore.account,
        () => {
          //
        }
      ),
    ]
  }

  destroy() {
    this._unsubcrible.next()
    this._unsubcrible.complete()
    this._disposers.forEach((d) => d())
  }

  async loadData() {
    const votingHandler = new VotingHandler()
    this.votingHandler = votingHandler
    // await votingHandler.init()

    this._disposers.push(
      when(
        () => walletStore.solidityConnected,
        async () => {
          votingHandler.injectMetamask(walletStore.web3!)
        }
      )
    )
  }

  @asyncAction *submit() {
    try {
      const { projectName, projectLogo, projectCover, tokenAddress, ...projectInfo } = this.projectInfo
      const { immediate, openDate } = this.confirmInfo
      let res

      const media = new FormData()
      media.append('files', projectLogo!)
      media.append('files', projectCover!)
      res = yield apiService.uploadFile(media)

      const data: VotingPools = {
        projectId: '',
        projectName: projectName,
        unicode: projectName,
        type: 'bounty',
        ownerAddress: walletStore.account,
        rewardAddress: tokenAddress,
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
    } catch (error) {
      snackController.commonError(error)
    }
  }

  @asyncAction *createPool() {
    try {
      yield this.votingHandler?.createPool('0x1fa6283ec7fbb012407e7a5fc44a78b065b2a1cf', walletStore.account)
    } catch (error) {
      console.error('error: ', error)
    }
  }

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
}
