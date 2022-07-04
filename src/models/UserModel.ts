import { ProjectOwner } from './ProjectOwnerModel'

export interface User {
  avatar?: string
  blocked?: boolean
  confirmed?: boolean
  createdAt?: string
  email?: string
  id?: string
  provider?: string
  referralCode?: string
  referrerCode?: string
  role?: string
  twitterCreatedTime?: string
  twitterId?: string
  updatedAt?: string
  username?: string
  projectOwner?: ProjectOwner
}
