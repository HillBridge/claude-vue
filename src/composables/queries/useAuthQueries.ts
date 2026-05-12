import type { LoginParams } from '@api/modules/auth'
import { authApi } from '@api/modules/auth'
import { authKeys } from '@api/queryKeys'
import { useAuthStore } from '@stores/index'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { PageParams } from '@types/api'
import { unwrap, unwrapPage } from '@utils/queryUtils'
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * 当前登录用户信息。
 * enabled 默认跟随登录状态，未登录时不发请求。
 */
export function useUserInfoQuery() {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: authKeys.userInfo(),
    queryFn: () => authApi.getUserInfo(),
    select: unwrap,
    enabled: () => authStore.isAuthenticated,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * 用户列表（分页）。
 * params 可以是响应式 ref，变化时自动重新请求。
 * keepPreviousData 让翻页时保留上一页数据，避免 loading 闪烁。
 */
export function useUserListQuery(params: MaybeRef<PageParams>) {
  return useQuery({
    queryKey: computed(() => authKeys.userList(toValue(params))),
    queryFn: () => authApi.getUserList(toValue(params)),
    select: unwrapPage,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })
}

/**
 * 验证码（每次调用拿新的，不缓存）。
 */
export function useCaptchaQuery() {
  return useQuery({
    queryKey: authKeys.captcha(),
    queryFn: () => authApi.getCaptcha(),
    select: unwrap,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  })
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * 登录 mutation。
 * 成功后写 token → prefetch userInfo，供调用方直接跳转。
 */
export function useLoginMutation() {
  const authStore = useAuthStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (params: LoginParams) => authApi.login(params),
    onSuccess: async (res) => {
      const { accessToken, refreshToken } = res.data.data
      // 写入 store（内部同步到 localStorage）
      ;(authStore as unknown as { accessToken: string }).accessToken = accessToken
      ;(authStore as unknown as { refreshToken: string }).refreshToken = refreshToken

      // 预取用户信息，让跳转后的页面无需等待
      await qc.prefetchQuery({
        queryKey: authKeys.userInfo(),
        queryFn: () => authApi.getUserInfo(),
      })
    },
  })
}

/**
 * 登出 mutation。
 * 成功/失败都清掉所有缓存，防止旧数据残留给下一个用户。
 */
export function useLogoutMutation() {
  const authStore = useAuthStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      authStore.logout()
      qc.clear()
    },
  })
}

/**
 * 修改密码 mutation。
 * 成功后使 userInfo 缓存失效，触发后台重新拉取。
 */
export function useUpdatePasswordMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (params: { oldPassword: string; newPassword: string }) =>
      authApi.updatePassword(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.userInfo() })
    },
  })
}
