import { get, post } from '@/utils/request'

// ========== 类型定义 ==========

/** 订单列表项 */
export interface OrderListItem {
  id: number
  orderNo: string
  customerName: string
  contractName: string
  orderStatus: string
  receivableAmount: number
  recipientName: string
  phone: string
  salespersonName: string
  createdAt: string
  latestShippedAt: string
  logisticsCompanyName: string
  trackingNo: string
}

/** 订单列表查询参数 */
export interface OrderListParams {
  page?: number
  pageSize?: number
  departmentId?: number
  orderNo?: string
  contractName?: string
  customerName?: string
  recipientName?: string
  phone?: string
  orderStatus?: string
  createdAtStart?: string
  createdAtEnd?: string
  logisticsCompanyName?: string
  trackingNo?: string
  salespersonName?: string
}

/** 订单列表响应 */
export interface OrderListResponse {
  items: OrderListItem[]
  page: number
  pageSize: number
  total: number
}

/** 产品明细 */
export interface OrderLineItem {
  lineNo: number
  productName: string
  productModel: string
  unit: string
  quantity: number
  shippedQuantity: number
  unitPrice: number
  discountRate: number
  taxRate: number
  taxAmount: number
  subtotalAmount: number
}

/** 物流轨迹 */
export interface ShipmentTrack {
  isLatest: boolean
  trackContent: string
  trackLocation: string
  trackNo: number
  trackTime: string
}

/** 发货记录 */
export interface ShipmentRecord {
  id: number
  logisticsCompanyName: string
  trackingNo: string
  shipmentType: string
  shippedAt: string
  latestTrackStatus: string
  tracks: ShipmentTrack[]
}

/** 审批步骤 */
export interface ApprovalStep {
  approvalRule: string
  comment: string
  nodeName: string
  nodeNo: number
  operatedAt: string
  operatorName: string
  status: string
}

/** 退货信息 */
export interface ReturnInfo {
  logisticsCompanyName: string
  receivedAt: string
  remark: string
  returnStatus: string
  returnedAt: string
  trackingNo: string
}

/** 退款记录 */
export interface RefundRecord {
  id: number
  refundNo: string
  refundType: string
  refundStatus: string
  refundAmount: number
  refundChannel: string
  refundFlowType: string
  reason: string
  bankName: string
  bankAccountNo: string
  accountName: string
  wechatQRCodeUrl: string
  receiptVoucherUrl: string
  returnRequirement: string
  returnInfo: ReturnInfo
  approvalHistory: ApprovalStep[]
  approvedAt: string
  refundedAt: string
  canApprove: boolean
}

/** 订单详情响应 */
export interface OrderDetailResponse {
  id: number
  orderNo: string
  contractName: string
  customerName: string
  orderStatus: string
  totalAmount: number
  discountedAmount: number
  taxAmount: number
  receivableAmount: number
  refundedAmount: number
  currencyCode: string
  recipientName: string
  phone: string
  recipientAddress: string
  salespersonName: string
  createdAt: string
  items: OrderLineItem[]
  shipments: ShipmentRecord[]
  refunds: RefundRecord[]
}

/** 申请退款请求 */
export interface ApplyRefundRequest {
  accountName: string
  bankAccountNo: string
  bankName: string
  reason: string
  receiptVoucherUrl: string
  refundAmount: number
  refundChannel: string
  refundFlowType: string
  refundType: string
  returnRequirement: string
  wechatQRCodeUrl: string
}

/** 退款操作响应 */
export interface RefundActionResponse {
  message: string
  orderStatus: string
  refundId: number
  refundStatus: string
}

/** 重新提交退款请求 */
export interface RefundResubmitRequest {
  accountName: string
  bankAccountNo: string
  bankName: string
  reason: string
  refundAmount: number
  refundChannel: string
  refundFlowType: string
  refundType: string
  returnRequirement: string
  wechatQRCodeUrl: string
}

/** 确认退货请求 */
export interface ConfirmReturnRequest {
  logisticsCompanyName: string
  remark: string
  trackingNo: string
}

// ========== 状态映射 ==========

export const ORDER_STATUS_MAP: Record<string, string> = {
  pending_shipment: '待发货',
  partially_shipped: '部分发货',
  fully_shipped: '全部发货',
  reshipped: '补发货',
  installed: '已安装',
  pending_return: '待退货',
  pending_refund: '待退款',
  refunded: '已退款',
}

export const ORDER_STATUS_BADGE_MAP: Record<string, string> = {
  pending_shipment: 'yellow',
  partially_shipped: 'green',
  fully_shipped: 'green',
  reshipped: 'green',
  installed: 'green',
  pending_return: 'red',
  pending_refund: 'red',
  refunded: 'gray',
}

export const REFUND_STATUS_MAP: Record<string, string> = {
  pending_approval: '待审批',
  approval_rejected: '审批驳回',
  waiting_return: '待退货',
  waiting_refund: '待退款',
  refunded: '已退款',
  cancelled: '已撤销',
}

export const REFUND_TYPE_MAP: Record<string, string> = {
  partial: '部分退款',
  full: '全额退款',
}

export const REFUND_CHANNEL_MAP: Record<string, string> = {
  bank: '银行卡',
  wechat: '微信转账',
  wechat_qr: '微信收款码',
}

export const RETURN_REQUIREMENT_MAP: Record<string, string> = {
  return_required: '需退货',
  no_return: '无需退货',
}

// ========== API 函数 ==========

/** 查询订单列表 */
export function getOrderList(params?: OrderListParams): Promise<OrderListResponse> {
  return get<OrderListResponse>('/sales/orders', params as unknown as Record<string, unknown>)
}

/** 查询订单详情 */
export function getOrderDetail(id: number): Promise<OrderDetailResponse> {
  return get<OrderDetailResponse>(`/sales/orders/${id}`)
}

/** 申请订单退款 */
export function applyRefund(id: number, data: ApplyRefundRequest): Promise<RefundActionResponse> {
  return post<RefundActionResponse>(`/sales/orders/${id}/refunds`, data as unknown as Record<string, unknown>)
}

/** 重新提交退款申请 */
export function resubmitRefund(id: number, data: RefundResubmitRequest): Promise<RefundActionResponse> {
  return post<RefundActionResponse>(`/finance/refunds/${id}/resubmit`, data as unknown as Record<string, unknown>)
}

/** 撤销退款申请 */
export function cancelRefund(id: number): Promise<RefundActionResponse> {
  return post<RefundActionResponse>(`/finance/refunds/${id}/cancel`)
}

/** 确认退货 */
export function confirmReturn(orderId: number, refundId: number, data: ConfirmReturnRequest): Promise<RefundActionResponse> {
  return post<RefundActionResponse>(`/sales/orders/${orderId}/refunds/${refundId}/confirm-return`, data as unknown as Record<string, unknown>)
}
