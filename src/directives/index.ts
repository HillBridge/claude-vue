import type { App } from 'vue'
import { vLoading } from './loading'
import { vPermission, vRole } from './permission'

export function setupDirectives(app: App) {
  app.directive('permission', vPermission)
  app.directive('role', vRole)
  app.directive('loading', vLoading)
}
