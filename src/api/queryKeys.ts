import type { PageParams } from '@model/api'

/**
 * Query Key Factory
 *
 * 规则：
 *   - 每个"资源"有一个顶层 scope，用于批量 invalidate（如 invalidateQueries(authKeys.all)）
 *   - 越具体的 key 包含越多参数
 *   - 所有 key 均为 readonly tuple，方便类型推断
 */

export const authKeys = {
  all: ['auth'] as const,
  userInfo: () => [...authKeys.all, 'user-info'] as const,
  userList: (params: PageParams) => [...authKeys.all, 'user-list', params] as const,
  captcha: () => [...authKeys.all, 'captcha'] as const,
} as const

// 扩展示例：其他业务模块按同样模式添加
// export const productKeys = {
//   all: ['products'] as const,
//   lists: () => [...productKeys.all, 'list'] as const,
//   list: (params: PageParams) => [...productKeys.lists(), params] as const,
//   detail: (id: string) => [...productKeys.all, 'detail', id] as const,
// }
