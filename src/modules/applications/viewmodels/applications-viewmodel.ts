import { observable, action } from 'mobx'

export class Applications {
  @observable hideProjectFilter = false

  @observable bountyProjects = [
    {
      logo: 'voting-trending--logo.png',
      name: 'Dragon Gaming',
      token: 'SB',
      description:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam Velit officia consequat duis enim velit mollit. Exercitation veniam ',
      start: '24/02/2022 10:00 pm',
      end: '24/02/2022 10:00 pm',
      status: 'approved',
      totalVote: 600,
      yesVote: 100,
    },
    {
      logo: 'voting-trending--logo.png',
      name: 'Dragon Gaming',
      token: 'SB',
      description:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam Velit officia consequat duis enim velit mollit. Exercitation veniam ',
      start: '24/02/2022 10:00 pm',
      end: '24/02/2022 10:00 pm',
      status: 'rejected',
      totalVote: 600,
      yesVote: 100,
    },
  ]

  @action.bound hideProject() {
    this.hideProjectFilter = !this.hideProjectFilter
  }
}
