import { isNumber, isEmpty, keys, get } from 'lodash'
import Vue from 'vue'
import { appRules, rules } from './rules'

export const pluginsRegister = () => {
  Vue.use({
    install: (Vue: any) => {
      Vue.prototype.$rules = rules
      Vue.prototype.$appRules = appRules
      Vue.prototype.$_empty = (any: any) => {
        return !isNumber(any) && (!any || isEmpty(any))
      }
      Vue.prototype.$_get = (any: any, path: string, defaultValue = '') => {
        return get(any, path, defaultValue)
      }
      Vue.prototype.$_keys = (any: any) => {
        return keys(any)
      }
    },
  })
}
