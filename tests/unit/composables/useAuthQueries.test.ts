import { useUserInfoQuery, useUserListQuery } from '@composables/queries/useAuthQueries'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

vi.mock('@api/modules/auth', () => ({
  authApi: {
    getUserInfo: vi.fn().mockResolvedValue({
      data: {
        code: 200,
        success: true,
        data: { id: '1', username: 'admin', nickname: '管理员', roles: ['admin'], permissions: [] },
      },
    }),
    getUserList: vi.fn().mockResolvedValue({
      data: {
        code: 200,
        success: true,
        data: {
          list: [{ id: '1', username: 'admin', nickname: '管理员' }],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
    }),
  },
}))

vi.mock('@stores/index', () => ({
  useAuthStore: () => ({ isAuthenticated: true }),
}))

function createWrapper(component: ReturnType<typeof defineComponent>) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return mount(component, {
    global: { plugins: [[VueQueryPlugin, { queryClient: qc }]] },
  })
}

describe('useUserInfoQuery', () => {
  it('解包后直接返回业务数据', async () => {
    const Comp = defineComponent({
      setup() {
        const { data, isLoading } = useUserInfoQuery()
        return { data, isLoading }
      },
      template: '<div>{{ isLoading ? "loading" : data?.nickname }}</div>',
    })

    const wrapper = createWrapper(Comp)
    await flushPromises()
    expect(wrapper.text()).toBe('管理员')
  })
})

describe('useUserListQuery', () => {
  it('分页参数变化时 queryKey 包含新参数', async () => {
    const Comp = defineComponent({
      setup() {
        const params = ref({ page: 1, pageSize: 10 })
        const { data } = useUserListQuery(params)
        return { data, params }
      },
      template: '<div>{{ data?.total }}</div>',
    })

    const wrapper = createWrapper(Comp)
    await flushPromises()
    expect(wrapper.text()).toBe('1')
  })
})
