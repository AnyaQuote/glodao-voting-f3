import { authStore } from '@/stores/auth-store'
import Vue from 'vue'
import VueRouter, { RouteConfig, Route } from 'vue-router'
import { get, isEmpty } from 'lodash'
import { loginController } from '@/components/login-dialog/login-dialog-controller'

Vue.use(VueRouter)

export enum RoutePaths {
  voting_list = '/voting',
  voting_detail = '/voting/',
  project_list = '/projects',
  project_detail = '/projects/',
  new_mission = '/new-mission',
  new_application = '/new-project',
  new_bounty_application = '/new-project/bounty',
  new_launchpad_application = '/new-project/launchpad',
  comming_soon = '/comming-soon',
  not_found = '/404',
}

const routes: Array<RouteConfig> = [
  { path: '/', redirect: '/voting' },
  // -------------------- VOTING ROUTER SECTION ---------------------
  {
    path: '/voting',
    name: 'voting-list',
    component: () => import('@/modules/voting/pages/voting-home.vue'),
    meta: {
      auth: false,
      title: 'Voting List',
    },
  },
  {
    path: '/voting/:code',
    name: 'voting-detail',
    component: () => import('@/modules/voting/pages/voting-detail.vue'),
    meta: {
      auth: false,
      params: true,
      title: 'Voting detail',
    },
  },
  // ------------------- APPLICATION ROUTER SECTION -----------------------
  {
    path: '/new-project',
    name: 'new-project',
    component: () => import('@/modules/regist/pages/new-project.vue'),
    meta: {
      auth: false,
      title: 'New Application',
    },
  },
  {
    path: '/new-project/launchpad',
    name: 'launchpad-apply',
    component: () => import('@/modules/regist/pages/launchpad-form.vue'),
    meta: {
      auth: true,
      title: 'Launchpad Application',
    },
  },
  {
    path: '/new-project/bounty',
    name: 'bounty-apply',
    component: () => import('@/modules/regist/pages/bounty-form.vue'),
    meta: {
      auth: true,
      title: 'Bounty Application',
    },
  },

  // --------------- PROJECT ROUTER SECTION -------------------
  {
    path: '/projects',
    name: 'project-list',
    component: () => import('@/modules/project/pages/project-list.vue'),
    meta: {
      auth: false,
      title: 'Projects',
    },
  },
  {
    path: '/projects/:code',
    name: 'project-detail',
    component: () => import('@/modules/project/pages/project-detail.vue'),
    meta: {
      auth: true,
      params: true,
      title: 'Project detail',
    },
  },
  {
    path: '/new-mission',
    name: 'mission-apply',
    component: () => import('@/modules/project/pages/new-mission.vue'),
    meta: {
      auth: true,
      title: 'Mission Form',
    },
  },
  {
    path: '/comming-soon',
    name: 'comming-soon',
    component: () => import('@/modules/error/pages/coming-soon.vue'),
    meta: {
      title: 'Comming soon',
    },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/modules/error/pages/404.vue'),
    meta: {
      title: 'Not found',
    },
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

router.beforeEach((to, from, next) => {
  if (!get(to, 'name', '')) {
    next(RoutePaths.not_found)
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  const isAuthenticated = authStore.isAuthenticated
  const requiredAuth = to.matched.some((m) => m.meta?.auth === true)
  if (requiredAuth && !isAuthenticated) {
    loginController.open({ message: 'This page required login. Please sign in to continue' })
  }
})

export default router
