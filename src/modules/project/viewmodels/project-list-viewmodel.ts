import { appProvider } from '@/app-providers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { VotingPools } from '@/models/VotingModel'
import { isEmpty } from 'lodash-es'
import { observable, action, computed, IReactionDisposer, reaction, autorun } from 'mobx'
import { asyncAction } from 'mobx-utils'
export class ProjectListViewModel {
  @observable filterRejected = false
  @observable filterType = 'bounty'
  @observable projects: VotingPools[] = []

  _disposer: IReactionDisposer

  constructor() {
    console.log(this.projects)
    this._disposer = autorun(() => {
      // This requires to run 2 times before stopping when value not changing
      if (!isEmpty(appProvider.wallet.account) && isEmpty(this.projects)) {
        this.fetchMyProject()
      }
    })
  }

  @asyncAction *fetchMyProject() {
    try {
      loadingController.increaseRequest()
      const res = yield appProvider.api.voting.find({
        ownerAddress: appProvider.wallet.account,
      })
      this.projects = res
    } catch (error) {
      appProvider.snackbar.commonError(error)
      appProvider.router.go(-1)
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @action.bound changeFilterdType(value: 'bounty' | 'launchpad') {
    this.filterType = value
  }

  @computed get filteredTypeProjects() {
    return this.projects.filter((item) => item.type === this.filterType)
  }

  @computed get filteredStatusProjects() {
    return this.filterRejected
      ? this.filteredTypeProjects.filter((item) => item.status !== 'rejected')
      : this.filteredTypeProjects
  }

  dispose() {
    this._disposer()
  }
}
