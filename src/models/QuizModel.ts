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
  answer?: number
  choices?: { text?: string; value?: number }[]
}

export const joinTelegramDefault = {
  enabled: false,
  setting: {
    type: 'follow',
    link: '',
    page: 'GloDAO Chanel',
    required: true,
  },
}

export const followTwitterDefault = {
  enabled: false,
  setting: { type: 'follow', page: 'GloDAO', required: true, link: '' },
}

export const quoteTweetDefault = {
  enabled: false,
  setting: {
    type: 'quote',
    content: 'GloDAO',
    page: 'GloDAO',
    hashtag: '',
    link: '',
    embedLink: '',
    required: true,
  },
}

export const commentTweetDefault = {
  enabled: false,
  setting: {
    type: 'comment',
    page: 'GloDAO',
    content: 'GloDAO',
    embedLink: '',
    link: '',
    required: true,
  },
}

export const telegramChatDefault = {
  enabled: false,
  setting: {
    type: 'comment',
    page: 'GloDAO',
    content: 'GloDAO',
    embedLink: '',
    link: '',
    required: true,
  },
}
