import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const pinia = createPinia()

pinia.use(
  createPersistedState({
    storage: localStorage,
  }),
)

export { useAppStore } from './modules/app'
export { initAuthStore, useAuthStore } from './modules/auth'
export { useTabsStore } from './modules/tabs'
