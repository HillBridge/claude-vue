import { router } from '@router/index'
import { useAuthStoreOutside } from '@stores/modules/auth'
import type { ApiResponse } from '@types/api'
import { logger } from '@utils/logger'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { BusinessError, RequestError } from './errors'

export interface RequestConfig extends AxiosRequestConfig {
  // 是否显示全局 loading
  showLoading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否需要鉴权
  withAuth?: boolean
  // 重试次数
  retryTimes?: number
}

let refreshTokenPromise: Promise<string> | null = null
const pendingRequests = new Map<string, AbortController>()

function getRequestKey(config: InternalAxiosRequestConfig): string {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

function addPendingRequest(config: InternalAxiosRequestConfig) {
  const key = getRequestKey(config)
  if (pendingRequests.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const controller = pendingRequests.get(key)!
    controller.abort()
    pendingRequests.delete(key)
  }
  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(key, controller)
}

function removePendingRequest(config: InternalAxiosRequestConfig) {
  const key = getRequestKey(config)
  pendingRequests.delete(key)
}

export function createRequest(baseConfig: RequestConfig = {}): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + (import.meta.env.VITE_API_PREFIX || '/api'),
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    ...baseConfig,
  })

  axiosRetry(instance, {
    retries: 2,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
      return axiosRetry.isNetworkOrIdempotentRequestError(error) && error.response?.status !== 401
    },
  })

  // 请求拦截
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      addPendingRequest(config)
      const authStore = useAuthStoreOutside()
      if (config.withAuth !== false && authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
      }
      config.headers['X-Request-ID'] = crypto.randomUUID()
      config.headers['X-App-Version'] = __APP_VERSION__
      logger.request(config)
      return config
    },
    (error) => {
      logger.error('Request setup error', error)
      return Promise.reject(error)
    },
  )

  // 响应拦截
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      removePendingRequest(response.config as InternalAxiosRequestConfig)
      const { data } = response

      if (
        data.success === false ||
        (data.code !== undefined && data.code !== 200 && data.code !== 0)
      ) {
        throw new BusinessError(data.message, data.code)
      }

      return response
    },
    async (error) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }

      if (error.config) {
        removePendingRequest(error.config)
      }

      const status = error.response?.status

      if (status === 401) {
        return handleUnauthorized(error, instance)
      }

      if (status === 403) {
        router.push('/403')
        return Promise.reject(new RequestError('无访问权限', 403))
      }

      if (status === 404) {
        return Promise.reject(new RequestError('资源不存在', 404))
      }

      if (status >= 500) {
        logger.error('Server error', { status, url: error.config?.url })
        return Promise.reject(new RequestError('服务器异常，请稍后重试', status))
      }

      return Promise.reject(error)
    },
  )

  return instance
}

async function handleUnauthorized(error: unknown, instance: AxiosInstance) {
  const authStore = useAuthStoreOutside()

  if (!authStore.refreshToken) {
    authStore.logout()
    return Promise.reject(error)
  }

  try {
    if (!refreshTokenPromise) {
      refreshTokenPromise = authStore.refreshAccessToken().finally(() => {
        refreshTokenPromise = null
      })
    }

    const newToken = await refreshTokenPromise
    const originalRequest = (error as { config: InternalAxiosRequestConfig }).config
    originalRequest.headers.Authorization = `Bearer ${newToken}`
    return instance(originalRequest)
  } catch {
    authStore.logout()
    router.push('/login')
    return Promise.reject(error)
  }
}

export const http = createRequest()
