import { publicGet } from '@/utils/request'

/** PDF 单页图片 */
export interface PdfPage {
  /** 页码（从 1 开始） */
  pageNum: number
  /** 图片地址 */
  imageUrl: string
}

/** PDF 文档信息（后端返回） */
export interface PdfDocument {
  /** 文档标题 */
  title: string
  /** 总页数 */
  totalPages: number
  /** 每页图片列表 */
  pages: PdfPage[]
}

/**
 * 通过 token 获取 PDF 文档信息及每页图片
 * @param token 链接中的访问 token
 */
export function getPdfByToken(token: string): Promise<PdfDocument> {
  return publicGet<PdfDocument>('/public/pdf', { token })
}
