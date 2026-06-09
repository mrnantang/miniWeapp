import { getPermissions } from './storage'

const rolePathMap: Record<string, string> = {
  dev: 'subpackages/dev/home/index',
  sales: 'subpackages/dev/home/index',
  ops: 'subpackages/ops/home/index',
  boss: 'subpackages/boss/mine/index',
  system: 'subpackages/dev/home/index',
}

/** 根据权限列表推测用户角色 */
export function detectRole(permissions?: string[]): string {
  const list = permissions || getPermissions()
  const joined = list.join(' ').toLowerCase()
  if (joined.includes('system')) return 'system'
  if (joined.includes('boss')) return 'boss'
  if (joined.includes('ops') || joined.includes('operation')) return 'ops'
  if (joined.includes('sales')) return 'sales'
  return 'dev'
}

/** 根据角色获取首页路径 */
export function getRoleHomePath(role?: string): string {
  return rolePathMap[role || detectRole()] || rolePathMap.dev
}
