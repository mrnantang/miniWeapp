<template>
  <cover-view class="tab-bar">
    <cover-view
      v-for="tab in tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: current === tab.index }"
      @tap="onTabClick(tab)"
    >
      <cover-view class="tab-text">{{ tab.text }}</cover-view>
    </cover-view>
  </cover-view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'

const tabs = [
  { text: '看板', path: '/subpackages/ops/dashboard/index', index: 0 },
  { text: '内容', path: '/subpackages/ops/content/index', index: 1 },
  { text: '我的', path: '/subpackages/ops/mine/index', index: 2 },
]

const current = ref(0)

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
  background: #FFFFFF;
  border-top: 1rpx solid #E5E6EB;
  padding-bottom: env(safe-area-inset-bottom);
}
.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-item.active .tab-text {
  color: #37AE7E;
}
.tab-text {
  font-size: 24rpx;
  color: #9292A5;
}
</style>
