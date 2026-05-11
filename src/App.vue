<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useTabsStore } from '@stores/index'
import ErrorBoundary from '@components/base/ErrorBoundary.vue'

const tabsStore = useTabsStore()
const keepAliveRoutes = computed(() =>
  tabsStore.tabs.filter((t) => t.keepAlive).map((t) => t.name),
)
</script>

<template>
  <ErrorBoundary>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <KeepAlive :include="keepAliveRoutes">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </ErrorBoundary>
</template>
