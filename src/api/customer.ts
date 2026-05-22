import { get } from '@/utils/request'

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
  projectType?: string
  industry?: string
  category?: string
  provinceCode?: string
  cityCode?: string
}

export function getCustomerList(params?: CustomerListParams): Promise<CustomerListResponse> {
  return get<CustomerListResponse>('/customers', params as Record<string, unknown>)
}

/** 查询客户详情 */
export function getCustomerDetail(id: number): Promise<CustomerItem> {
  return get<CustomerItem>(`/customers/${id}`)
}
