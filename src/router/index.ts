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
        name: 'voting-list',
        component: () => import('@/modules/voting/pages/voting-home.vue'),
        meta: {
          auth: true,
          title: 'Voting Home',
        },
      },
      {
        path: 'voting/:id',
        name: 'voting-detail',
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
        name: 'project-list',
        component: () => import('@/modules/regist/pages/project-list.vue'),
        meta: {
          auth: true,
          title: 'Projects',
        },
      },
      // change below to detail page, which have not implement yet
      {
        path: 'projects/:id',
        name: 'project-detail',
        component: () => import('@/modules/regist/pages/project-list.vue'),
        meta: {
          auth: true,
          title: 'Projects',
        },
      },
      {
        path: 'new-project',
        name: 'new-project',
        component: () => import('@/modules/regist/pages/new-project.vue'),
        meta: {
          auth: true,
          title: 'New Application',
        },
      },
      {
        path: 'new-project/launchpad',
        name: 'launchpad-apply',
        component: () => import('@/modules/regist/pages/launchpad-form.vue'),
        meta: {
          auth: true,
          title: 'Launchpad Application',
        },
      },
      {
        path: 'new-project/bounty',
        name: 'bounty-apply',
        component: () => import('@/modules/regist/pages/bounty-form.vue'),
        meta: {
          auth: true,
          title: 'Bounty Application',
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
    path: '/applications',
    component: () => import('@/modules/applications/pages/applications-project-page.vue'),
    meta: {
      auth: true,
      title: 'Application',
    },
  },
  {
    path: '/dao-voting',
    component: () => import('@/modules/dao-voting/pages/dao-voting-page.vue'),
    meta: {
      auth: true,
      title: 'Application',
    },
  },
  {
    path: '/project-detail-bounty',
    component: () => import('@/modules/project-detail-bounty/page/project-detail-bounty-page.vue'),
    meta: {
      auth: true,
      title: 'Application',
    },
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
