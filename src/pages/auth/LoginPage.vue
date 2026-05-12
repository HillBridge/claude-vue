<script setup lang="ts">
import { useForm } from '@composables/core/useForm'
import { useAuthStore } from '@stores/index'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const { form, errors, submitting, validate } = useForm(
  { username: '', password: '' },
  {
    username: [{ required: true, message: '请输入用户名' }],
    password: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码至少6位' },
    ],
  },
)

const redirectPath = computed(() => (route.query.redirect as string) || '/')

async function handleLogin() {
  if (!validate()) return

  submitting.value = true
  try {
    await authStore.login(form.username as string, form.password as string)
    router.push(redirectPath.value)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page abs-center min-h-screen bg-[var(--color-bg-layout)]">
    <div class="login-card card w-96 p-8">
      <h1 class="text-2xl font-bold text-center mb-8">
        {{ $env?.VITE_APP_TITLE ?? '系统登录' }}
      </h1>

      <form @submit.prevent="handleLogin">
        <div class="form-item mb-4">
          <label class="form-label">用户名</label>
          <input
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            class="form-input"
            autocomplete="username"
          />
          <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
        </div>

        <div class="form-item mb-6">
          <label class="form-label">密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
            autocomplete="current-password"
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <button type="submit" :disabled="submitting" class="submit-btn w-full">
          {{ submitting ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
  outline: none;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  }
}

.form-error {
  font-size: var(--font-size-xs);
  color: var(--error-color);
  margin-top: 4px;
  display: block;
}

.submit-btn {
  padding: 10px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background var(--transition-fast);

  &:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
