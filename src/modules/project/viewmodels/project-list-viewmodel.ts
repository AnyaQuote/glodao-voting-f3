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
  @observable loading = false;
  @asyncAction *fetchMyProject() {
    try {
      this.loading = true
      loadingController.increaseRequest()
      const res = yield appProvider.api.voting.find({
        ownerAddress: appProvider.authStore.username,
      })
      this.projects = res
    } catch (error) {
      appProvider.snackbar.commonError(error)
      appProvider.router.go(-1)
    } finally {
      this.loading = false
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
}
