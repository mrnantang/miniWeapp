import Taro from '@tarojs/taro'

const KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  PERMISSIONS: 'permissions',
  LOGIN_ACCOUNT: 'login_account',
  LOGIN_PASSWORD: 'login_password',
} as const

export function getToken(): string {
  return Taro.getStorageSync(KEYS.TOKEN)
}

export function setToken(token: string) {
  Taro.setStorageSync(KEYS.TOKEN, token)
}


export function getUserInfo<T = Record<string, unknown>>(): T | null {
  const raw = Taro.getStorageSync(KEYS.USER_INFO)
  return raw ? (raw as T) : null
}

export function setUserInfo(user: Record<string, unknown>) {
  Taro.setStorageSync(KEYS.USER_INFO, user)
}

export function removeUserInfo() {
  Taro.removeStorageSync(KEYS.USER_INFO)
}

export function getPermissions(): string[] {
  return Taro.getStorageSync(KEYS.PERMISSIONS) || []
}

export function setPermissions(permissions: string[]) {
  Taro.setStorageSync(KEYS.PERMISSIONS, permissions)
}

export function removePermissions() {
  Taro.removeStorageSync(KEYS.PERMISSIONS)
}

export function getRememberedAccount(): { account: string; password: string } | null {
  const account = Taro.getStorageSync(KEYS.LOGIN_ACCOUNT)
  const password = Taro.getStorageSync(KEYS.LOGIN_PASSWORD)
  if (account && password) {
    return { account, password }
  }
  return null
}

export function setRememberedAccount(account: string, password: string) {
  Taro.setStorageSync(KEYS.LOGIN_ACCOUNT, account)
  Taro.setStorageSync(KEYS.LOGIN_PASSWORD, password)
}

export function removeRememberedAccount() {
  Taro.removeStorageSync(KEYS.LOGIN_ACCOUNT)
  Taro.removeStorageSync(KEYS.LOGIN_PASSWORD)
}

/** 清除所有登录相关数据 */
export function clearAuth() {
  removeUserInfo()
  removePermissions()
}
