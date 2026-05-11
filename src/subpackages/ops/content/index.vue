<template>
  <view class="page">
    <view class="header">
      <text class="header-title">营销</text>
    </view>

    <view class="search-bar">
      <view class="search-input-wrap">
        <input class="search-input" v-model="keyword" placeholder="请输入营销任务编号/名称" placeholder-style="color:#BBBEC2;font-size:26rpx" />
        <image class="search-input-icon" :src="iconSearch" mode="aspectFit" />
      </view>
      <view class="search-btn search-btn--filter">
        <image :src="iconFilter" mode="aspectFit" />
      </view>
      <view class="search-btn search-btn--add">
        <image :src="iconAdd" mode="aspectFit" />
      </view>
    </view>

    <scroll-view class="task-list" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view v-for="(card, idx) in taskCards" :key="idx" class="task-card">
        <view class="task-card-header">
          <text class="task-card-name">{{ card.name }}</text>
          <view class="task-card-badge" :class="'task-card-badge--' + card.badgeStyle">
            <text class="task-card-badge-text">{{ card.badge }}</text>
          </view>
        </view>

        <view class="task-card-body">
          <view class="task-card-row">
            <view class="task-card-field">
              <text class="task-card-label">任务编号</text>
              <text class="task-card-value">{{ card.id }}</text>
            </view>
            <view class="task-card-field task-card-field--fixed">
              <text class="task-card-label">营销渠道</text>
              <text class="task-card-value">{{ card.channel }}</text>
            </view>
          </view>
          <view class="task-card-row">
            <view class="task-card-field">
              <text class="task-card-label">循环间隔</text>
              <text class="task-card-value">{{ card.interval }}</text>
            </view>
            <view class="task-card-field task-card-field--fixed">
              <text class="task-card-label">开始时间</text>
              <text class="task-card-value">{{ card.startTime }}</text>
            </view>
          </view>
        </view>

        <view class="task-card-actions">
          <view v-if="card.showDelete" class="task-card-btn task-card-btn--delete" @tap="onDelete(idx)">
            <text class="task-card-btn-text">删除</text>
          </view>
          <view class="task-card-btn task-card-btn--edit" @tap="onEdit(idx)">
            <text class="task-card-btn-text">{{ card.actionText }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <tab-bar />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import iconBack from '@/assets/dev/icon-back.png'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'

const keyword = ref('')

const onBack = () => {
  Taro.navigateBack()
}

const onEdit = (idx) => {}

const onDelete = (idx) => {}

const taskCards = [
  {
    name: '自动喷分粉枪推流发布',
    badge: '待开始',
    badgeStyle: 'pending',
    id: 'yx2128128',
    channel: '企微 | 公众号',
    interval: '无循环',
    startTime: '2025/01/03 10:00',
    showDelete: true,
    actionText: '编辑',
  },
  {
    name: '自动喷分粉枪推流发布',
    badge: '进行中',
    badgeStyle: 'active',
    id: 'yx2128128',
    channel: '企微 | 公众号',
    interval: '无循环',
    startTime: '2025/01/03 10:00',
    showDelete: true,
    actionText: '编辑',
  },
  {
    name: '自动喷分粉枪推流发布',
    badge: '已完成',
    badgeStyle: 'done',
    id: 'yx2128128',
    channel: '企微 | 公众号',
    interval: '无循环',
    startTime: '2025/01/03 10:00',
    showDelete: true,
    actionText: '查看',
  },
  {
    name: '自动喷分粉枪推流发布',
    badge: '已完成',
    badgeStyle: 'done',
    id: 'yx2128128',
    channel: '企微 | 公众号',
    interval: '无循环',
    startTime: '2025/01/03 10:00',
    showDelete: true,
    actionText: '查看',
  },
  {
    name: '自动喷分粉枪推流发布',
    badge: '已完成',
    badgeStyle: 'done',
    id: 'yx2128128',
    channel: '企微 | 公众号',
    interval: '无循环',
    startTime: '2025/01/03 10:00',
    showDelete: false,
    actionText: '启用',
  },
]
</script>

<style>
.page {
  min-height: 100vh;
  background: #F5F7F9;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background: #FFFFFF;
}
.header-back {
  position: absolute;
  left: 20rpx;
  width: 48rpx;
  height: 48rpx;
}
.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #25293B;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 20rpx;
  background: #FFFFFF;
}
.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  height: 64rpx;
  background: #F6F7FB;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  padding: 0 20rpx;
  gap: 8rpx;
}
.search-input {
  flex: 1;
  height: 100%;
  font-size: 26rpx;
  color: #1A1D24;
}
.search-input-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}
.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.search-btn image {
  width: 32rpx;
  height: 32rpx;
}
.search-btn--filter {
  background: #EDFAF5;
  border: 2rpx solid #CEF0E2;
}
.search-btn--add {
  background: linear-gradient(135deg, #66DCA6 0%, #58BC96 100%);
}
.search-btn--add image {
  filter: brightness(0) invert(1);
}

.task-list {
  padding: 16rpx 20rpx 200rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.task-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.task-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
}
.task-card-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}
.task-card-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rpx 12rpx;
  height: 40rpx;
  border-radius: 6rpx;
}
.task-card-badge--pending {
  background: #FFF4E5;
}
.task-card-badge--active {
  background: #EDFAF5;
}
.task-card-badge--done {
  background: #EDFAF5;
}
.task-card-badge-text {
  font-size: 24rpx;
  color: #FF9500;
  line-height: 36rpx;
}
.task-card-badge--active .task-card-badge-text {
  color: #37AE7E;
}
.task-card-badge--done .task-card-badge-text {
  color: #37AE7E;
}

.task-card-body {
  background: #F9FAFB;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.task-card-row {
  display: flex;
  gap: 20rpx;
}
.task-card-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.task-card-field--fixed {
  flex: none;
  width: 314rpx;
}
.task-card-label {
  font-size: 26rpx;
  color: #62687D;
}
.task-card-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.task-card-actions {
  display: flex;
  gap: 24rpx;
}
.task-card-btn {
  flex: 1;
  height: 64rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task-card-btn--delete {
  background: #FFF0F0;
  border: 2rpx solid #FFD8D8;
}
.task-card-btn--edit {
  background: #EDFAF5;
  border: 2rpx solid #B1E9D3;
}
.task-card-btn-text {
  font-size: 28rpx;
  color: #F53F3F;
}
.task-card-btn--edit .task-card-btn-text {
  color: #37AE7E;
}
</style>