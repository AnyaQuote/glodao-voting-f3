export interface Data {
  id?: string
  type?: string
  question?: string
  data?: { text: string; value: string }[]
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
  data?: Data[]
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
