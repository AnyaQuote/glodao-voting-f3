import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { pluginsRegister } from './plugins/plugins-register'
import { vueFilterRegister } from './plugins/vue-filter-register'
import { componentRegister } from './plugins/component-register'

Vue.config.productionTip = false

// app configs
componentRegister()
pluginsRegister()
vueFilterRegister()
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
