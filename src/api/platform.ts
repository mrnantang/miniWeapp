import { get } from '@/utils/request'

export interface RegionTreeNode {
  code: string
  level: number // 1=Province, 2=City, 3=District
  name: string
  children: RegionTreeNode[]
}

export interface RegionTreeResponse {
  items: RegionTreeNode[]
}

export const getRegionTree = (): Promise<RegionTreeResponse> => {
  return get<RegionTreeResponse>('/platform/regions/tree')
}

/** 渠道项 */
export interface ChannelItem {
  id: number
  code: string
  name: string
  platform: string
  sortOrder: number
}

/** 渠道列表响应 */
export interface ChannelListResponse {
  items: ChannelItem[]
}

/** 查询渠道列表 */
export function getChannelList(): Promise<ChannelListResponse> {
  return get<ChannelListResponse>('/platform/channels')
}
