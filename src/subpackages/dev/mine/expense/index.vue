<template>
  <view class="exp-page">
    <NavBar title="费用申请" />

    <scroll-view class="exp-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="exp-search-row">
        <view class="exp-search-box">
          <input class="exp-search-input" placeholder="请输入搜索" placeholder-style="color:#9292A5;font-size:30rpx" />
          <image class="exp-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="exp-btn" @tap="onFilter">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
      </view>

      <view v-for="(item, idx) in expList" :key="idx" class="exp-card">
        <view class="exp-card-top">
          <view class="exp-card-left">
            <text class="exp-card-no">{{ item.no }}</text>
            <text class="exp-card-sub">(费用编号)</text>
          </view>
          <view class="exp-badge" :class="'exp-badge--' + item.badgeType">
            <text class="exp-badge-text">{{ item.badge }}</text>
          </view>
        </view>
        <view class="exp-card-info">
          <view class="exp-info-row">
            <text class="exp-info-label">申请总金额</text>
            <text class="exp-info-value">￥{{ item.amount }}</text>
          </view>
          <view class="exp-info-divider" />
          <view class="exp-info-row">
            <text class="exp-info-label">费用类型</text>
            <text class="exp-info-value">{{ item.types }}</text>
          </view>
        </view>
        <view class="exp-card-actions">
          <view class="exp-btn exp-btn--cancel">取消申请</view>
          <view class="exp-btn exp-btn--view">查看申请</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Taro from '@tarojs/taro'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'

const expList = ref([
  { no: 'FY-20240101', badge: '待审批', badgeType: 'yellow', amount: '5,000.00', types: '差旅费 | 住宿费' },
  { no: 'FY-20240102', badge: '一级审批驳回', badgeType: 'red', amount: '3,200.00', types: '办公用品' },
  { no: 'FY-20240103', badge: '二级审批中', badgeType: 'yellow', amount: '12,000.00', types: '市场推广费 | 交通费' },
  { no: 'FY-20240104', badge: '二级审批通过', badgeType: 'green', amount: '8,500.00', types: '培训费 | 差旅费' },
])

const onFilter = () => {
  Taro.showToast({ title: '筛选', icon: 'none' })
}
</script>

<style>
.exp-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.exp-scroll {
  height: calc(100vh - 88rpx);
  padding: 24rpx 40rpx 40rpx;
  box-sizing: border-box;
}

.exp-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.exp-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 68rpx;
  background: #F6F7FB;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.exp-search-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}

.exp-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.exp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border: 2rpx solid #CEF0E2;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.exp-btn image {
  width: 28rpx;
  height: 28rpx;
}

.exp-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 20rpx;
}

.exp-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.exp-card-left {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.exp-card-no {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.exp-card-sub {
  font-size: 24rpx;
  color: #62687D;
}

.exp-badge {
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
  flex-shrink: 0;
}

.exp-badge--yellow {
  background: #FFF7E6;
  color: #E6A23C;
}

.exp-badge--red {
  background: #FFF4F4;
  color: #F53F3F;
}

.exp-badge--green {
  background: #EDFAF5;
  color: #37AE7E;
}

.exp-badge-text {
  font-size: 22rpx;
}

.exp-card-info {
  background: #FBFBFB;
  border: 1rpx solid #F0F0F0;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.exp-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exp-info-label {
  font-size: 26rpx;
  color: #62687D;
}

.exp-info-value {
  font-size: 26rpx;
  color: #1A1D24;
  text-align: right;
}

.exp-info-divider {
  height: 1rpx;
  background: #F0F0F0;
  margin: 16rpx 0;
}

.exp-card-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.exp-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 0;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.exp-btn--cancel {
  background: #FFF4F4;
  border: 1rpx solid #FFE8E8;
  color: #F53F3F;
}

.exp-btn--view {
  background: #FFFFFF;
  border: 1rpx solid #B1E9D3;
  color: #37AE7E;
}
</style>
