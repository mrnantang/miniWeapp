import { post, get } from '@/utils/request'

export interface LoginRequest {
  account: string
  password: string
}

export interface AuthUser {
  id: number
  account: string
  name: string
  companyId: number
  departmentId: number
  positionId: number
  status: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
  permissions: string[]
  dataPermissions: Record<string, unknown>[]
  dataScopes: Record<string, unknown>[]
  dataScopeTree: Record<string, unknown>[]
}

export function login(account: string, password: string): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', { account, password })
}

export function getMe(): Promise<AuthResponse> {
  return get<AuthResponse>('/auth/me')
}
