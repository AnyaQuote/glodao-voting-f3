import { ProjectOwner } from './ProjectOwnerModel'

export interface APIKey {
  key?: string
  secret?: string
  clientId?: string
  logs?: any
  projectOwner?: ProjectOwner
  tasks?: ReferenceTask
  routes?: Route
  isActive?: boolean
  totalAPICalls?: number
}

export interface Route {
  isPublic?: boolean
  isProtected?: boolean
  method?: string
  path?: string
  description?: string
}

export interface ReferenceTask {
  id?: string
  code?: string
}
