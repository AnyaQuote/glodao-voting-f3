import Vue from 'vue'

export const componentRegister = () => {
  Vue.component('app-tooltip', () => import('@/components/app-tooltip.vue'))
  Vue.component('connect-metamask', () => import('@/components/connect-metamask.vue'))
  Vue.component('app-dialog', () => import('@/components/app-dialog.vue'))
  Vue.component('app-footer', () => import('@/components/app-footer.vue'))
  Vue.component('snackbar', () => import('@/components/snack-bar/snack-bar.vue'))
  Vue.component('alert', () => import('@/components/alert/alert.vue'))
  Vue.component('global-loading', () => import('@/components/global-loading/global-loading.vue'))
  Vue.component('snack-bar', () => import('@/components/snack-bar/snack-bar.vue'))
  Vue.component('navigation-drawer', () => import('@/components/navigation-drawer.vue'))
  Vue.component('navigation-bar', () => import('@/components/navigation-bar.vue'))
  Vue.component('mobile-navigation-bar', () => import('@/components/mobile-navigation-bar.vue'))
  Vue.component('app-text-field', () => import('@/components/form/app-text-field.vue'))
  Vue.component('app-textarea', () => import('@/components/form/app-textarea.vue'))
  Vue.component('app-select', () => import('@/components/form/app-select.vue'))
  Vue.component('app-icon', () => import('@/components/app-icon.vue'))
  Vue.component('progress-bar', () => import('@/components/progress/progress.vue'))
  Vue.component('connect-wallet', () => import('@/components/connect-wallet.vue'))
}
