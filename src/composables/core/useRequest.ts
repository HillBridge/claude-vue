import { ref, shallowRef } from 'vue'

type AsyncFn<T, Args extends unknown[]> = (...args: Args) => Promise<T>

interface UseRequestOptions<T> {
  immediate?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

export function useRequest<T, Args extends unknown[] = []>(
  fn: AsyncFn<T, Args>,
  options: UseRequestOptions<T> = {},
) {
  const { immediate = false, initialData, onSuccess, onError, onFinally } = options

  const loading = ref(false)
  const data = shallowRef<T | undefined>(initialData)
  const error = ref<Error | null>(null)

  async function execute(...args: Args): Promise<T | undefined> {
    loading.value = true
    error.value = null

    try {
      const result = await fn(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError?.(err)
    } finally {
      loading.value = false
      onFinally?.()
    }
  }

  if (immediate) {
    execute(...([] as unknown as Args))
  }

  return { loading, data, error, execute }
}
