import { appProvider } from '@/app-providers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { VotingPools } from '@/models/VotingModel'
import { action, observable, computed, IReactionDisposer, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get } from 'lodash-es'
export class ProjectDetailViewModel {
  @observable project?: VotingPools
  @observable missions = [
    {
      image: 'sao-hoa.png',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
  ]
  @observable loading = false

  constructor(unicodeName: string) {
    this.fetchProjectDetail(unicodeName)
  }

  @asyncAction *fetchProjectDetail(query: string) {
    try {
      this.loading = true
      const res = yield appProvider.api.voting.find(
        { unicodeName: query, ownerAddress: appProvider.authStore.username },
        { _limit: 1 }
      )
      this.project = get(res, '[0]')
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @computed get projectLogo() {
    return this.project?.data.projectLogo
  }

  @computed get projectName() {
    return this.project?.projectName
  }

  @computed get status() {
    return get(this.project, 'status', '')
  }
}
