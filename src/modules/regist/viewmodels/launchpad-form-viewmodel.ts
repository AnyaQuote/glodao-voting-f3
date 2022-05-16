import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { keys } from 'lodash-es'
import { action, computed, observable } from 'mobx'

// type Propety = 'projectName' | 'shortDescription' | 'projectCover' | 'keywords' | 'researchProject' | 'socials'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: '',
  keywords: [],
  socials: {
    website: '',
    telegram: '',
    twitter: '',
    medium: '',
  },
  researchProject: '',
}

export class LaunchpadFormViewModel {
  @observable step = 1.1
  @observable unlockedStep = 1.1
  @observable projectInfo = projectInfoDefault

  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: string) {
    const nestedProp = property.split('.').at(1)
    this.projectInfo.socials[nestedProp] = value
  }

  nextStep(value: number) {
    console.log('launchpad.projectInfo:::', { ...this.projectInfo })
    this.unlockedStep = this.step = value
  }

  @computed get getAllKeys(): string[] {
    return Object.keys(this.projectInfo)
  }
}
