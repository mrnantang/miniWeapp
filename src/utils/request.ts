import Taro from '@tarojs/taro'
import { getToken, clearAuth } from './storage'

// TARO_APP_API_BASE 由构建配置 defineConstants 注入
declare const TARO_APP_API_BASE: string

interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

function getBaseUrl(): string {
  // @ts-ignore
  return typeof TARO_APP_API_BASE !== 'undefined' ? `${TARO_APP_API_BASE}` : ''
}

function authHeader(): Record<string, string> {
  const token = getToken()
  // const token = ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(res: Taro.request.SuccessCallbackResult<ApiResponse<T>>, url: string): Promise<T> {
  const body = res.data
  if (body.code === 200) {
    return body.data
  }
  if (body.code === 401 && url !== '/auth/login' && url !== '/auth/me') {
    // clearAuth()
    Taro.reLaunch({ url: '/pages/login/index' })
    return Promise.reject(new Error('登录已过期，请重新登录'))
  }
  return Promise.reject(new Error(body.msg || '请求失败'))
}

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  let fullUrl = `${getBaseUrl()}${url}`
  if (params) {
    const parts: string[] = []
    for (const [key, val] of Object.entries(params)) {
      if (val === undefined || val === null) continue
      if (Array.isArray(val)) {
        for (const item of val) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`)
        }
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`)
      }
    }
    if (parts.length > 0) fullUrl += '?' + parts.join('&')
  }
  const res = await Taro.request<ApiResponse<T>>({
    url: fullUrl,
    method: 'GET',
    header: {
      ...authHeader(),
    },
  })
  return handleResponse(res, url)
}

export async function post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
  const res = await Taro.request<ApiResponse<T>>({
    url: `${getBaseUrl()}${url}`,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  })
  return handleResponse(res, url)
}

export async function put<T>(url: string, data?: Record<string, unknown>): Promise<T> {
  const res = await Taro.request<ApiResponse<T>>({
    url: `${getBaseUrl()}${url}`,
    method: 'PUT',
    data,
    header: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  })
  return handleResponse(res, url)
}

export async function del<T>(url: string): Promise<T> {
  const res = await Taro.request<ApiResponse<T>>({
    url: `${getBaseUrl()}${url}`,
    method: 'DELETE',
    header: {
      ...authHeader(),
    },
  })
  return handleResponse(res, url)
}

/** 公开 GET 请求（不携带 Authorization 头，不处理 401 跳转），用于 H5 公开页面 */
export async function publicGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  let fullUrl = `${getBaseUrl()}${url}`
  if (params) {
    const parts: string[] = []
    for (const [key, val] of Object.entries(params)) {
      if (val === undefined || val === null) continue
      if (Array.isArray(val)) {
        for (const item of val) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`)
        }
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`)
      }
    }
    if (parts.length > 0) fullUrl += '?' + parts.join('&')
  }
  const res = await Taro.request<ApiResponse<T>>({
    url: fullUrl,
    method: 'GET',
    header: {},
  })
  if (res.data.code === 200) {
    return res.data.data
  }
  throw new Error(res.data.msg || '请求失败')
}

/** 公开 POST 请求（不携带 Authorization 头，不处理 401 跳转），用于 H5 公开页面 */
export async function publicPost<T>(url: string, data?: Record<string, unknown>): Promise<T> {
  const res = await Taro.request<ApiResponse<T>>({
    url: `${getBaseUrl()}${url}`,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json',
    },
  })
  if (res.data.code === 200) {
    return res.data.data
  }
  throw new Error(res.data.msg || '请求失败')
}
