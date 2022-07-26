import web3 from 'web3'
import moment from 'moment'
import { formatFileSize } from '@/helpers'

export const rules = {
  required: (v: any) =>
    (!!v && (typeof v !== 'string' || !!v.trim())) || (!!v && v instanceof File) || v === 0 || 'This is required field',
  maxLength: (length: number) => (v: string) => (v && v.length <= length) || !v || `Max ${length} characters`,
  minLength: (length: number) => (v: string) => (v && v.length >= length) || !v || `Min ${length} characters`,
  max: (number: number) => (v: number) => v <= number || `Must be lower than or equal to ${number}`,
  min: (number: number) => (v: number) => v >= number || `Must be greater than or equal to ${number}`,
  gt: (number: number) => (v: number) => v > number || `Must be greater than ${number}`,
  email: (v: string) =>
    (v &&
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v.trim()
      )) ||
    !v ||
    'Wrong format',
  url: (v: string) =>
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,64}(:[0-9]{1,5})?(\/.*)?$/.test(
      v
    ) ||
    !v ||
    'Invalid URL',
  equal: (target: string, msg: string) => (v: string) => !v || target === v || msg || `Must be equal to ${target}`,
  phone: (v: string) =>
    !v || (v.length >= 10 && /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/gi.test(v)) || 'Wrong format',
  password: (v: string) =>
    !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || 'Password is not vaid',
  nospace: (v: string) => !v || !/ /.test(v.trim()) || 'There is space',
  notEmpty: (v: string) => !Array.isArray(v) || !!v.length || 'Required',
  floatNumberOnly: (v: string) => !v || /^(?!0\d)\d*(\.\d+)?$/gi.test(v) || 'Number is not valid',
  yyyymmdd: (v: string) =>
    (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(v.trim()) && moment(v, 'DD/MM/YYYY').isValid()) || 'Invalid date',
  integer: (v: string) => /^[0-9]+$/.test(v.trim()) || 'Must be integer',
  hhmm: (v: string) =>
    (/^[0-9]{2}:[0-9]{2}$/.test(v.trim()) && (moment(v, 'hh:mm').isValid() || moment(v, 'HH:mm').isValid())) ||
    'Invalid time ',
  isAddress: (v: string) => !v || web3.utils.isAddress(v.trim()) || 'Address not valid',
  maxSize: (size: number) => (value: any) =>
    !value || value.size < size || `File size should be less than ${formatFileSize(size)}`,
  isImage: (v: File) => !v || (v instanceof File && /^(image)\/.*$/.test(v.type)) || 'File is not an image.',
  isTextFile: (v: File) =>
    !v || (v instanceof File && /\.(csv|te?xt)$/i.test(v.name)) || 'File is not plain text file.',
}

export const appRules = {}
