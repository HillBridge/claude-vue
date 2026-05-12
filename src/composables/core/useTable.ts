import type { ApiResponse, PageParams, PageResult } from '@types/api'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

type FetchFn<T> = (params: PageParams) => Promise<{ data: ApiResponse<PageResult<T>> }>

interface UseTableOptions<T> {
  fetchFn: FetchFn<T>
  defaultPageSize?: number
  defaultParams?: Record<string, unknown>
  immediate?: boolean
}

export function useTable<T = unknown>(options: UseTableOptions<T>) {
  const { fetchFn, defaultPageSize = 20, defaultParams = {}, immediate = true } = options

  const loading = ref(false)
  const list = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(defaultPageSize)
  const searchParams = ref<Record<string, unknown>>({ ...defaultParams })

  const pagination = computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    total: total.value,
    totalPages: Math.ceil(total.value / pageSize.value),
  }))

  async function fetch() {
    loading.value = true
    try {
      const res = await fetchFn({
        page: page.value,
        pageSize: pageSize.value,
        ...searchParams.value,
      })
      list.value = res.data.data.list
      total.value = res.data.data.total
    } finally {
      loading.value = false
    }
  }

  function search(params: Record<string, unknown> = {}) {
    page.value = 1
    searchParams.value = { ...defaultParams, ...params }
    return fetch()
  }

  function reset() {
    page.value = 1
    pageSize.value = defaultPageSize
    searchParams.value = { ...defaultParams }
    return fetch()
  }

  function handlePageChange(newPage: number) {
    page.value = newPage
    return fetch()
  }

  function handlePageSizeChange(newSize: number) {
    page.value = 1
    pageSize.value = newSize
    return fetch()
  }

  watch([page, pageSize], () => fetch(), { immediate })

  return {
    loading,
    list,
    total,
    page,
    pageSize,
    pagination,
    searchParams,
    fetch,
    search,
    reset,
    handlePageChange,
    handlePageSizeChange,
  }
}
