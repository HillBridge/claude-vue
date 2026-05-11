// API 响应通用结构
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
  success: boolean
  timestamp: number
}

export interface PageParams {
  page: number
  pageSize: number
  [key: string]: unknown
}

export interface PageResult<T = unknown> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ApiPageResponse<T = unknown> = ApiResponse<PageResult<T>>

// 文件上传
export interface UploadResult {
  url: string
  name: string
  size: number
  type: string
}

// 通用选项
export interface SelectOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
  children?: SelectOption<T>[]
  [key: string]: unknown
}

// 树形数据
export interface TreeNode<T = unknown> {
  id: string | number
  label: string
  children?: TreeNode<T>[]
  data?: T
  [key: string]: unknown
}
