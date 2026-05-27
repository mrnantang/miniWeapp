import { get } from '@/utils/request'

export interface ProductItem {
  id: number
  name: string
  productNo: string
  model: string
  unit: string
  brandId: number
  brandName: string
  categoryId: number
  categoryName: string
  priceAmount: number
  publishStatus: string
  coverImageUrl: string
  summary: string
  currencyCode: string
  companyId: number
  departmentId: number
  marketingFolderId: number
  showMoreMaterials: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface ProductListResponse {
  items: ProductItem[]
  page: number
  pageSize: number
  total: number
}

export interface ProductParameter {
  id: number
  name: string
  value: string
  sortOrder: number
}

export interface ProductMediaAsset {
  id: number
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  assetType: string
  isCover: boolean
  sortOrder: number
}

export interface ProductDetailResponse {
  id: number
  name: string
  productNo: string
  model: string
  unit: string
  brandId: number
  brandName: string
  categoryId: number
  categoryName: string
  priceAmount: number
  publishStatus: string
  coverImageUrl: string
  coverAssetId: number
  summary: string
  detailHtml: string
  parameters: ProductParameter[]
  mediaAssets: ProductMediaAsset[]
  currencyCode: string
  companyId: number
  departmentId: number
  marketingFolderId: number
  showMoreMaterials: boolean
  sizeChartAssetId: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface ProductListParams {
  page?: number
  pageSize?: number
  name?: string
  productNo?: string
  categoryIds?: number[]
  brandIds?: number[]
  status?: string
  priceMin?: number
  priceMax?: number
}

/** 查询产品列表 */
export function getProductList(params?: ProductListParams): Promise<ProductListResponse> {
  return get<ProductListResponse>('/product/products', params as Record<string, unknown>)
}

/** 查询产品详情 */
export function getProductDetail(id: number): Promise<ProductDetailResponse> {
  return get<ProductDetailResponse>(`/product/products/${id}`)
}
