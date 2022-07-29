import { isEmpty } from 'lodash'

export const generateRandomString = (
  length = 6,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
) => {
  return Array.from(self.crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('')
}

export const formatFileSize = (bytes: number, decimalPoint = 2) => {
  if (bytes == 0) return '0 Bytes'
  const k = 1000
  const dm = decimalPoint
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const isNotEmpty = (value) => isEmpty(value)
