<template>
  <view class="detail-page">
    <navBar title="查看营销任务" />
    <scroll-view class="page-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="form-card">
        <view class="form-row">
          <text class="form-label">营销任务编号</text>
          <text class="form-value">{{ task.id }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">营销任务名称</text>
          <text class="form-value">{{ task.name }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">受众客户</text>
          <text class="form-value">所有客户</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">营销渠道</text>
          <text class="form-value">{{ task.channel }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">是否循环推送</text>
          <text class="form-value">是</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">循环间隔</text>
          <text class="form-value">{{ task.interval }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">任务开始时间</text>
          <text class="form-value">{{ task.startTime }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">任务状态</text>
          <text class="form-value">{{ task.badge }}</text>
        </view>
      </view>

      <view class="editor-card">
        <view class="editor-header">
          <text class="editor-title">营销内容</text>
        </view>
        <view class="editor-preview">
          <image class="editor-image" src="https://via.placeholder.com/670x878" mode="widthFix" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import navBar from '@/components/NavBar.vue'

const task = ref({
  name: '',
  badge: '',
  id: '',
  channel: '',
  interval: '',
  startTime: '',
})

onMounted(() => {
  const params = Taro.getCurrentInstance().router.params
  task.value.name = decodeURIComponent(params.name || '')
  task.value.badge = decodeURIComponent(params.badge || '')
  task.value.id = params.id || ''
  task.value.channel = decodeURIComponent(params.channel || '')
  task.value.interval = decodeURIComponent(params.interval || '')
  task.value.startTime = decodeURIComponent(params.startTime || '')
})
</script>

<style>
.detail-page {
  min-height: 100vh;
  background: #F5F7F9;
}
.page-scroll {
  padding: 20rpx 0;
}

.form-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin: 20rpx;
  display: flex;
  flex-direction: column;
}
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
  padding: 28rpx 0;
}
.form-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}
.form-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}
.form-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.editor-card {
  background: #FFFFFF;
  border-radius: 16rpx 16rpx 0 0;
  margin: 0 20rpx 20rpx;
  overflow: hidden;
}
.editor-header {
  padding: 32rpx 40rpx 0;
}
.editor-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}
.editor-material {
  font-size: 28rpx;
  color: #37AE7E;
}
.editor-preview {
  margin: 20rpx 40rpx 40rpx;
  border: 2rpx solid #EBEBEB;
  border-radius: 8rpx;
  overflow: hidden;
}
.editor-image {
  width: 100%;
  display: block;
}
</style>
