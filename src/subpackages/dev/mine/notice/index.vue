<template>
  <view class="notice-page">
    <NavBar title="消息通知" />

    <scroll-view class="notice-scroll" scroll-y :enhanced="true" :show-scrollbar="false" @scrolltolower="onLoadMore">
      <view v-if="loading && list.length === 0" class="notice-empty">
        <text class="notice-empty-text">加载中...</text>
      </view>
      <view v-else class="notice-list">
        <view v-for="item in list" :key="item.id" class="notice-card" @tap="onNoticeTap(item)">
          <view class="notice-icon-wrap">
            <image class="notice-icon" :src="iconNotify" mode="aspectFit" />
            <view v-if="item.readAt === null" class="notice-dot" />
          </view>
          <view class="notice-info">
            <text class="notice-title">{{ item.title }}</text>
            <text class="notice-time">{{ formatTime(item.createdAt) }}</text>
          </view>
          <image class="notice-arrow" :src="rightArrowIcon" mode="aspectFit" />
        </view>
      </view>
      <view v-if="loading && list.length > 0" class="notice-empty">
        <text class="notice-empty-text">加载更多...</text>
      </view>
      <view v-if="!loading && list.length === 0" class="notice-empty">
        <text class="notice-empty-text">暂无通知</text>
      </view>
      <text v-if="!hasMore && list.length > 0" class="notice-more">没有更多了</text>
    </scroll-view>

    <nut-popup v-model:visible="showNoticePopup" position="center" :style="{ borderRadius: '24rpx' }" :z-index="2100">
      <view v-if="selectedNotice" class="notice-detail-card">
        <text class="notice-detail-title">{{ selectedNotice.title }}</text>
        <view class="notice-detail-box">
          <view v-if="selectedNotice.payload?.customerName" class="notice-detail-row">
            <text class="notice-detail-label">关联客户</text>
            <text class="notice-detail-value">{{ selectedNotice.payload.customerName }}</text>
          </view>
          <view v-if="selectedNotice.notificationType === 'confirm' && selectedNotice.payload?.amount" class="notice-detail-row">
            <text class="notice-detail-label">业绩金额</text>
            <text class="notice-detail-value">￥{{ selectedNotice.payload.amount }}</text>
          </view>
          <view v-if="selectedNotice.notificationType !== 'confirm' && selectedNotice.payload?.operatorName" class="notice-detail-row">
            <text class="notice-detail-label">操作人</text>
            <text class="notice-detail-value">{{ selectedNotice.payload.operatorName }}</text>
          </view>
          <view class="notice-detail-row">
            <text class="notice-detail-label">通知时间</text>
            <text class="notice-detail-value">{{ formatTime(selectedNotice.createdAt) }}</text>
          </view>
        </view>
        <view class="notice-detail-btns">
          <view class="notice-detail-btn notice-detail-btn--cancel" @tap="onAcknowledge">
            <text class="notice-detail-btn-text notice-detail-btn-text--cancel">我已知晓</text>
          </view>
          <view class="notice-detail-btn notice-detail-btn--confirm" @tap="onViewDetail">
            <text class="notice-detail-btn-text notice-detail-btn-text--confirm">查看详情</text>
          </view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getNotificationList, acknowledgeNotification, type NotificationItem } from '@/api/notification'
import rightArrowIcon from '@/assets/dev/rightArror.png'
import iconNotify from '@/assets/dev/mine/icon-mine-notify.svg'

const list = ref<NotificationItem[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const unreadCount = ref(0)

function formatTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').slice(0, 19)
}

const fetchList = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    page.value = 1
    list.value = []
    hasMore.value = true
  }
  if (!hasMore.value && !reset) return
  loading.value = true
  try {
    const res = await getNotificationList({ page: page.value, pageSize })
    if (reset) {
      list.value = res.items || []
    } else {
      list.value = [...list.value, ...(res.items || [])]
    }
    hasMore.value = list.value.length < res.total
    unreadCount.value = res.unreadCount || 0
  } catch {
    // 保持当前数据
  } finally {
    loading.value = false
  }
}

const onLoadMore = () => {
  if (loading.value || !hasMore.value) return
  page.value++
  fetchList(false)
}

const showNoticePopup = ref(false)
const selectedNotice = ref<NotificationItem | null>(null)

const onNoticeTap = (item: NotificationItem) => {
  selectedNotice.value = item
  showNoticePopup.value = true
}

const onAcknowledge = async () => {
  if (!selectedNotice.value) return
  try {
    await acknowledgeNotification(selectedNotice.value.id)
    if (selectedNotice.value) {
      selectedNotice.value.readAt = new Date().toISOString()
    }
    showNoticePopup.value = false
  } catch {
    Taro.showToast({ title: '操作失败', icon: 'none' })
  }
}

const onViewDetail = () => {
  if (selectedNotice.value?.route) {
    Taro.navigateTo({ url: selectedNotice.value.route })
  } else {
    Taro.showToast({ title: '暂无详情', icon: 'none' })
  }
  showNoticePopup.value = false
}

onMounted(() => {
  fetchList(true)
})
</script>

<style>
.notice-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.notice-scroll {
  height: calc(100vh - 88rpx);
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 40rpx;
  padding-bottom: 0;
}

.notice-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
}

.notice-icon-wrap {
  position: relative;
  width: 72rpx;
  height: 72rpx;
  flex-shrink: 0;
}

.notice-icon {
  width: 72rpx;
  height: 72rpx;
  background: #EDFAF5;
  border-radius: 8rpx;
  padding: 16rpx;
  box-sizing: border-box;
}

.notice-dot {
  position: absolute;
  top: 8rpx;
  right: 6rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #FF3434;
  border: 2rpx solid #FFFFFF;
}

.notice-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.notice-title {
  font-size: 32rpx;
  color: #1A1D24;
}

.notice-time {
  font-size: 28rpx;
  color: #9292A5;
}

.notice-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.notice-more {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #9292A5;
  padding: 40rpx 0 80rpx;
}

.notice-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.notice-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.notice-detail-card {
  width: 658rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.notice-detail-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.notice-detail-box {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 28rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
}

.notice-detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notice-detail-label {
  font-size: 30rpx;
  color: #62687D;
}

.notice-detail-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.notice-detail-btns {
  display: flex;
  gap: 32rpx;
}

.notice-detail-btn {
  flex: 1;
  height: 68rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-detail-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}

.notice-detail-btn-text {
  font-size: 32rpx;
  font-weight: 400;
}

.notice-detail-btn-text--cancel {
  color: #37AE7E;
}

.notice-detail-btn--confirm {
  background: #37AE7E;
}

.notice-detail-btn-text--confirm {
  color: #FFFFFF;
}
</style>
