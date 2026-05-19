import { get } from '@/utils/request'

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

export function getOperationsOverview(params?: OperationsOverviewParams): Promise<MetricsResponse> {
  return get<MetricsResponse>('/reporting/operations/overview', params as Record<string, unknown>)
}
