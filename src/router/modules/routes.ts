import type { AppRouteRecordRaw } from '@model/router'

// 常量路由（无需权限）
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@pages/auth/LoginPage.vue'),
    meta: { title: '登录', hidden: true, requiresAuth: false },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@pages/error/403Page.vue'),
    meta: { title: '无权限', hidden: true, requiresAuth: false },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@pages/error/404Page.vue'),
    meta: { title: '页面不存在', hidden: true, requiresAuth: false },
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@pages/error/500Page.vue'),
    meta: { title: '服务器错误', hidden: true, requiresAuth: false },
  },
]

// 动态路由（需根据权限动态注册）
export const asyncRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    meta: { title: '首页', requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@pages/dashboard/DashboardPage.vue'),
        meta: {
          title: '控制台',
          icon: 'i-lucide-layout-dashboard',
          affix: true,
          keepAlive: true,
          requiresAuth: true,
        },
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@pages/dashboard/UserListPage.vue'),
        meta: {
          title: '用户管理',
          icon: 'i-lucide-users',
          keepAlive: true,
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
]
