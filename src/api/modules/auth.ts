import { http } from '../request'
import type { ApiResponse, PageParams, PageResult } from '@types/api'
import type { UserInfo } from '@types/store'

export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterParams {
  username: string
  password: string
  email: string
  captcha: string
}

export const authApi = {
  login: (params: LoginParams) =>
    http.post<ApiResponse<LoginResult>>('/auth/login', params, { withAuth: false }),

  logout: () => http.post<ApiResponse<void>>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    http.post<ApiResponse<LoginResult>>('/auth/refresh', { refreshToken }, { withAuth: false }),

  getUserInfo: () => http.get<ApiResponse<UserInfo>>('/auth/user/info'),

  updatePassword: (params: { oldPassword: string; newPassword: string }) =>
    http.put<ApiResponse<void>>('/auth/user/password', params),

  getCaptcha: () => http.get<ApiResponse<{ key: string; image: string }>>('/auth/captcha', { withAuth: false }),

  getUserList: (params: PageParams) => http.get<ApiResponse<PageResult<UserInfo>>>('/auth/users', { params }),
}
