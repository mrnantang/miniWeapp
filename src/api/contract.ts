import { get, post, put, publicGet } from '@/utils/request'

/** 合同列表项 */
export interface ContractListItem {
  id: number
  contractName: string
  contractNo: string
  amount: number
  displayStatus: string
  status: string
  signedAt: string
  createdAt: string
  customerId: number
  customerName: string
}

/** 合同列表响应 */
export interface ContractListResponse {
  items: ContractListItem[]
  page: number
  pageSize: number
  total: number
}

/** 合同展示状态映射（displayStatus） */
export const CONTRACT_STATUS_MAP: Record<string, string> = {
  pending_approval: '待审批',
  approval_rejected: '审批驳回',
  approval_passed: '全部审批通过',
  forwarded_customer: '已转发客户',
  customer_read: '客户已读',
  signed_back: '已回签',
}

/** 合同状态 badge 颜色（displayStatus） */
export const CONTRACT_STATUS_BADGE_MAP: Record<string, string> = {
  pending_approval: 'yellow',
  approval_rejected: 'red',
  approval_passed: 'green',
  forwarded_customer: 'blue',
  customer_read: 'blue',
  signed_back: 'green',
}

/** 查询合同列表 */
export function getContractList(params?: Record<string, unknown>): Promise<ContractListResponse> {
  return get<ContractListResponse>('/sales/contracts', params)
}

/** 合同模板列表项 */
export interface ContractTemplateItem {
  id: number
  name: string
  templateNo: string
  status: string
  currentVersion: number
  companyId: number
  departmentId: number
  updatedAt: string
}

/** 合同模板动态字段 */
export interface ContractTokenField {
  category: string
  key: string
  label: string
  defaultValue: string
}

/** 合同模板详情 */
export interface ContractTemplateDetail {
  id: number
  name: string
  templateNo: string
  status: string
  currentVersion: number
  companyId: number
  departmentId: number
  contentHtml: string
  tokenSchema: ContractTokenField[]
  renderSchema: Record<string, string>
  assets: Array<{ assetType: string; fileName: string; fileSize: number; fileUrl: string; mimeType: string }>
  updatedAt: string
}

/** 查询合同模板列表 */
export function getContractTemplates(params?: Record<string, unknown>): Promise<{ items: ContractTemplateItem[]; page: number; pageSize: number; total: number }> {
  return get('/sales/contract-templates', params)
}

/** 查询合同模板详情 */
export function getContractTemplateDetail(id: number): Promise<ContractTemplateDetail> {
  return get<ContractTemplateDetail>(`/sales/contract-templates/${id}`)
}

/** 新增合同 */
export function createContract(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return post('/sales/contracts', data)
}

/** 编辑合同 */
export function updateContract(id: number, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return put(`/sales/contracts/${id}`, data)
}

/** 查询合同详情 */
export function getContractDetail(id: number): Promise<Record<string, unknown>> {
  return get<Record<string, unknown>>(`/sales/contracts/${id}`)
}

/** 合同分享预览（公开接口，无需登录） */
export function getContractSharePreview(token: string): Promise<Record<string, unknown>> {
  return publicGet(`/sales/contracts/share/${token}/preview`)
}

/** 分享合同给客户 */
export function shareContract(id: number): Promise<Record<string, unknown>> {
  return post(`/sales/contracts/${id}/share`)
}

/** 取消合同 */
export function cancelContract(id: number): Promise<Record<string, unknown>> {
  return post(`/sales/contracts/${id}/cancel`)
}
