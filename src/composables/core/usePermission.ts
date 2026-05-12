import { useAuthStore } from '@stores/index'

export function usePermission() {
  const authStore = useAuthStore()

  function can(permission: string | string[], requireAll = false): boolean {
    const perms = Array.isArray(permission) ? permission : [permission]
    return requireAll ? authStore.hasAllPermissions(perms) : authStore.hasAnyPermission(perms)
  }

  function hasRole(role: string | string[]): boolean {
    const roles = Array.isArray(role) ? role : [role]
    return roles.some((r) => authStore.hasRole(r))
  }

  function isAdmin(): boolean {
    return authStore.hasRole('admin') || authStore.hasRole('super-admin')
  }

  return { can, hasRole, isAdmin }
}
