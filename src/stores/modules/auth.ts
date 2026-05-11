import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, AuthState } from '@types/store'
import { authApi } from '@api/modules/auth'
import { storage } from '@utils/storage'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// 用于在 axios 拦截器等非组件上下文中访问
let _authStoreInstance: ReturnType<typeof useAuthStore> | null = null

export function useAuthStoreOutside() {
  if (!_authStoreInstance) {
    throw new Error('Auth store not initialized. Call useAuthStore() first in a component.')
  }
  return _authStoreInstance
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref<string | null>(storage.get<string>(TOKEN_KEY))
    const refreshToken = ref<string | null>(storage.get<string>(REFRESH_TOKEN_KEY))
    const user = ref<UserInfo | null>(null)
    const loading = ref(false)

    const isAuthenticated = computed(() => !!accessToken.value)
    const hasRole = (role: string) => user.value?.roles.includes(role) ?? false
    const hasPermission = (permission: string) => user.value?.permissions.includes(permission) ?? false
    const hasAnyPermission = (permissions: string[]) =>
      permissions.some((p) => user.value?.permissions.includes(p))
    const hasAllPermissions = (permissions: string[]) =>
      permissions.every((p) => user.value?.permissions.includes(p))

    function setTokens(access: string, refresh: string) {
      accessToken.value = access
      refreshToken.value = refresh
      storage.set(TOKEN_KEY, access)
      storage.set(REFRESH_TOKEN_KEY, refresh)
    }

    function clearTokens() {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      storage.remove(TOKEN_KEY)
      storage.remove(REFRESH_TOKEN_KEY)
    }

    async function login(username: string, password: string) {
      loading.value = true
      try {
        const res = await authApi.login({ username, password })
        const { accessToken: at, refreshToken: rt } = res.data.data
        setTokens(at, rt)
        await fetchUserInfo()
      } finally {
        loading.value = false
      }
    }

    async function fetchUserInfo() {
      const res = await authApi.getUserInfo()
      user.value = res.data.data
    }

    async function refreshAccessToken(): Promise<string> {
      if (!refreshToken.value) throw new Error('No refresh token')
      const res = await authApi.refreshToken(refreshToken.value)
      const { accessToken: at, refreshToken: rt } = res.data.data
      setTokens(at, rt)
      return at
    }

    async function logout() {
      try {
        await authApi.logout()
      } finally {
        clearTokens()
      }
    }

    // 注册实例供非组件上下文使用
    _authStoreInstance = {
      accessToken,
      refreshToken,
      user,
      loading,
      isAuthenticated,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      login,
      logout,
      fetchUserInfo,
      refreshAccessToken,
    } as ReturnType<typeof useAuthStore>

    return {
      accessToken,
      refreshToken,
      user,
      loading,
      isAuthenticated,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      login,
      logout,
      fetchUserInfo,
      refreshAccessToken,
    }
  },
  {
    persist: {
      paths: ['accessToken', 'refreshToken'],
    },
  },
)

// 补充：让实例在 store 初始化时立即可用
export function initAuthStore(store: ReturnType<typeof useAuthStore>) {
  _authStoreInstance = store
}
