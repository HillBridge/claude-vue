// 用户信息
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  roles: string[]
  permissions: string[]
  createdAt: string
}

// 认证状态
export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserInfo | null
  isAuthenticated: boolean
}

// 应用全局状态
export interface AppState {
  theme: 'light' | 'dark' | 'system'
  language: 'zh' | 'en'
  sidebarCollapsed: boolean
  loading: boolean
  device: 'mobile' | 'tablet' | 'desktop'
  settings: AppSettings
}

export interface AppSettings {
  primaryColor: string
  borderRadius: number
  compactMode: boolean
  animationsEnabled: boolean
}
