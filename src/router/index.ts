import { authStore } from '@/stores/auth-store'
import Vue from 'vue'
import VueRouter, { RouteConfig, Route } from 'vue-router'
import { get, isEmpty } from 'lodash'

Vue.use(VueRouter)

export enum RoutePaths {
  voting_list = '/voting',
  voting_detail = '/voting/',
  project_list = '/projects',
  project_detail = '/projects/',
  new_application = '/new-project',
  new_bounty_application = '/new-project/bounty',
  new_launchpad_application = '/new-project/launchpad',
  comming_soon = '/comming-soon',
}

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
          auth: false,
          title: 'Voting List',
        },
      },
      {
        path: 'voting/:code',
        name: 'voting-detail',
        component: () => import('@/modules/voting/pages/voting-detail.vue'),
        meta: {
          auth: false,
          params: true,
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
          auth: false,
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
    path: '/comming-soon',
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

router.beforeEach((to, from, next) => {
  if (!get(to, 'name', '')) {
    next('/comming-soon')
  } else {
    const isAuthenticated = authStore.isAuthenticated
    const requiredAuth = to.matched.some((m) => m.meta?.auth === true)
    // const isFormPage = to.name === 'bounty-apply' || to.name === 'launchpad-apply'
    // const requireParams = to.matched.some((m) => m.meta?.params === true)
    // If is in bounty form or launchpad form without isAuth => back to new-project
    if ((requiredAuth && isAuthenticated) || !requiredAuth) {
      next()
    } else if (requiredAuth && !isAuthenticated) {
      //
    } else {
      console.error(`VueRouter error ${to.name} requriedAuth=${requiredAuth} isAuthenticated=${isAuthenticated}`)
    }
  }
})

export default router
