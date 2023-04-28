import { observable } from 'mobx'

export enum HandlerType {
  social,
  generalInformation,
  lte,
  iat,
  confirm,
}

export enum HandlerName {
  social = 'social',
  generalInformation = 'generalInformation',
  lte = 'lte',
  iat = 'iat',
  confirm = 'confirm',
}

export interface IBaseHandler {
  type: HandlerType
  name: HandlerName

  valid: boolean

  getData()

  setData?(data?: any)
}
