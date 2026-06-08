import { get, post } from '@/utils/request'

/** 客户报价列表项 */
export interface CustomerQuotationItem {
  id: number
  name: string
  quotationNo: string
  totalAmount: number
  quotedAt: string
  approvalStatus: string
  bizStatus: string
}

/** 客户报价列表响应 */
export interface CustomerQuotationListResponse {
  canCreate: boolean
  items: CustomerQuotationItem[]
}

/** 报价详情 — 商品明细 */
export interface QuotationLineItem {
  amount: number
  brandName: string
  modelName: string
  productName: string
  quantity: number
  unitPrice: number
  remark: string
}

/** 报价详情 */
export interface QuotationDetailResponse {
  id: number
  name: string
  quotationNo: string
  totalAmount: number
  discountedAmount: number
  approvalStatus: string
  bizStatus: string
  customerId: number
  customerName: string
  opportunityName: string
  validUntil: string
  canEdit: boolean
  canApprove: boolean
  templateName: string
  templateNo: string
  templateVersion: number
  items: QuotationLineItem[]
  approvalFlow: Record<string, unknown>
  approvalHistory: Record<string, unknown>[]
  renderedHtml: string
}

/** 报价审批状态映射 */
export const QUOTATION_APPROVAL_MAP: Record<string, string> = {
  pending: '待审批',
  approved: '审批通过',
  rejected: '审批驳回',
}

/** 报价业务状态映射 */
export const QUOTATION_BIZ_STATUS_MAP: Record<string, string> = {
  draft: '草稿',
  submitted: '已提交',
  approved: '已通过',
  rejected: '已驳回',
  sent: '已发送',
  accepted: '客户已接受',
  rejected_by_customer: '客户已拒绝',
  expired: '已过期',
}

/** 查询客户下的报价列表 */
export function getCustomerQuotations(customerId: number): Promise<CustomerQuotationListResponse> {
  return get<CustomerQuotationListResponse>(`/customers/${customerId}/quotations`)
}

/** 查询报价详情 */
export function getQuotationDetail(id: number): Promise<QuotationDetailResponse> {
  return get<QuotationDetailResponse>(`/quotations/${id}`)
}

/** 新建报价请求 */
export interface CreateQuotationRequest {
  name: string
  customerId?: number
  opportunityId?: number
  templateId?: number
  items: {
    productId?: number
    productName: string
    modelName?: string
    quantity: number
    unitPrice: number
    amount: number
  }[]
  summarySnapshot?: Record<string, unknown>
  paymentTerms?: Record<string, unknown>
  buyerSnapshot?: Record<string, unknown>
}

/** 新建报价 */
export function createQuotation(data: CreateQuotationRequest): Promise<QuotationDetailResponse> {
  return post<QuotationDetailResponse>('/quotations', data as unknown as Record<string, unknown>)
}
