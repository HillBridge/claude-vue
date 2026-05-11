<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@stores/index'

const appStore = useAppStore()
</script>

<template>
  <div class="layout" :class="{ 'layout--collapsed': appStore.sidebarCollapsed }">
    <!-- 侧边栏 -->
    <aside class="layout__sidebar">
      <div class="sidebar-logo">
        <span class="i-lucide-zap text-xl text-[var(--primary-color)]" />
        <span v-if="!appStore.sidebarCollapsed" class="font-semibold ml-2">
          {{ $env?.VITE_APP_TITLE ?? 'Admin' }}
        </span>
      </div>
      <nav class="sidebar-nav">
        <slot name="menu" />
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="layout__main">
      <!-- 顶部导航 -->
      <header class="layout__header">
        <button
          class="btn-icon"
          :title="appStore.sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
          @click="appStore.toggleSidebar"
        >
          <span :class="appStore.sidebarCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'" />
        </button>

        <div class="flex-1" />

        <button
          class="btn-icon"
          :title="appStore.isDark ? '切换亮色' : '切换暗色'"
          @click="appStore.setTheme(appStore.isDark ? 'light' : 'dark')"
        >
          <span :class="appStore.isDark ? 'i-lucide-sun' : 'i-lucide-moon'" />
        </button>
      </header>

      <!-- 内容 -->
      <main class="layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout__sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-container);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base);
  overflow: hidden;
  flex-shrink: 0;
}

.layout--collapsed .layout__sidebar {
  width: var(--sidebar-collapsed-width);
}

.sidebar-logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-md);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout__header {
  height: var(--header-height);
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
  flex-shrink: 0;
}

.layout__content {
  flex: 1;
  overflow: auto;
  background: var(--color-bg-layout);
}

.btn-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 18px;
  transition: background var(--transition-fast), color var(--transition-fast);

  &:hover {
    background: var(--color-bg-layout);
    color: var(--color-text-primary);
  }
}
</style>
