import { createApp } from 'vue'
import { Button, Checkbox, Collapse, CollapseItem, Popup, Category, Table, Steps, Step } from '@nutui/nutui-taro'
import Taro from '@tarojs/taro'
import { getMe } from '@/api/auth'
import { getToken, setToken, setUserInfo, setPermissions, clearAuth } from '@/utils/storage'
import { detectRole, getRoleHomePath } from '@/utils/role'

import './app.scss'

async function tryAutoLogin() {
  const token = getToken()
  if (!token) return

  try {
    const res = await getMe()
    setToken(res.token)
    setUserInfo(res.user)
    setPermissions(res.permissions)

    const pages = Taro.getCurrentPages()
    if (pages.length <= 1) {
      const role = detectRole(res.permissions)
      Taro.reLaunch({ url: '/' + getRoleHomePath(role) })
    }
  } catch {
    clearAuth()
  }
}

const App = createApp({
  onShow() {
    tryAutoLogin()
  },
})

App.use(Button).use(Checkbox).use(Collapse).use(CollapseItem).use(Popup).use(Category).use(Table).use(Steps).use(Step)

export default App
