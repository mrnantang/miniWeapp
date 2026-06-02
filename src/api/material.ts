import { get, post, put, del } from '@/utils/request'
import Taro from '@tarojs/taro'

// TARO_APP_API_BASE 由构建配置 defineConstants 注入
declare const TARO_APP_API_BASE: string

// ========== 类型定义 ==========

/** 素材文件 */
export interface MaterialFile {
  id: number
  fileName: string
  fileUrl: string
  fileRole: string
  mimeType: string
  fileSize: number
  durationSeconds: number
  sortOrder: number
}

/** 素材文件输入 */
export interface MaterialFileInput {
  id?: number
  fileName?: string
  fileUrl?: string
  fileRole?: string
  mimeType?: string
  fileSize?: number
  durationSeconds?: number
  sortOrder?: number
}

/** 素材列表项 */
export interface MaterialItem {
  id: number
  name: string
  summary: string
  coverUrl: string
  materialType: string
  companyId: number
  departmentId: number
  folderId: number
  folderName: string
  createdAt: string
  updatedAt: string
}

/** 素材详情 */
export interface MaterialDetailResponse extends MaterialItem {
  contentHtml: string
  h5Url: string
  files: MaterialFile[]
}

/** 素材列表响应 */
export interface ListMaterialsResponse {
  items: MaterialItem[]
  page: number
  pageSize: number
  total: number
}

/** 素材列表查询参数 */
export interface MaterialListParams {
  page?: number
  pageSize?: number
  companyId?: number
  departmentId?: number
  folderId?: number
  types?: string[]
  name?: string
}

/** 新建/编辑素材请求 */
export interface UpsertMaterialRequest {
  companyId?: number
  contentHtml?: string
  departmentId?: number
  files?: MaterialFileInput[]
  folderId?: number
  h5Url?: string
  materialType?: string
  name?: string
  summary?: string
}

/** 文件夹节点 */
export interface FolderNode {
  id: number
  name: string
  companyId: number
  parentId: number
  level: number
  sortOrder: number
  status: string
  children: FolderNode[]
}

/** 新建文件夹请求 */
export interface UpsertFolderRequest {
  companyId?: number
  name?: string
  parentId?: number
  sortOrder?: number
}

/** 删除响应 */
export interface MutationResponse {
  message: string
}

/** 上传文件响应 */
export interface UploadFileResponse {
  url: string
  key: string
  fileName: string
  fileSize: number
  mimeType: string
}

// ========== 素材类型映射 ==========

export const MATERIAL_TYPE_MAP: Record<string, string> = {
  article: '图文',
  poster: '海报',
  video: '视频',
  h5: 'H5',
  document: '文档',
}

export const MATERIAL_TYPE_REVERSE_MAP: Record<string, string> = {
  '图文': 'article',
  '海报': 'poster',
  '视频': 'video',
  'H5': 'h5',
  '文档': 'document',
}

// ========== API 函数 ==========

/** 查询素材文件夹树 */
export function getFolderTree(params?: { companyId?: number }): Promise<FolderNode[]> {
  return get<FolderNode[]>('/automation/folders', params as Record<string, unknown>)
}

/** 新建素材文件夹 */
export function createFolder(data: UpsertFolderRequest): Promise<FolderNode> {
  return post<FolderNode>('/automation/folders', data as Record<string, unknown>)
}

/** 查询素材列表 */
export function getMaterialList(params?: MaterialListParams): Promise<ListMaterialsResponse> {
  return get<ListMaterialsResponse>('/automation/materials', params as Record<string, unknown>)
}

/** 查询素材详情 */
export function getMaterialDetail(id: number, companyId: number): Promise<MaterialDetailResponse> {
  return get<MaterialDetailResponse>(`/automation/materials/${id}`, { companyId })
}

/** 新建素材 */
export function createMaterial(data: UpsertMaterialRequest): Promise<MaterialDetailResponse> {
  return post<MaterialDetailResponse>('/automation/materials', data as Record<string, unknown>)
}

/** 编辑素材 */
export function updateMaterial(id: number, data: UpsertMaterialRequest): Promise<MaterialDetailResponse> {
  return put<MaterialDetailResponse>(`/automation/materials/${id}`, data as Record<string, unknown>)
}

/** 删除素材 */
export function deleteMaterial(id: number, companyId: number): Promise<MutationResponse> {
  return del<MutationResponse>(`/automation/materials/${id}?companyId=${companyId}`)
}

/** 上传文件 */
export async function uploadFile(filePath: string, directory?: string): Promise<UploadFileResponse> {
  const token = Taro.getStorageSync('token')
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${TARO_APP_API_BASE}/uploads`,
      filePath,
      name: 'file',
      header: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      formData: directory ? { directory } : {},
      success(res) {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200 || data.code === 201) {
            resolve(data.data as UploadFileResponse)
          } else {
            reject(new Error(data.msg || '上传失败'))
          }
        } catch {
          reject(new Error('解析响应失败'))
        }
      },
      fail(err) {
        reject(err)
      },
    })
  })
}
