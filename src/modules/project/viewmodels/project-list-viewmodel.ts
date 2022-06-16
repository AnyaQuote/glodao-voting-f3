import { appProvider } from '@/app-providers'
import { waitForWalletAccount } from '@/helpers/promise-helper'
import { authStore } from '@/stores/auth-store'
import { PoolStore } from '@/stores/pool-store'
import { observable, action, computed, IReactionDisposer } from 'mobx'
export class ProjectListViewModel {
  _disposers: IReactionDisposer[] = []

  @observable filterRejected = false
  @observable filterType = 'bounty'
  @observable votingPools: PoolStore[] = []
  @observable loading = false

  constructor() {
    this.fetchMyProject()
  }

  @action async fetchMyProject() {
    try {
      this.loading = true
      if (!authStore.attachedAddress) return
      const pools = await appProvider.api.voting.find({ ownerAddress: authStore.attachedAddress }, { _limit: -1 })
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

  @action.bound shouldFilterRejected(value: boolean) {
    this.filterRejected = !!value
  }

  @computed get filteredTypeProjects() {
    return this.votingPools.filter((item) => item.type === this.filterType)
  }

  @computed get filteredStatusProjects() {
    return this.filterRejected
      ? this.filteredTypeProjects.filter((item) => item.status === 'approved' || item.onVoting)
      : this.filteredTypeProjects
  }
}
