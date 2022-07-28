import { ProjectOwner } from './ProjectOwnerModel'

export interface QuizData {
  id?: string
  type?: string
  question?: string
  data?: { text: string; value: string | number }[]
}

export interface MetaData {
  coverImage?: string
  tags?: string[]
}

export interface Answer {
  id?: string
  answer?: number | string
}

export interface Quiz {
  name?: string
  learningInformation?: string
  description?: string
  data?: QuizData[]
  answer?: Answer[]
  metadata?: MetaData
  ownerAddress?: string
  userId?: string
  projectOwner?: ProjectOwner
}

export interface LearnToEarn {
  enabled?: boolean
  setting?: {
    name?: string
    description?: string
    imageCover?: File | null
    quizFile?: File | null
    learningFile?: File | null
  }
}

export interface MissionInfo {
  name?: string
  shortDescription?: string
  missionCover?: File | null
  priorityAmount?: string
  maxParticipants?: string
  maxPriorityParticipants?: string
  startDate?: string
  endDate?: string
  type?: string
}

export interface PreviewQuiz {
  id?: string
  question?: string
  answer?: number | string
  choices?: { text?: string; value?: number | string }[]
}

export const joinTelegramDefault = {
  enabled: false,
  setting: {
    type: 'follow',
    link: '',
    page: '',
    required: true,
  },
}

export const followTwitterDefault = {
  enabled: false,
  setting: { type: 'follow', page: '', required: true, link: '' },
}

export const quoteTweetDefault = {
  enabled: false,
  setting: {
    type: 'quote',
    content: '',
    page: '',
    hashtag: [],
    link: '',
    embedLink: '',
    required: true,
  },
}

export const commentTweetDefault = {
  enabled: false,
  setting: {
    type: 'comment',
    page: '',
    content: '',
    embedLink: '',
    link: '',
    required: true,
  },
}

export const telegramChatDefault = {
  enabled: false,
  setting: {
    type: 'comment',
    page: '',
    content: '',
    embedLink: '',
    link: '',
    required: true,
  },
}

export const facebookFollowSetting = {
  enabled: false,
  setting: { type: 'follow', page: '', required: true, link: '' },
}

export const customTaskSetting = {
  enabled: false,
  setting: {
    type: 'custom',
    requiredContent: '',
    description: '',
    link: '',
    page: '',
    icon: 'website',
    isLinkRequired: false,
  },
}
