<script setup lang="ts">
defineOptions({ name: 'DashboardPage' })
</script>

<template>
  <div class="page-container">
    <h1 class="text-2xl font-semibold mb-6">控制台</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in statCards" :key="card.title" class="card">
        <div class="flex-between">
          <div>
            <p class="text-secondary text-sm">{{ card.title }}</p>
            <p class="text-2xl font-bold mt-1">{{ card.value }}</p>
          </div>
          <div :class="[card.icon, 'text-3xl', `text-[${card.color}]`]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const statCards = [
  { title: '总用户数', value: '12,450', icon: 'i-lucide-users', color: 'var(--primary-color)' },
  { title: '今日访问', value: '3,218', icon: 'i-lucide-eye', color: 'var(--success-color)' },
  { title: '待处理', value: '42', icon: 'i-lucide-clock', color: 'var(--warning-color)' },
  { title: '异常告警', value: '3', icon: 'i-lucide-alert-circle', color: 'var(--error-color)' },
]

export default { setup() { return { statCards } } }
</script>
