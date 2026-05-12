import { VueQueryPlugin } from '@tanstack/vue-query'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/global.css'
import './assets/styles/variables/tokens.css'
import { setupDirectives } from './directives'
import { setupErrorMonitor } from './plugins/errorMonitor'
import { queryClient } from './plugins/queryClient'
import { router } from './router'
import { initAuthStore, pinia, useAppStore, useAuthStore } from './stores'

async function bootstrap() {
  const app = createApp(App)

  // 注册 Pinia（必须在使用 store 之前）
  app.use(pinia)

  // 注册 Vue Query（传入预配置的 queryClient）
  app.use(VueQueryPlugin, { queryClient })

  // 初始化 auth store 实例供非组件上下文使用
  const authStore = useAuthStore()
  initAuthStore(authStore)

  // 初始化 app store 并应用持久化的主题/语言
  const appStore = useAppStore()
  appStore.applyTheme()
  appStore.applyCssVariables()
  document.documentElement.lang = appStore.language

  // 路由
  app.use(router)

  // 自定义指令
  setupDirectives(app)

  // 错误监控（生产环境）
  setupErrorMonitor(app)

  // 挂载
  app.mount('#app')
}

bootstrap().catch(console.error)
