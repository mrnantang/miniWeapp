import { get } from '@/utils/request'

export interface CompanyDepartmentTreeNode {
  id: number
  name: string
  companyId: number
  parentId: number
  level: number
  sortOrder: number
  status: string
  children: CompanyDepartmentTreeNode[]
  hasChildren: boolean
}

export interface CompanyDepartmentTreeResponse {
  items: CompanyDepartmentTreeNode[]
}

export const getCompanyDepartmentTree = (permissionCode: string, companyId?: number): Promise<CompanyDepartmentTreeResponse> => {
  const params: Record<string, unknown> = { permissionCode }
  if (companyId) params.companyId = companyId
  return get<CompanyDepartmentTreeResponse>('/system/companies/departments/tree', params)
}

/** 获取公司组织架构树（公司→部门） */
export const getCompanyTree = (): Promise<CompanyDepartmentTreeResponse> => {
  return get<CompanyDepartmentTreeResponse>('/system/companies/tree?permissionCode=opportunity.create')
}

// 公司-用户级联选择器节点
export interface UserCascaderNode {
  companyId?: number
  departmentId?: number
  userId?: number
  name: string
  displayName?: string
  nodeType: string // 'company' | 'department' | 'user'
  isLeaf?: boolean
  phone?: string
  children: UserCascaderNode[]
}

export interface UserCascaderResponse {
  items: UserCascaderNode[]
}

// 获取公司-用户级联选择器数据（用于选择负责人/跟进人）
export const getUserCascader = (params?: { permissionCode?: string; companyId?: number }): Promise<UserCascaderResponse> => {
  return get<UserCascaderResponse>('/system/companies/user-cascader', params as Record<string, unknown>)
}
