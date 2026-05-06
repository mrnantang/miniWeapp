<template>
  <view class="notice-page">
    <NavBar title="消息通知" />

    <scroll-view class="notice-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="notice-list">
        <view v-for="(item, idx) in noticeList" :key="idx" class="notice-card" @tap="onNoticeTap(item)">
          <view class="notice-icon-wrap">
            <image class="notice-icon" :src="iconNotify" mode="aspectFit" />
            <view v-if="idx === 0" class="notice-dot" />
          </view>
          <view class="notice-info">
            <text class="notice-title">{{ item.title }}</text>
            <text class="notice-time">{{ item.time }}</text>
          </view>
          <image class="notice-arrow" :src="rightArrowIcon" mode="aspectFit" />
        </view>
      </view>
      <text class="notice-more">暂无更多</text>
    </scroll-view>

    <nut-popup v-model:visible="showNoticePopup" position="center" :style="{ borderRadius: '24rpx' }" :z-index="2100">
      <view class="notice-detail-card">
        <text class="notice-detail-title">{{ selectedNotice.title }}</text>
        <view class="notice-detail-box">
          <view class="notice-detail-row">
            <text class="notice-detail-label">关联客户</text>
            <text class="notice-detail-value">金石科技</text>
          </view>
          <view v-if="selectedNotice.type === 'confirm'" class="notice-detail-row">
            <text class="notice-detail-label">业绩金额</text>
            <text class="notice-detail-value">￥2000</text>
          </view>
          <view v-if="selectedNotice.type !== 'confirm'" class="notice-detail-row">
            <text class="notice-detail-label">操作人</text>
            <text class="notice-detail-value">孙销售</text>
          </view>
          <view class="notice-detail-row">
            <text class="notice-detail-label">通知时间</text>
            <text class="notice-detail-value">{{ selectedNotice.time }}</text>
          </view>
        </view>
        <view class="notice-detail-btns">
          <view class="notice-detail-btn notice-detail-btn--cancel" @tap="showNoticePopup = false">
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

<script setup>
import NavBar from '@/components/NavBar.vue'
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import rightArrowIcon from '@/assets/dev/rightArror.png'
import iconNotify from '@/assets/dev/mine/icon-mine-notify.svg'

const noticeList = ref([
  { title: '您已被取消协作人', time: '2024/01/23 10:12', type: 'info' },
  { title: '您已被邀请成为协作人', time: '2024/01/23 10:12', type: 'info' },
  { title: '您有一份业绩分配待确认', time: '2024/01/23 10:12', type: 'confirm' },
  { title: '您被邀请成为协作人', time: '2024/01/23 10:12', type: 'info' },
  { title: '您被邀请成为协作人', time: '2024/01/23 10:12', type: 'info' },
])

const showNoticePopup = ref(false)
const selectedNotice = ref({ title: '', time: '', type: 'info' })

const onNoticeTap = (item) => {
  selectedNotice.value = item
  showNoticePopup.value = true
}

const onViewDetail = () => {
  Taro.showToast({ title: '查看详情', icon: 'none' })
  showNoticePopup.value = false
}

const onReject = () => {
  Taro.showToast({ title: '已拒绝分配', icon: 'none' })
  showNoticePopup.value = false
}

const onAccept = () => {
  Taro.showToast({ title: '已确认分配', icon: 'none' })
  showNoticePopup.value = false
}
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
