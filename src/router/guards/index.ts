import type { Router } from 'vue-router'
import { useAuthStore, useAppStore } from '@stores/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const WHITE_LIST = ['/login', '/403', '/404', '/500']

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start()

    const authStore = useAuthStore()
    const appStore = useAppStore()

    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}` : import.meta.env.VITE_APP_TITLE

    // 白名单直接放行
    if (WHITE_LIST.includes(to.path)) {
      if (to.path === '/login' && authStore.isAuthenticated) {
        return next('/')
      }
      return next()
    }

    // 未登录跳转到登录页
    if (!authStore.isAuthenticated) {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    // 已登录但未加载用户信息
    if (!authStore.user) {
      try {
        appStore.setGlobalLoading(true)
        await authStore.fetchUserInfo()
      } catch {
        authStore.logout()
        return next({ path: '/login', query: { redirect: to.fullPath } })
      } finally {
        appStore.setGlobalLoading(false)
      }
    }

    // 权限检查
    const { requiresAuth, permissions, roles } = to.meta

    if (requiresAuth === false) return next()

    if (roles?.length && !roles.some((r) => authStore.hasRole(r))) {
      return next('/403')
    }

    if (permissions?.length && !permissions.some((p) => authStore.hasPermission(p))) {
      return next('/403')
    }

    next()
  })

  router.afterEach((to) => {
    NProgress.done()
    const tabsStore = useAppStore()
    void tabsStore
  })

  router.onError((error) => {
    NProgress.done()
    console.error('Router error:', error)
  })
}
