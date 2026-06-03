import { get, post, put } from '@/utils/request'

// ========== 类型定义 ==========

/** 列表查询参数 */
export interface PerfListParams {
  page?: number
  pageSize?: number
  departmentId?: number
  contractName?: string
  customerName?: string
  phone?: string
  opportunityName?: string
  status?: string // pending_confirm | confirmed
}

/** 列表项 */
export interface PerfListItem {
  id: number
  applicationNo: string
  status: string
  contractId: number
  contractName: string
  contractNo: string
  contractAmount: number
  customerId: number
  customerName: string
  customerPhone: string
  opportunityId: number
  opportunityName: string
  receiptAmount: number
  performanceBaseAmount: number
  performanceTotalAmount: number
  salesEmployeeName: string
  developmentEmployeeName: string
  operationEmployeeName: string
  remainingConfirmCount: number
  currentRound: number
  deadlineAt: string
  submittedAt: string
  confirmedAt: string
  canCurrentUserEdit: boolean
  canCurrentUserConfirm: boolean
}

/** 列表响应 */
export interface PerfListResponse {
  items: PerfListItem[]
  page: number
  pageSize: number
  total: number
}

/** 分配条目（详情中） */
export interface PerfItem {
  id: number
  departmentId: number
  departmentType: string
  employeeId: number
  employeeName: string
  performanceAmount: number
  performanceRatio: number
  roleType: string
  confirmStatus: string
  confirmedAt: string
  isConfirmed: boolean
}

/** 详情响应 */
export interface PerfDetailResponse {
  id: number
  applicationNo: string
  status: string
  companyId: number
  customerId: number
  customerName: string
  customerPhone: string
  contractId: number
  contractName: string
  contractNo: string
  contractAmount: number
  contractPerformanceTotal: number
  opportunityId: number
  opportunityName: string
  receiptId: number
  receiptAmount: number
  performanceBaseAmount: number
  performanceTotalAmount: number
  taxRate: number
  taxAmount: number
  businessFeeAmount: number
  salesEmployeeName: string
  developmentEmployeeName: string
  operationEmployeeName: string
  remainingConfirmCount: number
  currentRound: number
  deadlineAt: string
  submittedAt: string
  confirmedAt: string
  canCurrentUserEdit: boolean
  canCurrentUserConfirm: boolean
  items: PerfItem[]
  remittanceVoucher?: {
    fileName: string
    fileUrl: string
    fileExt: string
    fileSize: number
  }
}

/** 分配条目输入 */
export interface PerfItemInput {
  departmentId: number
  departmentType: string // sales | operation | development
  employeeId: number
  employeeName: string
  performanceAmount: number // 单位：分
  performanceRatio: number
  roleType: string
}

/** 创建请求 */
export interface CreatePerfRequest {
  receiptId: number
  performanceBaseAmount: number // 单位：分
  ratioConfigId?: number
  items: PerfItemInput[]
  remittanceVoucher?: {
    attachmentType: string
    fileName: string
    fileUrl: string
    fileExt: string
    fileSize: number
  }
}

/** 编辑请求 */
export interface UpdatePerfRequest {
  performanceBaseAmount: number
  items: PerfItemInput[]
}

// ========== API 函数 ==========

/** 查询绩效申请列表 */
export function getPerfList(params?: PerfListParams): Promise<PerfListResponse> {
  return get<PerfListResponse>('/finance/performance/applications', params as Record<string, unknown>)
}

/** 查询绩效申请详情 */
export function getPerfDetail(id: number): Promise<PerfDetailResponse> {
  return get<PerfDetailResponse>(`/finance/performance/applications/${id}`)
}

/** 创建绩效申请 */
export function createPerf(data: CreatePerfRequest): Promise<PerfDetailResponse> {
  return post<PerfDetailResponse>('/finance/performance/applications', data as unknown as Record<string, unknown>)
}

/** 编辑绩效申请 */
export function updatePerf(id: number, data: UpdatePerfRequest): Promise<PerfDetailResponse> {
  return put<PerfDetailResponse>(`/finance/performance/applications/${id}`, data as unknown as Record<string, unknown>)
}
