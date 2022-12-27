import { observable } from 'mobx'

export enum HandlerType {
  social,
  missionInfo,
  lte,
  iat,
}

export enum HandlerName {
  social = 'social',
  missionInfo = 'missionInfo',
  lte = 'lte',
  iat = 'iat',
}

export interface IBaseHandler {
  type: HandlerType
  name: HandlerName

  valid: boolean

  getData()
}
