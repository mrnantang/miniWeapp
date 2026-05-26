import { get, post } from '@/utils/request'

/** 跟进记录 */
export interface FollowRecordItem {
  id: number
  content: string
  followType: 'phone' | 'wechat' | 'visit' | 'email' | 'other'
  result: string
  followedAt: string
  followerUserId: number
  followerUserName: string
  customerId: number
  opportunityId: number
  createdAt: string
  updatedAt: string
}

/** 拜访图片 */
export interface VisitPhotoItem {
  id: number
  fileName: string
  fileSize: number
  fileUrl: string
  mimeType: string
  phase: 'check_in' | 'check_out'
  sortOrder: number
}

/** 拜访记录 */
export interface VisitRecordItem {
  id: number
  status: 'checked_in' | 'checked_out' | 'cancelled'
  checkInAt: string
  checkInAddress: string
  checkInLatitude: number
  checkInLongitude: number
  checkInPurpose: string
  checkInRemark: string
  checkOutAt: string
  checkOutSummary: string
  operatorUserId: number
  operatorUserName: string
  customerId: number
  opportunityId: number
  followRecordId: number
  photos: VisitPhotoItem[]
  createdAt: string
  updatedAt: string
}

/** 新增跟进记录请求体 */
export interface CreateFollowRecordRequest {
  content?: string
  followType?: 'phone' | 'wechat' | 'visit' | 'email' | 'other'
  result?: 'conversion_failed'
}

/** 查询商机跟进记录 */
export function getOpportunityFollowRecords(opportunityId: number): Promise<FollowRecordItem[]> {
  return get<FollowRecordItem[]>(`/opportunities/${opportunityId}/follow-records`)
}

/** 查询商机拜访动态 */
export function getOpportunityVisitRecords(opportunityId: number): Promise<VisitRecordItem[]> {
  return get<VisitRecordItem[]>(`/opportunities/${opportunityId}/visit-records`)
}

/** 新增商机跟进记录 */
export function createOpportunityFollowRecord(opportunityId: number, data: CreateFollowRecordRequest): Promise<FollowRecordItem> {
  return post<FollowRecordItem>(`/opportunities/${opportunityId}/follow-records`, data as Record<string, unknown>)
}

/** 商机分页列表项 */
export interface OpportunityPageItem {
  id: number
  opportunityName: string
  opportunityNo: string
  followStatus: string
  followStatusLabel: string
  requiredProduct: string
  requiredProductLabel: string
  expectedSalesAmountBand: string
  expectedSalesAmountBandLabel: string
  expectedDealDate: string
  latestFollowRecord: string
  lastFollowedAt: string
  createdAt: string
}

/** 商机分页列表响应 */
export interface OpportunityPageResponse {
  items: OpportunityPageItem[]
  page: number
  pageSize: number
  total: number
}

/** 查询商机分页列表 */
export function queryOpportunityPage(params?: {
  page?: number
  pageSize?: number
  followStatus?: string
  keyword?: string
}): Promise<OpportunityPageResponse> {
  return get<OpportunityPageResponse>('/opportunities/query-page', params as Record<string, unknown>)
}
