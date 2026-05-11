import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import type { AppSettings } from '@types/store'

type Theme = 'light' | 'dark' | 'system'
type Language = 'zh' | 'en'

export const useAppStore = defineStore(
  'app',
  () => {
    const theme = ref<Theme>('system')
    const language = ref<Language>('zh')
    const sidebarCollapsed = ref(false)
    const globalLoading = ref(false)
    const settings = ref<AppSettings>({
      primaryColor: '#1677ff',
      borderRadius: 6,
      compactMode: false,
      animationsEnabled: true,
    })

    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

    const isDark = computed(() => {
      if (theme.value === 'system') return prefersDark.value
      return theme.value === 'dark'
    })

    const device = computed(() => {
      const width = window.innerWidth
      if (width < 768) return 'mobile'
      if (width < 1200) return 'tablet'
      return 'desktop'
    })

    function setTheme(newTheme: Theme) {
      theme.value = newTheme
      applyTheme()
    }

    function applyTheme() {
      const root = document.documentElement
      if (isDark.value) {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      } else {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      }
    }

    function setLanguage(lang: Language) {
      language.value = lang
      document.documentElement.lang = lang
    }

    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    function setGlobalLoading(val: boolean) {
      globalLoading.value = val
    }

    function updateSettings(partial: Partial<AppSettings>) {
      settings.value = { ...settings.value, ...partial }
      applyCssVariables()
    }

    function applyCssVariables() {
      const root = document.documentElement
      root.style.setProperty('--primary-color', settings.value.primaryColor)
      root.style.setProperty('--border-radius', `${settings.value.borderRadius}px`)
    }

    return {
      theme,
      language,
      sidebarCollapsed,
      globalLoading,
      settings,
      isDark,
      device,
      setTheme,
      applyTheme,
      setLanguage,
      toggleSidebar,
      setGlobalLoading,
      updateSettings,
      applyCssVariables,
    }
  },
  {
    persist: {
      paths: ['theme', 'language', 'sidebarCollapsed', 'settings'],
    },
  },
)
