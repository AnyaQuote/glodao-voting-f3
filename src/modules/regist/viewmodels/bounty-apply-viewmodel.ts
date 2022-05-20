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
export class BountyApplyViewModel {
  _disposers: IReactionDisposer[] = []
  private _unsubcrible = new Subject()

  @observable jwt = ''
  @observable userInfo: any = undefined

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

  @asyncAction *login() {
    if (!this.isLogin && walletStore.account) {
      walletStore.resetJwt()
      let getUser: any = []
      try {
        getUser = yield apiService.users.find({ username: walletStore.account }, { _limit: 1 }) || []
      } catch (e) {
        //
      }
      let user = getUser[0]
      if (!user) {
        user = yield apiService.users.signUp(walletStore.account)
      }

      let signature
      try {
        signature = yield this.signMessage(
          walletStore.account,
          walletStore.chainType,
          user?.nonce,
          walletStore.selectedAdapter
        )
      } catch (e) {
        yield walletStore.disconnectAccount()
      }
      if (!signature) return

      try {
        const res = yield apiService.users.signIn({
          publicAddress: walletStore.account,
          signature,
        })
        if (res) {
          this.userInfo = res.user
          this.jwt = res.jwt
          authStore.changeJwt(res.jwt)
        }
      } catch (e) {
        snackController.commonError(e)
      }
    }
  }

  @asyncAction *signMessage(account, chainType, nonce, selectedAdapter: any = null) {
    if (!account) return ''
    const message = `GloDAO wants to: \n Sign message with account \n ${account} - One time nonce: ${nonce}`
    const data = new TextEncoder().encode(message)
    if (chainType === 'sol') {
      //solana sign message
    } else {
      //bsc sign message
      if (typeof window === 'undefined') {
        return ''
      }
      if (window.ethereum) {
        const request = { method: 'personal_sign', params: [message, account] }
        return yield window.ethereum.request(request)
      } else {
        throw new Error('Plugin Metamask is not installed!')
      }
    }
  }

  @asyncAction *submit() {
    // yield this.createPool()
    // return

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

  @computed get isLogin() {
    return !!this.jwt
  }
}
