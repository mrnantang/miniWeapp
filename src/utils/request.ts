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
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(res: Taro.request.SuccessCallbackResult<ApiResponse<T>>, url: string): Promise<T> {
  const body = res.data
  if (body.code === 200) {
    return body.data
  }
  if (body.code === 401 && url !== '/auth/login') {
    clearAuth()
    Taro.reLaunch({ url: '/pages/login/index' })
    return Promise.reject(new Error('登录已过期，请重新登录'))
  }
  return Promise.reject(new Error(body.msg || '请求失败'))
}

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await Taro.request<ApiResponse<T>>({
    url: `${getBaseUrl()}${url}`,
    method: 'GET',
    data: params,
    header: {
      'Content-Type': 'application/json',
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
