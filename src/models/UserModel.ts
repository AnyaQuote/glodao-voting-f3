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
  projectOwner?: {
    address?: string
    createdAt?: string
    id?: string
    metadata?: string
    name?: string
    nonce?: string
    status?: string
    updatedAt?: string
    user: any
  }
}
