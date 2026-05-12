import { BusinessError, RequestError } from '@api/errors'
import { QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 窗口重新获得焦点时后台刷新
      refetchOnWindowFocus: true,
      // 网络恢复时自动重新请求
      refetchOnReconnect: true,
      // 组件重新挂载时不重复请求（有缓存就用缓存）
      refetchOnMount: true,
      // 数据在 5 分钟内视为新鲜，不触发后台刷新
      staleTime: 5 * 60 * 1000,
      // 缓存保留 10 分钟（组件卸载后数据在内存中继续存活）
      gcTime: 10 * 60 * 1000,
      // 失败后最多重试 2 次，且不对业务错误（4xx）重试
      retry: (failureCount, error) => {
        if (error instanceof BusinessError) return false
        if (error instanceof RequestError && error.statusCode < 500) return false
        return failureCount < 2
      },
      // 重试间隔：指数退避，最大 30s
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    },
    mutations: {
      // mutation 失败不重试（避免重复提交）
      retry: false,
    },
  },
})
