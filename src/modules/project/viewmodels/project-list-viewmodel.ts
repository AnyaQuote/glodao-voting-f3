import { appProvider } from '@/app-providers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { VotingPool } from '@/models/VotingModel'
import { PoolStore } from '@/stores/pool-store'
import { isEmpty } from 'lodash-es'
import { observable, action, computed, IReactionDisposer, reaction, autorun } from 'mobx'
import { asyncAction } from 'mobx-utils'
export class ProjectListViewModel {
  @observable filterRejected = false
  @observable filterType = 'bounty'
  @observable votingPools: PoolStore[] = []
  @observable loading = false

  constructor() {
    if (appProvider.authStore.username) this.fetchMyProject()
  }

  @asyncAction *fetchMyProject() {
    try {
      this.loading = true
      const pools = yield appProvider.api.voting.find(
        {
          ownerAddress: appProvider.authStore.username,
        },
        { _limit: -1 }
      )
      if (pools && pools.length) {
        this.votingPools = pools.map((pool: any) => {
          const poolStore = new PoolStore(pool)
          return poolStore
        })
      }
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @action.bound changeFilterdType(value: 'bounty' | 'launchpad') {
    this.filterType = value
  }

  @computed get filteredTypeProjects() {
    return this.votingPools.filter((item) => item.type === this.filterType)
  }

  @computed get filteredStatusProjects() {
    return this.filterRejected
      ? this.filteredTypeProjects.filter((item) => item.status !== 'rejected')
      : this.filteredTypeProjects
  }
}
