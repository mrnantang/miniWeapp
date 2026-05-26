import { get, post } from '@/utils/request'

// ========== 类型定义 ==========

export interface LeadItem {
  id: number
  leadNo: string
  customerName: string
  companyName: string
  contactName: string
  phone: string
  wechat: string
  whatsapp: string
  email: string
  customerIndustry: string
  customerIndustryLabel: string
  leadLevel: string
  status: string
  statusLabel: string
  channelCode: string
  channelName: string
  ownerUserId: number
  ownerUserName: string
  ownerRole: string
  followerUserId: number
  followerUserName: string
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode: string
  districtName: string
  sourceDepartment: string
  remark: string
  createdAt: string
  updatedAt: string
  assignedAt: string
  lastFollowedAt: string
  lastActionAt: string
  nextFollowAt: string
  recycleDueAt: string
  recycleRemainingTime: string
  enteredPoolAt: string
  poolCode: string
  poolName: string
  previousOwnerName: string
  previousFollowerName: string
  invalidReason: string
  executableActions: string[]
}

export interface LeadListSummary {
  allCount: number
  pendingFollowupCount: number
  soonRecycleCount: number
  operationPoolCount: number
  salesPoolCount: number
  developmentPoolCount: number
  globalPoolCount: number
}

export interface LeadListResponse {
  items: LeadItem[]
  page: number
  pageSize: number
  total: number
  summary: LeadListSummary
}

export interface LeadListParams {
  tab?: string
  page?: number
  pageSize?: number
  customerName?: string
  customerIndustries?: string[]
  leadLevels?: string[]
  phone?: string
  statuses?: string[]
  channelCodes?: string[]
  regionPaths?: string[]
  companyDepartmentPaths?: string[]
  sourceDepartmentIds?: number[]
  ownerUserName?: string
  followerUserName?: string
  assignedAtStart?: string
  assignedAtEnd?: string
}

export interface CreateLeadRequest {
  channelCode?: string
  cityCode?: string
  contactName?: string
  customerIndustry?: string
  customerName?: string
  districtCode?: string
  email?: string
  followerUserId?: number
  leadLevel?: string
  ownerUserId?: number
  ownerUserName?: string
  phone?: string
  provinceCode?: string
  remark?: string
  sourceDepartmentId?: number
  status?: string
  wechat?: string
  whatsapp?: string
}

export interface BatchAssignRequest {
  leadIds: number[]
  followerUserId: number
}

export interface BatchClaimRequest {
  leadIds: number[]
}

export interface CreateFollowRecordRequest {
  content: string
  followType?: string
  followedAt?: string
  nextFollowAt?: string
  result?: string
  status?: string
}

export interface FollowRecordItem {
  id: number
  leadId: number
  content: string
  followType: string
  followedAt: string
  nextFollowAt: string
  result: string
  followerUserId: number
  followerUserName: string
  createdAt: string
  updatedAt: string
}

export interface UpdateLeadStatusRequest {
  status: string
  invalidReason?: string
}

// ========== API 函数 ==========

/** 查询线索列表 */
export function getLeadList(params?: LeadListParams): Promise<LeadListResponse> {
  return get<LeadListResponse>('/leads', params as unknown as Record<string, unknown>)
}

/** 新增线索 */
export function createLead(data: CreateLeadRequest): Promise<LeadItem> {
  return post<LeadItem>('/leads', data as unknown as Record<string, unknown>)
}

/** 查询线索详情 */
export function getLeadDetail(id: number): Promise<LeadItem> {
  return get<LeadItem>(`/leads/${id}`)
}

/** 批量分配线索 */
export function assignLeads(data: BatchAssignRequest): Promise<{ successCount: number; message: string }> {
  return post('/leads/assign', data as unknown as Record<string, unknown>)
}

/** 批量领取线索 */
export function claimLeads(data: BatchClaimRequest): Promise<{ successCount: number; message: string }> {
  return post('/leads/claim', data as unknown as Record<string, unknown>)
}

/** 查询跟进记录列表 */
export function getFollowRecords(id: number): Promise<FollowRecordItem[]> {
  return get<FollowRecordItem[]>(`/leads/${id}/follow-records`)
}

/** 新增跟进记录 */
export function addFollowRecord(id: number, data: CreateFollowRecordRequest): Promise<FollowRecordItem> {
  return post<FollowRecordItem>(`/leads/${id}/follow-records`, data as unknown as Record<string, unknown>)
}

/** 更新线索状态 */
export function updateLeadStatus(id: number, data: UpdateLeadStatusRequest): Promise<{ message: string }> {
  return post(`/leads/${id}/status`, data as unknown as Record<string, unknown>)
}

/** 从线索创建客户与商机 */
export function createCustomerAndOpportunity(id: number, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
  return post(`/leads/${id}/customer-opportunity`, data || {})
}


/** 查询分配记录 */
export function getAssignmentLogs(id: number):any {
  return get(`/leads/${id}/assignment-logs`)
}




/** 查询线索记录 */
export function getLeadRecords(id: number) {
  return get(`/leads/${id}/lead-records`)
}

// ========== 公海池 ==========

export interface PoolListParams {
  poolCode?: string
  page?: number
  pageSize?: number
  customerName?: string
  customerIndustries?: string[]
  leadLevels?: string[]
  channelCodes?: string[]
  regionPaths?: string[]
  ownerUserName?: string
  followerUserName?: string
}

export interface PoolListResponse {
  items: LeadItem[]
  page: number
  pageSize: number
  total: number
}

export function getLeadsPools(params?: PoolListParams): Promise<PoolListResponse> {
  return get<PoolListResponse>('/leads/pools', params as unknown as Record<string, unknown>)
}
