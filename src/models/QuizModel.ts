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
  answer?: string
}

export interface Quiz {
  name?: string
  learningInformation?: string
  description?: string
  data?: Data[]
  answer?: Answer[]
  metadata?: MetaData
}
