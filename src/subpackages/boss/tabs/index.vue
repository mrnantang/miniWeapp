<template>
  <view class="tab-bar">
    <view
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-item"
      @tap="onTabClick(tab)"
    >
       <image
        class="tab-icon"
        :src="current === tab.index ? tab.activeIcon : tab.icon"
        mode="aspectFit"
      />
      <view class="tab-text" :class="{ 'tab-text--active': current === tab.index }">{{ tab.text }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import Taro from '@tarojs/taro'

import iconDev from '@/assets/dev/tabs/dev.png'
import iconDevActive from '@/assets/dev/tabs/dev-active.png'
import iconSales from '@/assets/dev/tabs/sales.png'
import iconSalesActive from '@/assets/dev/tabs/sales-active.png'
import iconMine from '@/assets/dev/tabs/icon-mine.png'
import iconMineActive from '@/assets/dev/tabs/icon-mine-active.png'
const tabs = [
  { text: '运营', path: '/subpackages/boss/ops-home/index', index: 0, icon: iconDev, activeIcon: iconDevActive },
  { text: '销售', path: '/subpackages/boss/sales-home/index', index: 1, icon: iconSales, activeIcon: iconSalesActive },
  { text: '开发', path: '/subpackages/boss/dev-home/index', index: 2, icon: iconDev, activeIcon: iconDevActive },
  { text: '我的', path: '/subpackages/boss/mine/index', index: 3, icon: iconMine, activeIcon: iconMineActive },
]

const current = ref(0)
onMounted(() => {
  const pages = Taro.getCurrentPages()
  const route = pages.length > 0 ? '/' + pages[pages.length - 1].route : ''
  const idx = tabs.findIndex((t) => t.path === route)
  if (idx >= 0) current.value = idx
})
const onTabClick = (tab) => {
  if (current.value === tab.index) return
  current.value = tab.index
  Taro.reLaunch({ url: tab.path })
}
</script>

<style>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: #FFFFFF;
  border-top: 1rpx solid #E5E6EB;
  padding-bottom: env(safe-area-inset-bottom);
  padding-top: 16rpx;
}
.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rpx;
}
.tab-icon {
  width: 48rpx;
  height: 48rpx;
}
.tab-text {
  font-size: 24rpx;
  color: #C2C2C2;
}
.tab-text--active {
  color: #25293B;
  font-weight: 600;
}
</style>
