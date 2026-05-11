<script setup lang="ts">
const reload = () => window.location.reload()
</script>

<template>
  <div class="abs-center min-h-screen flex-col gap-4">
    <div class="i-lucide-server-crash text-8xl text-[var(--error-color)]" />
    <h1 class="text-4xl font-bold">500</h1>
    <p class="text-secondary">服务器开小差了，请稍后再试</p>
    <button class="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md" @click="reload">
      刷新页面
    </button>
  </div>
</template>
