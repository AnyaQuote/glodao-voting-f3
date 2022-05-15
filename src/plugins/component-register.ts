import Vue from 'vue'

export const componentRegister = (): void => {
  Vue.component('glodao-dialog', () => import('@/components/glodao-dialog.vue'))
}
