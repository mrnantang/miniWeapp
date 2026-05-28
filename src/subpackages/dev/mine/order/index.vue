<template>
  <view class="order-page">
    <NavBar title="我的订单" />

    <view class="order-search-row">
      <view class="order-search-box">
        <input class="order-search-input" v-model="keyword" placeholder="请输入订单号/收件人/手机号/物流单号" placeholder-style="color:#BBBEC2;font-size:26rpx" @confirm="onSearch" />
        <image class="order-search-icon" :src="iconSearchOrder" mode="aspectFit" @tap="onSearch" />
      </view>
      <view class="order-filter-btn">
        <image :src="iconFilterOrder" mode="aspectFit" />
      </view>
    </view>

    <scroll-view class="order-scroll" scroll-y :enhanced="true" :show-scrollbar="false" @scrolltolower="onLoadMore">
      <view v-if="loading" class="order-loading">加载中...</view>
      <view v-else-if="orderList.length === 0" class="order-empty">
        <text class="order-empty-text">暂无订单</text>
      </view>
      <view v-else class="order-list">
        <view v-for="item in orderList" :key="item.id" class="order-card">
          <view class="order-card-header">
            <text class="order-card-name">{{ item.customerName }}</text>
            <view class="order-card-badge" :class="'order-card-badge--' + getBadgeType(item.orderStatus)">
              <text class="order-card-badge-text">{{ ORDER_STATUS_MAP[item.orderStatus] || item.orderStatus }}</text>
            </view>
          </view>
          <view class="order-card-info">
            <view class="order-card-row">
              <view class="order-card-field">
                <text class="order-card-label">订单号</text>
                <text class="order-card-value">{{ item.orderNo }}</text>
              </view>
              <view class="order-card-field order-card-field--fixed">
                <text class="order-card-label">关联合同</text>
                <text class="order-card-value">{{ item.contractName || '-' }}</text>
              </view>
            </view>
            <view class="order-card-row">
              <view class="order-card-field">
                <text class="order-card-label">收件人</text>
                <text class="order-card-value">{{ item.recipientName || '-' }}</text>
              </view>
              <view class="order-card-field order-card-field--fixed">
                <text class="order-card-label">订单金额</text>
                <text class="order-card-value order-card-value--price">{{ formatAmount(item.receivableAmount) }}</text>
              </view>
            </view>
          </view>
          <view class="order-card-footer">
            <view class="order-card-btn" @tap="onDetail(item)">
              <text class="order-card-btn-text">查看详情</text>
            </view>
          </view>
        </view>
        <view v-if="hasMore" class="order-load-more" @tap="onLoadMore">加载更多</view>
        <view v-else class="order-load-more order-load-more--end">已加载全部</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getOrderList, ORDER_STATUS_MAP, ORDER_STATUS_BADGE_MAP } from '@/api/order'
import iconSearchOrder from '@/assets/dev/icon-search-order.svg'
import iconFilterOrder from '@/assets/dev/icon-filter-order.svg'

const keyword = ref('')
const loading = ref(false)
const orderList = ref([])
const page = ref(1)
const pageSize = 20
const total = ref(0)
const hasMore = ref(true)

function formatAmount(cent: number): string {
  if (cent === undefined || cent === null) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function getBadgeType(status: string): string {
  return ORDER_STATUS_BADGE_MAP[status] || 'gray'
}

async function fetchOrders(reset = false) {
  if (loading.value) return
  if (reset) {
    page.value = 1
    hasMore.value = true
  }
  loading.value = true
  try {
    const params = { page: page.value, pageSize }
    if (keyword.value) {
      params.orderNo = keyword.value
    }
    const res = await getOrderList(params)
    if (reset) {
      orderList.value = res.items || []
    } else {
      orderList.value = [...orderList.value, ...(res.items || [])]
    }
    total.value = res.total
    hasMore.value = orderList.value.length < res.total
  } catch {
    // 错误已在 request 层统一处理
  } finally {
    loading.value = false
  }
}

function onSearch() {
  fetchOrders(true)
}

function onLoadMore() {
  if (!hasMore.value || loading.value) return
  page.value++
  fetchOrders(false)
}

function onDetail(item) {
  Taro.navigateTo({ url: '/subpackages/dev/mine/order/detail/index?id=' + item.id })
}

fetchOrders(true)
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

.order-loading,
.order-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.order-empty-text {
  font-size: 28rpx;
  color: #9292A5;
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

.order-card-badge--gray {
  background: #F5F5F5;
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

.order-card-badge--gray .order-card-badge-text {
  color: #9292A5;
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

.order-load-more {
  text-align: center;
  font-size: 26rpx;
  color: #5CC79C;
  padding: 20rpx 0;
}

.order-load-more--end {
  color: #BBBEC2;
}
</style>
