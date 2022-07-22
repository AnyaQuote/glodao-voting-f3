import { appProvider } from '@/app-providers'
import { PoolStore } from '@/stores/pool-store'
import { observable, action, computed, IReactionDisposer } from 'mobx'
export class ProjectListViewModel {
  _disposers: IReactionDisposer[] = []

  @observable filterRejected = false
  @observable filterType = 'bounty'
  @observable votingPools: PoolStore[] = []
  @observable loading = false

  private _auth = appProvider.authStore
  private _api = appProvider.api
  private _snackbar = appProvider.snackbar

  constructor() {
    this.fetchMyProject()
  }

  @action async fetchMyProject() {
    try {
      this.loading = true
      const pools = await this._api.voting.find({ projectOwner: this._auth.projectOwnerId }, { _limit: -1 })
      if (pools && pools.length) {
        this.votingPools = pools.map((pool: any) => {
          const poolStore = new PoolStore(pool)
          return poolStore
        })
      }
    } catch (error) {
      this._snackbar.commonError(error)
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
