import { get } from '@/utils/request'

/** 指标 */
export interface Metric {
  key: string
  label: string
  value: number
  changeRate: number
  unit: string
}

export interface FilterResponse {
  companyId: number
  departmentId: number
  operatorId: number
  startDate: string
  endDate: string
}

/** 指标响应（一个折叠面板的数据） */
export interface MetricsResponse {
  filters: FilterResponse
  metrics: Metric[]
}

export interface OperationsOverviewParams {
  companyId?: number
  departmentId?: number
  operatorId?: number
  startDate?: string
  endDate?: string
}

/** 重点客户跟进项 */
export interface KeyCustomerFollowItem {
  id: number
  name: string
  phone?: string
  levelLabel?: string
  latestFollowContent?: string
  latestFollowedAt?: string
  ownerUserName?: string
  region?: string
  collaboratorNames?: string[]
  expectedDealAmount?: number
  expectedDealDate?: string
  createdAt?: string
}

/** 开发端数据看板响应 */
export interface StaffDashboardResponse {
  followMetrics?: MetricsResponse
  dealAmounts?: MetricsResponse
  performance?: MetricsResponse
  expectedDeals?: MetricsResponse
  filters?: FilterResponse
  keyCustomerFollows?: KeyCustomerFollowItem[]
}

/** 运营端数据看板响应 */
export interface OperationsDashboardResponse {
  overview?: MetricsResponse
  leads?: MetricsResponse
  adFlow?: MetricsResponse
  filters?: FilterResponse
}

export function getOperationsOverview(params?: OperationsOverviewParams): Promise<MetricsResponse> {
  return get<MetricsResponse>('/reporting/operations/overview', params as Record<string, unknown>)
}

/** 获取开发端数据看板 */
export function getDevelopmentDashboard(params?: OperationsOverviewParams): Promise<StaffDashboardResponse> {
  return get<StaffDashboardResponse>('/reporting/development/dashboard', params as Record<string, unknown>)
}

/** 获取销售端数据看板 */
export function getSalesDashboard(params?: OperationsOverviewParams): Promise<StaffDashboardResponse> {
  return get<StaffDashboardResponse>('/reporting/sales/dashboard', params as Record<string, unknown>)
}

/** 获取运营端数据看板 */
export function getOperationsDashboard(params?: OperationsOverviewParams): Promise<OperationsDashboardResponse> {
  return get<OperationsDashboardResponse>('/reporting/operations/dashboard', params as Record<string, unknown>)
}
