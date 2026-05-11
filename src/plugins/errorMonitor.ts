import type { App } from 'vue'
import { logger } from '@utils/logger'

interface ErrorMonitorOptions {
  dsn?: string
  enabled?: boolean
}

export function setupErrorMonitor(app: App, options: ErrorMonitorOptions = {}) {
  const { enabled = import.meta.env.PROD } = options

  if (!enabled) return

  // Vue 全局错误处理
  app.config.errorHandler = (error, instance, info) => {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Vue global error', {
      message: err.message,
      stack: err.stack,
      info,
      component: instance?.$options.name,
    })
    reportToMonitor(err, { type: 'vue', info })
  }

  // Vue 全局警告处理（仅开发环境）
  if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, instance, trace) => {
      logger.warn('Vue warning', { msg, trace })
    }
  }

  // 未捕获的 Promise 异常
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    logger.error('Unhandled promise rejection', { message: error.message })
    reportToMonitor(error, { type: 'unhandledrejection' })
  })

  // JS 运行时错误
  window.addEventListener('error', (event) => {
    if (event.error) {
      logger.error('Window error', { message: event.message, filename: event.filename })
      reportToMonitor(event.error, { type: 'runtime' })
    }
  })

  // 资源加载错误
  window.addEventListener('error', (event) => {
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement
      logger.warn('Resource load error', {
        tag: target.tagName,
        src: (target as HTMLImageElement).src || (target as HTMLScriptElement).src,
      })
    }
  }, true)
}

function reportToMonitor(error: Error, context: Record<string, unknown>) {
  // Sentry.captureException(error, { extra: context })
  // 或者自研上报接口
  void error
  void context
}
