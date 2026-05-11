import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TabItem {
  path: string
  name: string
  title: string
  icon?: string
  affix?: boolean
  keepAlive?: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([])
  const activeTab = ref<string>('')

  function addTab(route: RouteLocationNormalizedLoaded) {
    const { path, name, meta } = route
    if (!meta.title || meta.hidden) return

    const exists = tabs.value.find((t) => t.path === path)
    if (!exists) {
      tabs.value.push({
        path,
        name: String(name ?? path),
        title: meta.title as string,
        icon: meta.icon as string | undefined,
        affix: meta.affix as boolean | undefined,
        keepAlive: meta.keepAlive as boolean | undefined,
      })
    }
    activeTab.value = path
  }

  function removeTab(path: string) {
    const idx = tabs.value.findIndex((t) => t.path === path)
    if (idx === -1) return

    tabs.value.splice(idx, 1)

    if (activeTab.value === path && tabs.value.length > 0) {
      activeTab.value = tabs.value[Math.min(idx, tabs.value.length - 1)].path
    }
  }

  function removeOtherTabs(path: string) {
    tabs.value = tabs.value.filter((t) => t.affix || t.path === path)
    activeTab.value = path
  }

  function removeAllTabs() {
    tabs.value = tabs.value.filter((t) => t.affix)
    activeTab.value = tabs.value[0]?.path ?? ''
  }

  function initAffixTabs(routes: { path: string; name: string; meta: { title?: string; affix?: boolean; icon?: string } }[]) {
    routes
      .filter((r) => r.meta.affix && r.meta.title)
      .forEach((r) => {
        if (!tabs.value.find((t) => t.path === r.path)) {
          tabs.value.unshift({
            path: r.path,
            name: r.name,
            title: r.meta.title!,
            icon: r.meta.icon,
            affix: true,
          })
        }
      })
  }

  return { tabs, activeTab, addTab, removeTab, removeOtherTabs, removeAllTabs, initAffixTabs }
})
