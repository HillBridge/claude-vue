<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { logger } from '@utils/logger'

interface Props {
  fallback?: string
}

defineProps<Props>()

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')

onErrorCaptured((error: Error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message
  errorStack.value = error.stack ?? ''
  logger.error('ErrorBoundary caught error', { error: error.message, info, component: instance?.$options.name })

  // 上报到监控系统
  reportError(error, { info })

  return false // 阻止错误继续传播
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}

function reportError(error: Error, context: Record<string, unknown>) {
  // 接入 Sentry / 自研监控
  if (import.meta.env.PROD) {
    // Sentry.captureException(error, { extra: context })
    logger.error('[Production Error]', { message: error.message, ...context })
  }
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__content">
      <div class="i-lucide-alert-triangle text-4xl text-[var(--error-color)] mb-4" />
      <h2 class="text-xl font-semibold mb-2">页面出现了错误</h2>
      <p class="text-secondary mb-4">{{ fallback ?? errorMessage }}</p>
      <details v-if="!$env?.PROD" class="error-details">
        <summary>错误详情（开发模式）</summary>
        <pre>{{ errorStack }}</pre>
      </details>
      <button class="retry-btn" @click="retry">重新加载</button>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.error-boundary__content {
  text-align: center;
  max-width: 500px;
}

.error-details {
  text-align: left;
  margin: 1rem 0;
  padding: 1rem;
  background: var(--color-bg-layout);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);

  pre {
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow: auto;
    color: var(--error-color);
  }
}

.retry-btn {
  padding: 8px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-base);

  &:hover {
    background: var(--primary-hover);
  }
}
</style>
