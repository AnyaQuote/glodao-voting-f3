/* eslint-disable no-useless-escape */
import { Answer, QuizData, PreviewQuiz } from '@/models/QuizModel'
import { get } from 'lodash'
const API_ENDPOINT = process.env.VUE_APP_API_STRAPI_ENDPOINT

const extractRegex = /(?:([^\s|\|].+?)(?=\s*\|\s*))|(?<=\n?)(\d)(?!\s*\|\s*)/g
const validateRegex = /^\s*.+(\s*\|\s*[^\s|\|]+){2,6}(\s*\|\s*\d){1}$/

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

/**
 * Read file and return converted line in file to quiz JSON and answer JSON
 * Shape of quiz JSON: {id: string, type: string, question: string, data: {text: string, value: number}[]}
 * Shape of answer JSON: {id: string, answer: number}
 * @param file Quiz file to read
 * @returns return array of quiz JSON and array of answer JSON
 */
export const getDataFromQuizFile = async (file: File) => {
  const quizzes: QuizData[] = []
  const answers: Answer[] = []

  const content = await file!.text()
  const lines = content.trim().split(/\r?\n/)
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (!line) continue
    const extractedArr = line.match(extractRegex)
    const question = extractedArr!.shift()
    const answer = +extractedArr!.pop()!
    const choices = extractedArr!.map((text, value) => ({
      text: text,
      value: value + 1,
    }))

    quizzes.push({
      id: (index + 1).toString(),
      type: 'MC',
      question: question,
      data: choices,
    })

    answers.push({
      id: (index + 1).toString(),
      answer,
    })
  }
  return [quizzes, answers]
}

const errorMessage = (name: string, line: number, message: string) => {
  return `Reading "${name}" at line ${line}: ${message}`
}

/**
 * Read each line in file and convert to array of JSON
 * Shape of JSON {id: string, answer: number, choices: {text: string, value: number}[], question: string}
 * @param file Quiz file to read
 * @param size the first n lines to read in file
 * @returns JSON shape of each line
 */
export const getPreviewFromQuizFile = async (file: File, size = 0) => {
  const data = await file!.text()
  const previewData: PreviewQuiz[] = []
  const lines = data.trim().split(/\r?\n/)
  size = size && lines.length > size ? size : lines.length
  for (let index = 0; index < size; index++) {
    const line = lines[index]
    if (!line) continue
    const extractedArr = line.match(extractRegex)
    const question = extractedArr!.shift()
    const answer = +extractedArr!.pop()!
    const choices = extractedArr!.map((text, value) => ({
      text: text,
      value: value + 1,
    }))
    previewData.push({
      id: (index + 1).toString(),
      question,
      choices,
      answer,
    })
  }
  return previewData
}

/**
 * Read each line in file and check if there is any format error occurs in line
 * @param file quiz file
 * @returns specific line number and error message, if no error return empty string
 */
export const checkQuizFile = async (file?: File | null) => {
  if (!file) {
    return 'No file is selected'
  }
  const data = await file.text()
  const lines = data.trim().split(/\r?\n/)
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (!line) continue
    if (!validateRegex.test(line)) {
      return errorMessage(file.name, index + 1, 'Format not match')
    }
    const extractedArr = line.match(extractRegex)
    if (!extractedArr || !extractedArr.length) {
      return errorMessage(file.name, index + 1, 'Error reading line')
    }

    if (
      !+extractedArr[extractedArr.length - 1] ||
      +extractedArr[extractedArr.length - 1] > extractedArr.slice(1, -1).length
    ) {
      return errorMessage(file.name, index + 1, 'Number of answers do not match')
    }
  }
  return ''
}
