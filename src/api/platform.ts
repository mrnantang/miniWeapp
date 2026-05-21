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
