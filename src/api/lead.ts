import { get } from '@/utils/request'

export interface LeadItem {
  id: number
  leadNo: string
  customerName: string
  contactName: string
  phone: string
  customerIndustry: string
  leadLevel: string
  followerUserId: number
  followerUserName: string
  ownerUserId: number
  ownerUserName: string
  cityName: string
  provinceName: string
  districtName: string
  channelName: string
  obtainedAt: string
  lastFollowedAt: string
  nextFollowAt: string
  followStatus: string
  followStatusLabel: string
  companyName: string
}

export interface LeadListResponse {
  items: LeadItem[]
  page: number
  pageSize: number
  total: number
}

export interface LeadListParams {
  tab?: string
  companyId?: number
  page?: number
  pageSize?: number
  customerName?: string
  customerIndustry?: string
  leadLevel?: string
  phone?: string
  sourceDepartmentId?: number
  provinceCode?: string
  cityCode?: string
}

export function getLeadList(params?: LeadListParams): Promise<LeadListResponse> {
  return get<LeadListResponse>('/leads', params as Record<string, unknown>)
}
