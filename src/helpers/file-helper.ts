import _ from 'lodash'

export const fileHelpers = {
  getApiFileUrl: (model: any) => {
    if (typeof model === 'string') {
      if (model.length && model[0] === '/') model = model.substring(1)
      return process.env.VUE_APP_API_ENDPOINT + model
    } else if (_.get(model, 'url')) {
      let url = _.get(model, 'url')
      if (url.length && url[0] === '/') url = url.substring(1)
      return process.env.VUE_APP_API_ENDPOINT + url
    } else {
      return null
    }
  },
}

export const convertBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
