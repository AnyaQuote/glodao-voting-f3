import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { action, computed, observable } from 'mobx'
import { get } from 'lodash'
// type Propety = 'projectName' | 'shortDescription' | 'projectCover' | 'keywords' | 'researchProject' | 'socials'

const projectInfoDefault = {
  projectName: '',
  shortDescription: '',
  projectCover: '',
  keywords: [],
  socials: {},
  researchProject: '',
}

const tokenInfoDefault = {
  tokenName: '',
  chain: {},
  tokenContract: '',
  additionLink: '',
}

const fundInfoDefault = {}
export class LaunchpadFormViewModel {
  @observable step = 1.3
  @observable unlockedStep = 1.3
  @observable projectInfo = projectInfoDefault
  @observable tokenInfo = tokenInfoDefault
  @observable fundInfo = fundInfoDefault

  @action.bound changeStep(value: number) {
    if (value > this.unlockedStep) snackController.commonError('You have not completed current step yet!')
    else this.step = value
  }

  @action.bound changeProjectInfo(property: string, value: string) {
    if (property.includes('socials')) {
      const nestedProp = property.split('.')[1]
      this.projectInfo.socials[nestedProp] = value
    } else this.projectInfo[property] = value
  }

  @action.bound changeTokenInfo(property: string, value: string) {
    if (property === 'chain') {
      this.tokenInfo[property] = { name: get(value, 'name'), icon: get(value, 'icon') }
    } else this.tokenInfo[property] = value
  }

  @action.bound changeFundInfo(property: string, value: string) {
    if (property === 'startDate' || property === 'distributeTime') {
      const nestedProp = property.split('.')[1]
      this.projectInfo.socials[nestedProp] = value
    } else this.fundInfo[property] = value
  }

  @action nextStep(value: number) {
    this.unlockedStep = this.step = value
  }
}
