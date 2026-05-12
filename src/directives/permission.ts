import { useAuthStore } from '@stores/index'
import type { Directive, DirectiveBinding } from 'vue'

// v-permission="'user:create'"
// v-permission="['user:create', 'user:update']"
// v-permission.all="['user:create', 'user:update']"  // 需要所有权限
export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const authStore = useAuthStore()
    const { value, modifiers } = binding

    if (!value) return

    const permissions = Array.isArray(value) ? value : [value]
    const requireAll = modifiers.all ?? false

    const hasAccess = requireAll
      ? authStore.hasAllPermissions(permissions)
      : authStore.hasAnyPermission(permissions)

    if (!hasAccess) {
      el.parentNode?.removeChild(el)
    }
  },
}

// v-role="'admin'"
// v-role="['admin', 'super-admin']"
export const vRole: Directive<HTMLElement, string | string[]> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const authStore = useAuthStore()
    const { value } = binding

    if (!value) return

    const roles = Array.isArray(value) ? value : [value]
    const hasRole = roles.some((r) => authStore.hasRole(r))

    if (!hasRole) {
      el.parentNode?.removeChild(el)
    }
  },
}
