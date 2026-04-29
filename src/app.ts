import { createApp } from 'vue'
import { Button, Checkbox, Collapse, CollapseItem, Popup, Category } from '@nutui/nutui-taro'

import './app.scss'

const App = createApp({
  onShow(options) {
  },
})

App.use(Button).use(Checkbox).use(Collapse).use(CollapseItem).use(Popup).use(Category)

export default App
