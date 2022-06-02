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

export interface PreviewQuiz {
  id?: string
  question?: string
  answer?: number
  choices?: { text?: string; value?: number }[]
}
