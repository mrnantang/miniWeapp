import { createApp } from 'vue'
import { Button, Checkbox } from '@nutui/nutui-taro'

import './app.scss'

const App = createApp({
  onShow(options) {
  },
})

App.use(Button).use(Checkbox)

export default App
