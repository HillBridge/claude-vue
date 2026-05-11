import { setupWorker } from 'msw/browser'
import { handlers } from './handlers/index'

export const worker = setupWorker(...handlers)

export async function initMock() {
  if (import.meta.env.VITE_ENABLE_MOCK !== 'true') return

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })

  console.log('[MSW] Mock service worker started')
}
