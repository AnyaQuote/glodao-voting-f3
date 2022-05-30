import { appProvider } from '@/app-providers'
import { PoolStore } from '@/stores/pool-store'
import { walletStore } from '@/stores/wallet-store'
import { observable, action, computed, IReactionDisposer, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
export class ProjectListViewModel {
  _disposers: IReactionDisposer[] = []

  @observable filterRejected = false
  @observable filterType = 'bounty'
  @observable votingPools: PoolStore[] = []
  @observable loading = false

  constructor() {
    this.fetchMyProject()
    this._disposers.push(
      reaction(
        () => walletStore.account,
        (account) => {
          account && this.fetchMyProject()
        },
        { fireImmediately: true }
      )
    )
  }

  @asyncAction *fetchMyProject() {
    this.loading = true
    try {
      const pools = yield appProvider.api.voting.find(
        {
          ownerAddress: walletStore.account,
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
