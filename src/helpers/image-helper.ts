import { isNil } from 'lodash-es'

const url = (file: File | string | null): string => {
  return !isNil(file) ? (typeof file === 'string' ? file : URL.createObjectURL(file)) : ''
}

const name = (file: File | string | null): string => {
  const fileURL = url(file)
  if (!fileURL) return ''
  return fileURL.substring(fileURL.lastIndexOf('/') + 1)
}

const size = (file: File | string | null): number => {
  return isNil(file) || typeof file === 'string' ? 0 : file.size
}

export const imageHelper = {
  url: url,
  name: name,
  size: size,
}
