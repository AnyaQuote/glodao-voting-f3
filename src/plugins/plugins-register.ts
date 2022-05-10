import _ from "lodash"
import Vue from "vue"
import { appRules, rules } from "./rules"

export const pluginsRegister = () => {
  Vue.use({
    install: (Vue: any) => {
      Vue.prototype.$rules = rules
      Vue.prototype.$appRules = appRules

      // eslint-disable-next-line @typescript-eslint/camelcase
      Vue.prototype.$_empty = (any: any) => {
        return !_.isNumber(any) && (!any || _.isEmpty(any))
      }
      // eslint-disable-next-line @typescript-eslint/camelcase
      Vue.prototype.$_get = (any: any, path: string, defaultValue = "") => {
        return _.get(any, path, defaultValue)
      }
    }
  })
}
