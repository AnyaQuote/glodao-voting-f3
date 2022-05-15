import { observable, action } from 'mobx'

export class VotingDetailViewModel {
  @observable show = false

  @action.bound toggle() {
    this.show = !this.show
  }
}
