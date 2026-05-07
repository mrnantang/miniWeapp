<template>
  <view class="order-page">
    <NavBar title="我的订单" />

    <view class="order-search-row">
      <view class="order-search-box">
        <input class="order-search-input" placeholder="请输入订单号/收件人/手机号/物流单号" placeholder-style="color:#BBBEC2;font-size:26rpx" />
        <image class="order-search-icon" :src="iconSearchOrder" mode="aspectFit" />
      </view>
      <view class="order-filter-btn">
        <image :src="iconFilterOrder" mode="aspectFit" />
      </view>
    </view>

    <scroll-view class="order-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="order-list">
        <view v-for="(item, idx) in orderList" :key="idx" class="order-card">
          <view class="order-card-header">
            <text class="order-card-name">{{ item.name }}</text>
            <view class="order-card-badge" :class="'order-card-badge--' + item.badgeType">
              <text class="order-card-badge-text">{{ item.badge }}</text>
            </view>
          </view>
          <view class="order-card-info">
            <view class="order-card-row">
              <view class="order-card-field">
                <text class="order-card-label">订单号</text>
                <text class="order-card-value">{{ item.orderNo }}</text>
              </view>
              <view class="order-card-field order-card-field--fixed">
                <text class="order-card-label">关联商机</text>
                <text class="order-card-value">{{ item.opportunity }}</text>
              </view>
            </view>
            <view class="order-card-row">
              <view class="order-card-field">
                <text class="order-card-label">关联合同</text>
                <text class="order-card-value">{{ item.contract }}</text>
              </view>
              <view class="order-card-field order-card-field--fixed">
                <text class="order-card-label">订单金额</text>
                <text class="order-card-value order-card-value--price">{{ item.amount }}</text>
              </view>
            </view>
          </view>
          <view class="order-card-footer">
            <view class="order-card-btn" @tap="onDetail(item)">
              <text class="order-card-btn-text">查看详情</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import iconSearchOrder from '@/assets/dev/icon-search-order.svg'
import iconFilterOrder from '@/assets/dev/icon-filter-order.svg'

const orderList = ref([
  { name: '超凡实业技术有限公司', badge: '待发货', badgeType: 'yellow', orderNo: '2187283781312', opportunity: '金石科技高端机采购书', contract: '智能设备购销合同', amount: '￥160,000' },
  { name: '超凡实业技术有限公司', badge: '已发货', badgeType: 'green', orderNo: '2187283781312', opportunity: '金石科技高端机采购书', contract: '智能设备购销合同', amount: '￥160,000' },
  { name: '超凡实业技术有限公司', badge: '待退货', badgeType: 'red', orderNo: '2187283781312', opportunity: '金石科技高端机采购书', contract: '智能设备购销合同', amount: '￥160,000' },
])

const onDetail = () => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/order/detail/index' })
}
</script>

<style>
.order-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.order-search-row {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 40rpx;
}

.order-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  background: #FFFFFF;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  height: 68rpx;
  box-sizing: border-box;
}

.order-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.order-search-input {
  flex: 1;
  font-size: 26rpx;
  color: #1A1D24;
}

.order-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.order-scroll {
  height: calc(100vh - 88rpx - 116rpx);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 0 40rpx 40rpx;
}

.order-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.order-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx 0;
}

.order-card-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.order-card-badge {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.order-card-badge--yellow {
  background: #FFF8E5;
}

.order-card-badge--green {
  background: #EDFAF5;
}

.order-card-badge--red {
  background: #FFF0F0;
}

.order-card-badge-text {
  font-size: 22rpx;
  color: #E6A23C;
}

.order-card-badge--green .order-card-badge-text {
  color: #37AE7E;
}

.order-card-badge--red .order-card-badge-text {
  color: #F56C6C;
}

.order-card-body {
  padding: 24rpx;
}

.order-card-info {
  margin: 20rpx 24rpx 0;
  padding: 16rpx 20rpx;
  background: #F9FAFB;
  border-radius: 8rpx;
}

.order-card-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.order-card-row:last-child {
  margin-bottom: 0;
}

.order-card-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.order-card-field--fixed {
  flex: none;
  width: 314rpx;
}

.order-card-label {
  font-size: 26rpx;
  color: #62687D;
}

.order-card-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.order-card-value--price {
  font-weight: 500;
}

.order-card-footer {
  padding: 20rpx 24rpx 24rpx;
}

.order-card-btn {
  height: 60rpx;
  border: 2rpx solid #5CC79C;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-card-btn-text {
  font-size: 26rpx;
  color: #5CC79C;
}
</style>
