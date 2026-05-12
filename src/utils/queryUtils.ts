import type { ApiResponse, PageResult } from '@types/api'
import type { AxiosResponse } from 'axios'

/**
 * 从 axios 响应中解包业务数据。
 * 用作 useQuery 的 select 选项，让组件直接拿到 T 而不是 AxiosResponse<ApiResponse<T>>。
 */
export function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
  return res.data.data
}

export function unwrapPage<T>(res: AxiosResponse<ApiResponse<PageResult<T>>>): PageResult<T> {
  return res.data.data
}
