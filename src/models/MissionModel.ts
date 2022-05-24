export interface Task {
  type?: string
  page?: string
  required?: string
  link?: string
  hashtag?: string
  embedLink?: string
}

export interface Data {
  twitter?: Task
  telegram?: Task
}

export interface MetaData {
  shortDescription?: string
  projectLogo?: string
  tokenLogo?: string
  projectCover?: string
  caption?: string
  rewardToken?: string
  socialLinks?: any
  website?: string
}

export interface Mission {}
