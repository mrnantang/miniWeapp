import { get, post, put } from '@/utils/request'
import type { CustomerItem } from './customer'

// ========== 类型定义 ==========

/** 附件输入 */
export interface ExpenseAttachmentInput {
  attachmentType: string
  fileName: string
  fileUrl: string
  fileExt: string
  fileSize: number
}

/** 附件响应 */
export interface ExpenseAttachmentItem extends ExpenseAttachmentInput {
  id: number
  bizId: number
  bizType: string
  itemId: number
  createdAt: string
}

/** 审批步骤 */
export interface ExpenseApprovalStep {
  nodeNo: number
  nodeName: string
  approvalRule: string
  status: string
  operatorName: string
  operatedAt: string
  comment: string
}

/** 审批人快照 */
export interface ExpenseApprovalActor {
  id: number
  name: string
  status: string
  comment: string
  operatedAt: string
}

/** 审批节点快照 */
export interface ExpenseApprovalNodeSnapshot {
  nodeNo: number
  nodeName: string
  approvalRule: string
  status: string
  approvers: ExpenseApprovalActor[]
}

/** 审批流程快照 */
export interface ExpenseApprovalFlowSnapshot {
  nodes: ExpenseApprovalNodeSnapshot[]
}

/** 费用详情响应 */
export interface ExpenseDetailResponse {
  id: number
  expenseNo: string
  amount: number
  expenseItem: string
  expenseDepartmentId: number
  expenseDepartmentName: string
  customerId: number
  customerName: string
  description: string
  payeeAccount: string
  status: string
  submittedAt: string
  createdAt: string
  applicantId: number
  applicantName: string
  companyId: number
  departmentId: number
  latestRejectReason: string
  canApprove: boolean
  canCancel: boolean
  canEdit: boolean
  attachments: ExpenseAttachmentItem[]
  approvalFlow: ExpenseApprovalFlowSnapshot
  approvalHistory: ExpenseApprovalStep[]
}

/** 费用列表项 */
export interface ExpenseListItem {
  id: number
  expenseNo: string
  amount: number
  expenseItem: string
  expenseDepartmentId: number
  expenseDepartmentName: string
  customerId: number
  customerName: string
  description: string
  status: string
  submittedAt: string
  createdAt: string
  applicantId: number
  applicantName: string
  companyId: number
  departmentId: number
  canApprove: boolean
  canCancel: boolean
  canEdit: boolean
}

/** 费用汇总 */
export interface ExpenseSummary {
  totalAmount: number
  totalCount: number
}

/** 费用列表响应 */
export interface ListExpensesResponse {
  items: ExpenseListItem[]
  page: number
  pageSize: number
  total: number
  summary: ExpenseSummary
}

/** 费用列表查询参数 */
export interface ExpenseListParams {
  page?: number
  pageSize?: number
  expenseNo?: string
  customerName?: string
  customerId?: number
  status?: string
  submittedAtStart?: string
  submittedAtEnd?: string
}

/** 创建/编辑费用请求 */
export interface UpsertExpenseRequest {
  amount: number
  expenseDepartmentId: number
  expenseItem: string
  customerId: number
  customerName: string
  description: string
  payeeAccount: string
  attachments: ExpenseAttachmentInput[]
}

/** 操作响应 */
export interface ExpenseActionResponse {
  id: number
  status: string
  message: string
}

// ========== 映射常量 ==========

export const EXPENSE_STATUS_MAP: Record<string, string> = {
  pending_approval: '待审批',
  approval_rejected: '审批驳回',
  approval_passed: '审批通过',
  cancelled: '已撤销',
}

export const EXPENSE_STATUS_BADGE_MAP: Record<string, string> = {
  pending_approval: 'yellow',
  approval_rejected: 'red',
  approval_passed: 'green',
  cancelled: 'gray',
}

export const EXPENSE_ITEM_MAP: Record<string, string> = {
  travel: '差旅费',
  advertising: '广告投流',
  office: '办公费',
  entertainment: '招待费',
  transport: '交通费',
  communication: '通讯费',
  refreshment: '茶水订饮',
  procurement: '采购付款',
  other: '其他',
  business: '业务费',
}

/** 费用项目选项列表（用于选择弹窗） */
export const EXPENSE_ITEM_OPTIONS = [
  { value: 'travel', label: '差旅费' },
  { value: 'advertising', label: '广告投流' },
  { value: 'office', label: '办公费' },
  { value: 'entertainment', label: '招待费' },
  { value: 'transport', label: '交通费' },
  { value: 'communication', label: '通讯费' },
  { value: 'procurement', label: '采购付款' },
  { value: 'other', label: '其他' },
  { value: 'business', label: '业务费' },
]

// ========== API 函数 ==========

/** 查询费用列表 */
export function getExpenseList(params?: ExpenseListParams): Promise<ListExpensesResponse> {
  return get<ListExpensesResponse>('/finance/expenses', params as unknown as Record<string, unknown>)
}

/** 查询费用详情 */
export function getExpenseDetail(id: number): Promise<ExpenseDetailResponse> {
  return get<ExpenseDetailResponse>(`/finance/expenses/${id}`)
}

/** 创建费用单 */
export function createExpense(data: UpsertExpenseRequest): Promise<ExpenseDetailResponse> {
  return post<ExpenseDetailResponse>('/finance/expenses', data as unknown as Record<string, unknown>)
}

/** 编辑费用单 */
export function updateExpense(id: number, data: UpsertExpenseRequest): Promise<ExpenseDetailResponse> {
  return put<ExpenseDetailResponse>(`/finance/expenses/${id}`, data as unknown as Record<string, unknown>)
}

/** 撤销费用单 */
export function cancelExpense(id: number): Promise<ExpenseActionResponse> {
  return post<ExpenseActionResponse>(`/finance/expenses/${id}/cancel`)
}

// ========== 关联客户 ==========

/** 关联客户列表响应 */
export interface RelatedCustomersResponse {
  items: CustomerItem[]
  page: number
  pageSize: number
  total: number
}

/** 获取关联客户列表 */
export function getRelatedCustomers(): Promise<CustomerItem[]> {
  return get<RelatedCustomersResponse>('/finance/expenses/related-customers').then(res => res.items)
}
