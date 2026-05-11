import type { App } from 'vue'
import { vPermission, vRole } from './permission'
import { vLoading } from './loading'

export function setupDirectives(app: App) {
  app.directive('permission', vPermission)
  app.directive('role', vRole)
  app.directive('loading', vLoading)
}
