<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="abs-center min-h-screen flex-col gap-4">
    <div class="i-lucide-file-x text-8xl text-[var(--color-text-tertiary)]" />
    <h1 class="text-4xl font-bold">404</h1>
    <p class="text-secondary">抱歉，您访问的页面不存在</p>
    <button class="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md" @click="router.push('/')">
      返回首页
    </button>
  </div>
</template>
