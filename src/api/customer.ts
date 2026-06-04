import { get, post } from '@/utils/request'

export interface CustomerItem {
  id: number
  name: string
  phone: string
  contactName: string
  contactPosition: string
  level: string
  levelLabel: string
  industry: string
  industryLabel: string
  category: string
  categoryLabel: string
  projectType: string
  followStatus: string
  followStatusLabel: string
  latestFollowRecord: string
  lastFollowedAt: string
  ownerUserId: number
  ownerUserName: string
  ownedUserNames: string[]
  cityName: string
  provinceName: string
  districtName: string
  address: string
  channelName: string
  companyName: string
}

export interface CustomerListResponse {
  items: CustomerItem[]
  page: number
  pageSize: number
  total: number
}

export interface CustomerListParams {
  tab?: string
  companyId?: number
  page?: number
  pageSize?: number
  customerName?: string
  level?: string
  followStatuses?: string[]
  projectType?: string
  industry?: string
  category?: string
  provinceCode?: string
  cityCode?: string
}

export function getCustomerList(params?: CustomerListParams): Promise<CustomerListResponse> {
  return get<CustomerListResponse>('/customers/query-page', params as Record<string, unknown>)
}

/** 查询客户详情 */
export function getCustomerDetail(id: number): Promise<CustomerItem> {
  return get<CustomerItem>(`/customers/${id}`)
}

/** 客户查重 */
export interface DuplicateCheckParams {
  customerName?: string
  phone?: string
  page?: number
  pageSize?: number
}

export interface DuplicateCheckResponse {
  items: CustomerItem[]
  page: number
  pageSize: number
  total: number
}

export function duplicateCheck(params: DuplicateCheckParams): Promise<DuplicateCheckResponse> {
  return get<DuplicateCheckResponse>('/customers/duplicate-check', params as Record<string, unknown>)
}

/** 新增客户 */
export function createCustomer(data: Record<string, unknown>): Promise<{ id: number }> {
  return post<{ id: number }>('/customers', data)
}

/** 商机列表项 */
export interface CustomerOpportunityItem {
  id: number
  customerId: number
  leadId: number
  requiredProduct: string
  requiredProductLabel: string
  expectedDealPeriod: string
  expectedDealPeriodLabel: string
  expectedSalesAmountBand: string
  expectedSalesAmountBandLabel: string
  status: 'contacting' | 'won' | 'conversion_failed'
  statusLabel: string
  lastFollowedAt: string
  latestFollowRecord: string
  createdAt: string
  updatedAt: string
}

/** 查询客户下的商机列表 */
export function getCustomerOpportunities(customerId: number): Promise<CustomerOpportunityItem[]> {
  return get<CustomerOpportunityItem[]>(`/customers/${customerId}/opportunities`)
}
