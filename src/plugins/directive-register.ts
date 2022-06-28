// import { permissionHelper } from '@/helpers/permission-helper'
// import { authStore } from '@/stores/auth-store'
import Vue from 'vue'
import marked from 'marked'

export const directiveRegister = () => {
  Vue.directive('marked', function (el, binding) {
    if (binding.value) {
      el.innerHTML = marked(binding.value)
    }
  })
}
