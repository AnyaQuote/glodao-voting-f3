import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import Vue from 'vue'
import vuescroll from 'vuescroll'
import App from './App.vue'
import { componentRegister } from './plugins/component-register'
import { directiveRegister } from './plugins/directive-register'
import { pluginsRegister } from './plugins/plugins-register'
import { vueFilterRegister } from './plugins/vue-filter-register'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false
Vue.use(vuescroll, {
  ops: {
    bar: {
      background: '#FFC10766',
    },
  },
})
// app configs
pluginsRegister()
componentRegister()
directiveRegister()
vueFilterRegister()

const lightFavicon = document.querySelector('link#favicon-light')
const darkFavicon = document.querySelector('link#favicon-dark')

const systemDarkMatcher = window.matchMedia('(prefers-color-scheme: dark)')
const onSystemDarkMatcherChanged = () => {
  const dark = systemDarkMatcher.matches
  if (dark && lightFavicon && darkFavicon) {
    lightFavicon.remove()
    document.head.append(darkFavicon)
  } else if (lightFavicon && darkFavicon) {
    darkFavicon.remove()
    document.head.append(lightFavicon)
  }
}
systemDarkMatcher.onchange = () => onSystemDarkMatcherChanged()
onSystemDarkMatcherChanged()

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
