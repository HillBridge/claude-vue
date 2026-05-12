<script setup lang="ts">
import { authKeys } from '@api/queryKeys'
import {
  useUpdatePasswordMutation,
  useUserInfoQuery,
  useUserListQuery,
} from '@composables/queries/useAuthQueries'
import { useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'

defineOptions({ name: 'UserListPage' })

// ── 用户信息（全局缓存，多组件共享同一份数据）──────────────────────────────
const { data: userInfo, isLoading: userInfoLoading } = useUserInfoQuery()

// ── 分页列表（params 响应式，切页自动重请求，翻页不闪烁）────────────────────
const params = ref({ page: 1, pageSize: 10 })
const {
  data: userListPage,
  isLoading: listLoading,
  isFetching, // 后台刷新时为 true（数据已有，静默更新）
  isPlaceholderData, // keepPreviousData 生效时为 true
} = useUserListQuery(params)

function goToPage(page: number) {
  params.value = { ...params.value, page }
}

// ── 修改密码（mutation）────────────────────────────────────────────────────
const {
  mutate: updatePassword,
  isPending: passwordPending,
  isSuccess: passwordSuccess,
  error: passwordError,
} = useUpdatePasswordMutation()

// ── 手动使某个 key 失效（强制重新拉取）─────────────────────────────────────
const qc = useQueryClient()
function refreshUserInfo() {
  qc.invalidateQueries({ queryKey: authKeys.userInfo() })
}
</script>

<template>
  <div class="page-container">
    <h1 class="text-2xl font-semibold mb-6">用户管理（Vue Query 示例）</h1>

    <!-- 当前用户信息 -->
    <section class="card mb-6">
      <h2 class="text-base font-medium mb-3 flex-between">
        当前用户
        <button
          class="text-sm text-[var(--primary-color)] hover:underline"
          @click="refreshUserInfo"
        >
          手动刷新
        </button>
      </h2>
      <div v-if="userInfoLoading" class="text-secondary">加载中…</div>
      <div v-else-if="userInfo" class="flex gap-4 text-sm">
        <span>
          昵称：
          <strong>{{ userInfo.nickname }}</strong>
        </span>
        <span>用户名：{{ userInfo.username }}</span>
        <span>角色：{{ userInfo.roles.join(', ') }}</span>
      </div>
    </section>

    <!-- 用户列表 -->
    <section class="card mb-6">
      <h2 class="text-base font-medium mb-3 flex-between">
        用户列表
        <!-- isFetching：后台静默刷新时显示，不遮挡数据 -->
        <span v-if="isFetching && !listLoading" class="text-xs text-secondary animate-pulse">
          刷新中…
        </span>
      </h2>

      <div v-if="listLoading" class="text-secondary py-8 text-center">加载中…</div>

      <template v-else-if="userListPage">
        <!-- isPlaceholderData：翻页缓冲期，降低不透明度提示用户 -->
        <table class="w-full text-sm" :class="{ 'opacity-60': isPlaceholderData }">
          <thead>
            <tr class="border-b border-[var(--color-border)]">
              <th class="text-left py-2 font-medium">ID</th>
              <th class="text-left py-2 font-medium">用户名</th>
              <th class="text-left py-2 font-medium">昵称</th>
              <th class="text-left py-2 font-medium">邮箱</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in userListPage.list"
              :key="user.id"
              class="border-b border-[var(--color-split)] hover:bg-[var(--color-bg-layout)]"
            >
              <td class="py-2">{{ user.id }}</td>
              <td class="py-2">{{ user.username }}</td>
              <td class="py-2">{{ user.nickname }}</td>
              <td class="py-2">{{ user.email }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 分页 -->
        <div class="flex-between mt-4 text-sm text-secondary">
          <span>共 {{ userListPage.total }} 条</span>
          <div class="flex gap-2">
            <button
              :disabled="params.page <= 1"
              class="px-3 py-1 border border-[var(--color-border)] rounded disabled:opacity-40"
              @click="goToPage(params.page - 1)"
            >
              上一页
            </button>
            <span class="px-3 py-1">{{ params.page }} / {{ userListPage.totalPages }}</span>
            <button
              :disabled="params.page >= userListPage.totalPages"
              class="px-3 py-1 border border-[var(--color-border)] rounded disabled:opacity-40"
              @click="goToPage(params.page + 1)"
            >
              下一页
            </button>
          </div>
        </div>
      </template>
    </section>

    <!-- 修改密码（mutation 示例） -->
    <section class="card">
      <h2 class="text-base font-medium mb-3">修改密码</h2>
      <form
        class="flex gap-3 items-end"
        @submit.prevent="updatePassword({ oldPassword: '123456', newPassword: 'newPass123' })"
      >
        <button
          type="submit"
          :disabled="passwordPending"
          class="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md text-sm disabled:opacity-60"
        >
          {{ passwordPending ? '提交中…' : '修改密码（示例）' }}
        </button>
        <span v-if="passwordSuccess" class="text-sm text-[var(--success-color)]">修改成功</span>
        <span v-if="passwordError" class="text-sm text-[var(--error-color)]">
          {{ passwordError.message }}
        </span>
      </form>
    </section>
  </div>
</template>
