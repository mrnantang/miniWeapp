import { get, post, put } from '@/utils/request'

// ========== 类型定义 ==========

/** 附件输入 */
export interface AttachmentInput {
  attachmentType: string
  fileName: string
  fileUrl: string
  fileExt: string
  fileSize: number
}

/** 附件响应 */
export interface AttachmentItem extends AttachmentInput {
  id: number
  bizId: number
  bizType: string
  itemId: number
  createdAt: string
}

/** 报销条目（响应用） */
export interface ReimbursementItem {
  id: number
  lineNo: number
  reimbursementType: string
  amount: number
  description: string
  customerId: number
  customerName: string
  expenseDepartmentId: number
  expenseDepartmentName: string
  startMileage: number
  endMileage: number
  extraPayload: Record<string, unknown>
  attachments: AttachmentItem[]
}

/** 报销条目输入 */
export interface ReimbursementItemInput {
  reimbursementType: string
  amount: number
  description: string
  customerId: number
  customerName: string
  expenseDepartmentId: number
  startMileage: number
  endMileage: number
  extraPayload: Record<string, unknown>
  attachments: AttachmentInput[]
}

/** 创建/编辑报销请求 */
export interface UpsertReimbursementRequest {
  departmentId?: number
  customerId?: number
  customerName?: string
  attachments?: AttachmentInput[]
  items: ReimbursementItemInput[]
}

/** 审批步骤 */
export interface ApprovalStep {
  nodeNo: number
  nodeName: string
  approvalRule: string
  status: string
  operatorName: string
  operatedAt: string
  comment: string
}

/** 报销详情响应 */
export interface ReimbursementDetailResponse {
  id: number
  reimbursementNo: string
  companyId: number
  companyName: string
  departmentId: number
  departmentName: string
  companyDepartmentName: string
  applicantId: number
  applicantName: string
  customerDisplayName: string
  reimbursementTypesDisplay: string
  itemCount: number
  totalAmount: number
  status: string
  submittedAt: string
  createdAt: string
  latestRejectReason: string
  canApprove: boolean
  canCancel: boolean
  canEdit: boolean
  items: ReimbursementItem[]
  attachments: AttachmentItem[]
  approvalHistory: ApprovalStep[]
}

/** 报销列表项 */
export interface ReimbursementListItem {
  id: number
  reimbursementNo: string
  companyName: string
  departmentName: string
  companyDepartmentName: string
  applicantName: string
  customerDisplayName: string
  reimbursementTypesDisplay: string
  itemCount: number
  totalAmount: number
  status: string
  submittedAt: string
  createdAt: string
  canApprove: boolean
  canCancel: boolean
  canEdit: boolean
}

/** 报销汇总 */
export interface ReimbursementSummary {
  totalAmount: number
  totalCount: number
}

/** 报销列表响应 */
export interface ListReimbursementsResponse {
  items: ReimbursementListItem[]
  page: number
  pageSize: number
  total: number
  summary: ReimbursementSummary
}

/** 报销列表查询参数 */
export interface ReimbursementListParams {
  page?: number
  pageSize?: number
  reimbursementNo?: string
  reimbursementType?: string
  customerName?: string
  status?: string
  submittedAtStart?: string
  submittedAtEnd?: string
}

/** 操作响应 */
export interface ActionResponse {
  id: number
  status: string
  message: string
}

// ========== 状态映射 ==========

export const REIMB_STATUS_MAP: Record<string, string> = {
  pending_approval: '待审批',
  approval_rejected: '审批驳回',
  approval_passed: '审批通过',
  cancelled: '已撤销',
}

export const REIMB_STATUS_BADGE_MAP: Record<string, string> = {
  pending_approval: 'yellow',
  approval_rejected: 'red',
  approval_passed: 'green',
  cancelled: 'gray',
}

// ========== API 函数 ==========

/** 查询报销列表 */
export function getReimburseList(params?: ReimbursementListParams): Promise<ListReimbursementsResponse> {
  return get<ListReimbursementsResponse>('/finance/reimbursements', params as unknown as Record<string, unknown>)
}

/** 查询报销详情 */
export function getReimburseDetail(id: number): Promise<ReimbursementDetailResponse> {
  return get<ReimbursementDetailResponse>(`/finance/reimbursements/${id}`)
}

/** 创建报销单 */
export function createReimburse(data: UpsertReimbursementRequest): Promise<ReimbursementDetailResponse> {
  return post<ReimbursementDetailResponse>('/finance/reimbursements', data as unknown as Record<string, unknown>)
}

/** 编辑报销单 */
export function updateReimburse(id: number, data: UpsertReimbursementRequest): Promise<ReimbursementDetailResponse> {
  return put<ReimbursementDetailResponse>(`/finance/reimbursements/${id}`, data as unknown as Record<string, unknown>)
}

/** 撤销报销单 */
export function cancelReimburse(id: number): Promise<ActionResponse> {
  return post<ActionResponse>(`/finance/reimbursements/${id}/cancel`)
}
