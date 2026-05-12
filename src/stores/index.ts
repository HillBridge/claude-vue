import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const pinia = createPinia()

pinia.use(
  createPersistedState({
    storage: localStorage,
    beforeRestore: (ctx) => {
      console.log(`Restoring store: ${ctx.store.$id}`)
    },
    afterRestore: (ctx) => {
      console.log(`Store restored: ${ctx.store.$id}`)
    },
  }),
)

export { useAppStore } from './modules/app'
export { initAuthStore, useAuthStore } from './modules/auth'
export { useTabsStore } from './modules/tabs'
