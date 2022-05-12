import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { pluginsRegister } from './plugins/plugins-register'
import { vueFilterRegister } from './plugins/vue-filter-register'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGitBook } from '@/assets/icons'

library.add(faGitBook)

Vue.config.productionTip = false

// app configs
pluginsRegister()
vueFilterRegister()
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
