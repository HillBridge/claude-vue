import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@stores/modules/auth'

vi.mock('@api/modules/auth', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({
      data: {
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600,
        },
      },
    }),
    logout: vi.fn().mockResolvedValue({ data: { success: true } }),
    getUserInfo: vi.fn().mockResolvedValue({
      data: {
        data: {
          id: '1',
          username: 'admin',
          nickname: '管理员',
          roles: ['admin'],
          permissions: ['user:list', 'user:create'],
          avatar: '',
          email: '',
          phone: '',
          createdAt: '2024-01-01',
        },
      },
    }),
    refreshToken: vi.fn().mockResolvedValue({
      data: {
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          expiresIn: 3600,
        },
      },
    }),
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初始状态未登录', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })

  it('登录成功后更新 token', async () => {
    const store = useAuthStore()
    await store.login('admin', 'password123')
    expect(store.accessToken).toBe('mock-access-token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('hasPermission 正确检查权限', async () => {
    const store = useAuthStore()
    await store.login('admin', 'password123')
    await store.fetchUserInfo()
    expect(store.hasPermission('user:list')).toBe(true)
    expect(store.hasPermission('user:delete')).toBe(false)
  })

  it('logout 清空认证信息', async () => {
    const store = useAuthStore()
    await store.login('admin', 'password123')
    await store.logout()
    expect(store.accessToken).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
