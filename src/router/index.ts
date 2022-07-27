import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { authStore } from '@/stores/auth-store'
import { attachWalletDialogController } from '@/components/attach-wallet/attach-wallet-dialog-controller'
import { twitterLoginDialogController } from '@/components/twitter-login/twitter-login-dialog-controller'
import { ERROR_MSG_LOGIN_TO_CONTINUE, WALLET_ATTACHED_SUCCESSFUL, WALLET_CONNECTED_SUCCESSFUL } from '@/constants'
import { promiseHelper } from '@/helpers/promise-helper'
import { confirmDialogController } from '@/components/confirm-dialog/confirm-dialog-controller'

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
  unauthenticated = '/401',
}

export enum RouteName {
  VOTING_LIST = 'voting-list',
  VOTING_DETAIL = 'voting-detail',
  NEW_PROJECT = 'new-project',
  NEW_LAUNCHPAD_PROJECT = 'launchpad-apply',
  NEW_BOUNTY_PROJECT = 'bounty-apply',
  PROJECT_LIST = 'project-list',
  PROJECT_DETAIL = 'project-detail',
  NEW_SOCIAL_MISSION = 'social-mission-apply',
  NEW_LEARN_MISSION = 'learn-mission-apply',
  NEW_IAT_MISSION = 'iat-mission-apply',
  MISSION_LEARN_DETAIL = 'learn-mission-detail',
  MISSION_SOCIAL_DETAIL = 'social-mission-detail',
  MISSION_IAT_DETAIL = 'iat-mission-detail',
  NOT_FOUND = 'not-found',
  UNAUTHENTICATED = 'unauthenticated',
  COMMING_SOON = 'comming-soon',
  TWITTER_AUTH = 'TwitterAuthentication',
}

const routes: Array<RouteConfig> = [
  { path: '/', redirect: '/projects' },
  {
    path: '/twitter-auth',
    name: RouteName.TWITTER_AUTH,
    component: () => import('@/modules/auth/pages/twitter-auth.vue'),
  },
  // -------------------- VOTING ROUTER SECTION ---------------------
  {
    path: '/voting',
    name: RouteName.VOTING_LIST,
    component: () => import('@/modules/voting/pages/voting-home.vue'),
    meta: {
      auth: false,
      wallet: false,
      title: 'Voting List',
    },
  },
  {
    path: '/voting/:code',
    name: RouteName.VOTING_DETAIL,
    component: () => import('@/modules/voting/pages/voting-detail.vue'),
    meta: {
      auth: false,
      wallet: false,
      title: 'Voting detail',
    },
  },
  // ------------------- APPLICATION ROUTER SECTION -----------------------
  {
    path: '/new-project',
    name: RouteName.NEW_PROJECT,
    component: () => import('@/modules/regist/pages/new-project.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'New Application',
    },
  },
  {
    path: '/new-project/launchpad',
    name: RouteName.NEW_LAUNCHPAD_PROJECT,
    component: () => import('@/modules/regist/pages/launchpad-form.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Launchpad Application',
      promptBeforeLeave: true,
    },
  },
  {
    path: '/new-project/bounty',
    name: RouteName.NEW_BOUNTY_PROJECT,
    component: () => import('@/modules/regist/pages/bounty-form.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Bounty Application',
      promptBeforeLeave: true,
    },
  },

  // --------------- PROJECT ROUTER SECTION -------------------
  {
    path: '/projects',
    name: RouteName.PROJECT_LIST,
    component: () => import('@/modules/project/pages/project-list.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Projects',
    },
  },
  {
    path: '/projects/:unicodeName',
    name: RouteName.PROJECT_DETAIL,
    component: () => import('@/modules/project/pages/project-detail.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Project detail',
    },
  },
  {
    path: '/projects/:unicodeName/new/social',
    name: RouteName.NEW_SOCIAL_MISSION,
    component: () => import('@/modules/mission/pages/new-social-page.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Social Mission Form',
      promptBeforeLeave: true,
    },
  },
  {
    path: '/projects/:unicodeName/new/learn',
    name: RouteName.NEW_LEARN_MISSION,
    component: () => import('@/modules/mission/pages/new-learn-page.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Learn Mission Form',
      promptBeforeLeave: true,
    },
  },
  {
    path: '/projects/:unicodeName/new/app-trial',
    name: RouteName.NEW_IAT_MISSION,
    component: () => import('@/modules/mission/pages/new-iat-page.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'In-App-Trial Mission Form',
      promptBeforeLeave: true,
    },
  },
  {
    path: '/projects/:unicodeName/mission/learn/:id',
    name: RouteName.MISSION_LEARN_DETAIL,
    component: () => import('@/modules/mission-detail/pages/learn-detail-page.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Learn Mission detail',
    },
  },
  {
    path: '/projects/:unicodeName/mission/social/:id',
    name: RouteName.MISSION_SOCIAL_DETAIL,
    component: () => import('@/modules/mission-detail/pages/social-detail-page.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'Social Mission detail',
    },
  },
  {
    path: '/projects/:unicodeName/app-trial/iat/:id',
    name: RouteName.MISSION_IAT_DETAIL,
    component: () => import('@/modules/mission-detail/pages/iat-detail-page.vue'),
    meta: {
      auth: true,
      wallet: true,
      title: 'In App Trial Mission detail',
    },
  },
  {
    path: '/comming-soon',
    name: RouteName.COMMING_SOON,
    component: () => import('@/modules/error/pages/coming-soon.vue'),
    meta: {
      title: 'Comming soon',
    },
  },
  {
    path: '/404',
    name: RouteName.NOT_FOUND,
    component: () => import('@/modules/error/pages/404.vue'),
    meta: {
      title: 'Not found',
    },
  },
  {
    path: '/401',
    name: RouteName.UNAUTHENTICATED,
    component: () => import('@/modules/error/pages/401.vue'),
    meta: {
      title: 'Unauthenticated',
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

router.beforeEach(async (to, from, next) => {
  if (!to.name) {
    next({ name: RouteName.NOT_FOUND })
  } else {
    // =====================================================================
    // Prompt user if they want to exist bounty form page
    const shouldPromptBeforeLeave = from.matched.some((m) => m.meta?.promptBeforeLeave === true)
    if (shouldPromptBeforeLeave) {
      const confirm = await confirmDialogController.openAsync({
        title: 'Warning',
        content: 'All your changes will be lost. Are you sure you want to exit the page?',
      })
      if (confirm === false) {
        next(false)
        return
      }
    }
    // =====================================================================
    // Currently disable any route that leads to voting list and detail and launchpad apply page
    if (to.name === 'voting-list' || to.name === 'voting-detail' || to.name === 'launchpad-apply') {
      next({ name: RouteName.COMMING_SOON })
    }
    // =====================================================================
    const requiredAuth = to.matched.some((m) => m.meta?.auth === true)
    if (requiredAuth && !authStore.jwt) {
      const dialogStatus = await twitterLoginDialogController.open({ message: ERROR_MSG_LOGIN_TO_CONTINUE })
      // twitterLoginDialogController.close()

      // If user denied sign in, redirect to 401 page
      if (!dialogStatus) {
        next({ name: RouteName.UNAUTHENTICATED })
      }
    }
    next()
    // =====================================================================
  }
})

router.afterEach(async (to, _) => {
  const requiredWallet = to.matched.some((m) => m.meta?.wallet === true)
  if (requiredWallet) {
    const status = await attachWalletDialogController.openToValidateWallet()
    if (status === WALLET_ATTACHED_SUCCESSFUL) {
      attachWalletDialogController.close()
      promiseHelper.delay(500)
      // Should renew user object instead of reload
      location.reload()
    } else if (status === WALLET_CONNECTED_SUCCESSFUL) {
      attachWalletDialogController.disposeReaction()
      attachWalletDialogController.revealCloseButton()
    }
  }
})

export default router
