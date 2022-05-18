import { authStore } from '@/stores/auth-store'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', redirect: '/NotFound' },
  {
    path: '/',
    component: () => import('@/modules/voting/container/container.vue'),
    children: [
      {
        path: 'voting',
        component: () => import('@/modules/voting/pages/voting-home.vue'),
        meta: {
          auth: true,
          title: 'Voting Home',
        },
      },
      {
        path: 'voting/:id',
        component: () => import('@/modules/voting/pages/voting-detail.vue'),
        meta: {
          auth: true,
          title: 'Voting detail',
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/modules/regist/container/container.vue'),
    children: [
      {
        path: 'projects',
        component: () => import('@/modules/regist/pages/regist-home.vue'),
        meta: {
          auth: true,
          title: 'Application',
        },
      },
      {
        path: 'projects/:id',
        component: () => import('@/modules/regist/pages/regist-home.vue'),
        meta: {
          auth: true,
          title: 'Application',
        },
      },
      {
        path: 'new-project',
        component: () => import('@/modules/regist/pages/new-project.vue'),
        meta: {
          auth: true,
          title: 'Application',
        },
      },
      {
        path: 'new-project/launchpad',
        component: () => import('@/modules/regist/pages/launchpad-form.vue'),
        meta: {
          auth: true,
          title: 'Application',
        },
      },
      {
        path: 'new-project/bounty',
        component: () => import('@/modules/regist/pages/bounty-form.vue'),
        meta: {
          auth: true,
          title: 'Application',
        },
      },
      {
        path: 'new-mission',
        component: () => import('@/modules/regist/pages/mission-form.vue'),
        meta: {
          auth: true,
          title: 'Application',
        },
      },
    ],
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/modules/error/pages/coming-soon.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  next()
})

export default router
