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
