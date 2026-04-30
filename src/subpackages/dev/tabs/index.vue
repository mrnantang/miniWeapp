<template>
  <view class="tab-bar">
    <view
      v-for="tab in tabs"
      :key="tab.idx"
      class="tab-item"
      @tap="onTabClick(tab)"
    >
      <image
        class="tab-icon"
        :src="current === tab.idx ? tab.activeIcon : tab.icon"
        mode="aspectFit"
      />
      <text class="tab-text" :class="{ 'tab-text--active': current === tab.idx }">
        {{ tab.text }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'

import iconHome from '@/assets/dev/tabs/icon-home.png'
import iconHomeActive from '@/assets/dev/tabs/icon-home-acitve.png'
import iconLead from '@/assets/dev/tabs/icon-lead.png'
import iconLeadActive from '@/assets/dev/tabs/icon-lead-active.png'
import iconOpportunity from '@/assets/dev/tabs/icon-opportunity.png'
import iconCustomer from '@/assets/dev/tabs/icon-customer.png'
import iconMine from '@/assets/dev/tabs/icon-mine.png'
import iconMineActive from '@/assets/dev/tabs/icon-mine-active.png'

const role = Taro.getStorageSync('role') || 'dev'

const allTabs = [
  { text: '首页', path: '/subpackages/dev/home/index', idx: 0, icon: iconHome, activeIcon: iconHomeActive },
  { text: '线索', path: '/subpackages/dev/leads/index', idx: 1, icon: iconLead, activeIcon: iconLeadActive, roles: ['dev'] },
  { text: '商机', path: '/subpackages/dev/opportunity/index', idx: 2, icon: iconOpportunity, activeIcon: iconOpportunity },
  { text: '客户', path: '/subpackages/dev/customer/index', idx: 3, icon: iconCustomer, activeIcon: iconCustomer },
  { text: '我的', path: '/subpackages/dev/mine/index', idx: 4, icon: iconMine, activeIcon: iconMineActive },
]

const tabs = computed(() => allTabs.filter((t) => !t.roles || t.roles.includes(role)))

const current = ref(0)

onMounted(() => {
  const pages = Taro.getCurrentPages()
  const route = pages.length > 0 ? '/' + pages[pages.length - 1].route : ''
  const idx = tabs.value.findIndex((t) => t.path === route)
  if (idx >= 0) current.value = idx
})

const onTabClick = (tab) => {
  current.value = tab.idx
  Taro.reLaunch({ url: tab.path })
}
</script>

<style>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: #FFFFFF;
  border-top: 1rpx solid #F1F1F4;
  box-shadow: 0 -10rpx 32rpx rgba(0, 0, 0, 0.04);
  padding-bottom: env(safe-area-inset-bottom);
  padding-top: 16rpx;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
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
