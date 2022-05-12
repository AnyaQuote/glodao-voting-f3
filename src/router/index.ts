// import { walletStore } from "@/stores/wallet-store"
// import { when } from "mobx"
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '*',
    redirect: '/voting'
  },
  {
    path: '/',
    component: () => import('@/modules/voting/container/container.vue'),
    children: [
      {
        path: 'voting',
        component: () => import('@/modules/voting/pages/voting-home.vue'),
        meta: {
          auth: true,
          title: 'Voting Home'
        }
      },
      {
        path: 'voting/:id',
        component: () => import('@/modules/voting/pages/voting-detail.vue'),
        meta: {
          auth: true,
          title: 'Voting detail'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

// router.beforeEach(async (to, from, next) => {
//   await when(() => walletStore.loaded)
//   if (!to.name || !to) next("/stake")
//   else next()
// })

function _setDocumentTitle(title = 'Title') {
  document.title = title
}

router.afterEach(to => {
  _setDocumentTitle(to?.meta?.title)
})

export default router
