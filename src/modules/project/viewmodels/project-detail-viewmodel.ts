import { appProvider } from '@/app-providers'
import { VotingPools } from '@/models/VotingModel'
import { observable, computed } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get, isEmpty } from 'lodash-es'
import { RoutePaths } from '@/router'
export class ProjectDetailViewModel {
  @observable poolDetail?: VotingPools
  @observable missions = [
    {
      image: 'sao-hoa.png',
      status: 'ended',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      status: 'running',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      status: 'ended',
      name: 'Dragon SB',
      totalReward: 150,
      priorityReward: 100,
      start: '21/12/2022, 10:00 pm',
      end: '21/12/2022, 10:00 pm',
    },
    {
      image: 'sao-hoa.png',
      status: 'ended',
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
      if (isEmpty(res)) {
        appProvider.router.push(RoutePaths.not_found)
      }
      this.poolDetail = get(res, '[0]')
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      this.loading = false
    }
  }

  @computed get projectLogo() {
    return get(this.poolDetail, 'data.projectLogo', '')
  }

  @computed get projectName() {
    return this.poolDetail?.projectName
  }

  @computed get status() {
    return get(this.poolDetail, 'status', '')
  }
}
