import type { RouteRecordRaw } from 'vue-router'

// 扩展 RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    // 是否需要登录
    requiresAuth?: boolean
    // 权限标识列表
    permissions?: string[]
    // 角色标识列表
    roles?: string[]
    // 是否缓存页面
    keepAlive?: boolean
    // 是否在侧边栏显示
    hidden?: boolean
    // 是否固定在 tab 栏
    affix?: boolean
    // 面包屑导航
    breadcrumb?: boolean
    // 外链地址
    link?: string
    // 所属模块
    module?: string
  }
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  children?: AppRouteRecordRaw[]
}

export interface MenuMeta {
  title: string
  icon?: string
  hidden?: boolean
  affix?: boolean
  keepAlive?: boolean
}

export interface MenuItem {
  path: string
  name?: string
  meta: MenuMeta
  children?: MenuItem[]
  redirect?: string
}
