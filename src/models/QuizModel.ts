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
  id?: string
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
    canRepeat?: boolean
    correctAnswersPerQuiz?: string
    questionsPerQuiz?: string
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
  tokenBasePrice?: string
  priorityRatio?: string
}

export interface PreviewQuiz {
  id?: string
  question?: string
  answer?: number | string
  choices?: { text?: string; value?: number | string }[]
}
