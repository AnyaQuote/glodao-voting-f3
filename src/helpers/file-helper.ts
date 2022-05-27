import { Answer, Data } from '@/models/QuizModel'
import { get } from 'lodash'
const API_ENDPOINT = process.env.VUE_APP_API_STRAPI_ENDPOINT

export const getApiFileUrl = (model: any) => {
  if (typeof model === 'string') {
    if (model.length && model[0] === '/') model = model.substring(1)
    return API_ENDPOINT + model
  } else if (get(model, 'url')) {
    let url = get(model, 'url')
    if (url.length && url[0] === '/') url = url.substring(1)
    return API_ENDPOINT + url
  } else {
    return null
  }
}

export const convertBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const getJSONFromFile = (data: any) => {
  if (data) {
    const quiz: Data[] = []
    const answer: Answer[] = []
    const lines = data.split(/\r?\n/)
    lines.forEach((line, index) => {
      const sentences = line.split('|')
      console.log(sentences)
      // format [question, answer 1, answer 2, answer 3, answer 4, right answer position (1-4)]
      const question = sentences[0]
      const choices = sentences.slice(1, 5).map((choice, index) => ({
        text: choice,
        value: `${index + 1}`,
      }))
      const rightChoice = sentences[5]
      quiz.push({
        id: `${index + 1}`,
        type: 'MC',
        question: question,
        data: choices,
      })
      answer.push({
        id: `${index + 1}`,
        answer: rightChoice,
      })
    })
    return [quiz, answer]
  }
  return []
}
