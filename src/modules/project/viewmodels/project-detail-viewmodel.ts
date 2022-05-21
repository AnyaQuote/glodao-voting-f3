import { appProvider } from '@/app-providers'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { VotingPools } from '@/models/VotingModel'
import { action, observable, computed, IReactionDisposer, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { get } from 'lodash-es'
export class ProjectDetailViewModel {
  @observable unicode = ''
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

  _disposer: IReactionDisposer
  constructor() {
    this._disposer = reaction(
      () => this.unicode,
      () => {
        this.fetchProjectDetail()
      }
    )
  }

  @asyncAction *fetchProjectDetail() {
    try {
      loadingController.increaseRequest()
      const res = yield appProvider.api.voting.find({
        unicode: this.unicode,
      })
      this.project = get(res, '[0]')
    } catch (error) {
      appProvider.snackbar.commonError(error)
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @action getUnicode(value: string) {
    this.unicode = value
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

  dispose() {
    this._disposer()
  }
}
