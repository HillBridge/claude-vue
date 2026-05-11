import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes, asyncRoutes } from './modules/routes'
import { setupRouterGuards } from './guards/index'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

setupRouterGuards(router)

export default router
