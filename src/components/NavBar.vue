<template>
  <view class="nav-bar">
    <view class="nav-bar-back" @tap="goBack">
      <image class="nav-bar-back-icon" :src="iconBack" mode="aspectFit" />
    </view>
    <text class="nav-bar-title">{{ title }}</text>
    <view class="nav-bar-right" />
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import iconBack from '@/assets/dev/icon-back.png'

const props = defineProps({
  title: { type: String, default: '' },
})

const goBack = () => {
  Taro.navigateBack()
}
</script>

<style>
.nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
  z-index: 999;
}
.nav-bar-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.nav-bar-back-icon {
  width: 40rpx;
  height: 40rpx;
}
.nav-bar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}
.nav-bar-right {
  width: 60rpx;
}
</style>
