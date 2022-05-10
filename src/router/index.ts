// import { walletStore } from "@/stores/wallet-store"
// import { when } from "mobx"
import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/stake"
  },
  {
    path: "/stake",
    name: "Staking",
    component: () => import("@/modules/staking/pages/staking.vue"),
    meta: {
      title: "Staking"
    }
  }
]

const router = new VueRouter({
  mode: "history",
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

function _setDocumentTitle(title = "Title") {
  document.title = title
}

router.afterEach(to => {
  _setDocumentTitle(to?.meta?.title)
})

export default router
