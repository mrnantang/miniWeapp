import { get, post, del } from '@/utils/request'

// ========== 类型定义 ==========

/** 渠道项 */
export interface TaskChannelItem {
  id: number
  name: string
  platform: string
  sourceType: string
}

/** 任务列表项 */
export interface TaskListItem {
  id: number
  taskNo: string
  name: string
  status: string
  isRecurring: boolean
  recurrenceIntervalDays: number
  startAt: string
  lastRunAt: string
  nextRunAt: string
  audienceType: string
  channels: TaskChannelItem[]
  companyId: number
  departmentId: number
  createdAt: string
  updatedAt: string
}

/** 任务列表查询参数 */
export interface TaskListParams {
  page?: number
  pageSize?: number
  taskNo?: string
  name?: string
  statuses?: string[]
  companyId?: number
  departmentId?: number
}

/** 任务列表响应 */
export interface ListTasksResponse {
  items: TaskListItem[]
  page: number
  pageSize: number
  total: number
}

/** 创建任务请求 */
export interface UpsertTaskRequest {
  name: string
  audienceType: string
  channelIds: number[]
  companyId: number
  departmentId: number
  contentHtml: string
  isRecurring: boolean
  recurrenceIntervalDays: number
  materialIds: number[]
  startAt: string
}

/** 任务执行记录 */
export interface TaskRunItem {
  id: number
  plannedCount: number
  successCount: number
  failedCount: number
  skippedCount: number
  status: string
  errorMessage: string
  plannedRunAt: string
  startedAt: string
  finishedAt: string
}

/** 任务详情响应 */
export interface TaskDetailResponse {
  id: number
  taskNo: string
  name: string
  status: string
  isRecurring: boolean
  recurrenceIntervalDays: number
  startAt: string
  lastRunAt: string
  nextRunAt: string
  audienceType: string
  contentHtml: string
  channels: TaskChannelItem[]
  materials: TaskMaterialItem[]
  runs: TaskRunItem[]
  companyId: number
  departmentId: number
  createdAt: string
  updatedAt: string
}

/** 素材项 */
export interface TaskMaterialItem {
  id: number
  name: string
  description: string
  thumbnailUrl: string
  fileUrl: string
  categoryName: string
  tags: string[]
}

/** 删除响应 */
export interface MutationResponse {
  message: string
}

// ========== 状态映射 ==========

export const TASK_STATUS_MAP: Record<string, string> = {
  pending: '待开始',
  running: '进行中',
  completed: '已完成',
  cancelled: '已取消',
}

export const TASK_STATUS_BADGE_MAP: Record<string, string> = {
  pending: 'pending',
  running: 'active',
  completed: 'done',
  cancelled: 'gray',
}

// ========== API 函数 ==========

/** 查询营销任务列表 */
export function getTaskList(params?: TaskListParams): Promise<ListTasksResponse> {
  return get<ListTasksResponse>('/automation/tasks', params as unknown as Record<string, unknown>)
}

/** 查询营销任务详情 */
export function getTaskDetail(id: number): Promise<TaskDetailResponse> {
  return get<TaskDetailResponse>(`/automation/tasks/${id}`)
}

/** 新增营销任务 */
export function createTask(data: UpsertTaskRequest): Promise<TaskDetailResponse> {
  return post<TaskDetailResponse>('/automation/tasks', data as unknown as Record<string, unknown>)
}

/** 删除营销任务 */
export function deleteTask(id: number, companyId: number): Promise<MutationResponse> {
  return del<MutationResponse>(`/automation/tasks/${id}?companyId=${companyId}`)
}
