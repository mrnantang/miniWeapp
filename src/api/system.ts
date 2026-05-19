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

export function getCompanyDepartmentTree(permissionCode: string, companyId?: number): Promise<CompanyDepartmentTreeResponse> {
  const params: Record<string, unknown> = { permissionCode }
  if (companyId) params.companyId = companyId
  return get<CompanyDepartmentTreeResponse>('/system/companies/departments/tree', params)
}
