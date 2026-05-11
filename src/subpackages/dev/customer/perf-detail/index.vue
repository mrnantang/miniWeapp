<template>
  <view class="pd-page">
    <NavBar title="业绩分配" />
    <scroll-view class="pd-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="pd-card">
        <view class="pd-row">
          <text class="pd-label">合同名称</text>
          <text class="pd-value pd-value--green">超凡科技有限公司购销合同</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">客户名称</text>
          <text class="pd-value pd-value--green">超凡科技有限公司</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">联系电话</text>
          <text class="pd-value">19800287765</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">合同总金额</text>
          <text class="pd-value pd-value--medium">￥100,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">税点</text>
          <text class="pd-value">3%</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">税额</text>
          <text class="pd-value pd-value--medium">￥100,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">业务费</text>
          <text class="pd-value pd-value--medium">￥100,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">业绩总金额</text>
          <text class="pd-value pd-value--medium">￥1200,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">关联商机</text>
          <text class="pd-value pd-value--green">超凡科技有限公司自动报价单</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">本次回款金额</text>
          <text class="pd-value pd-value--medium">￥10,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-row">
          <text class="pd-label">回款凭证</text>
          <!-- <image class="pd-voucher" :src="voucherImg" mode="aspectFill" /> -->
        </view>
      </view>

      <view class="pd-card">
        <text class="pd-section-title">业绩分配细则</text>
        <view class="pd-divider" />
        <view class="pd-timeline">
          <view v-for="(item, idx) in perfDetails" :key="idx" class="pd-tl-item">
            <view class="pd-tl-left">
              <view class="pd-tl-dot" :class="{ 'pd-tl-dot--green': idx === 0 }" />
              <view v-if="idx < perfDetails.length - 1" class="pd-tl-line" />
            </view>
            <view class="pd-tl-content">
              <text class="pd-tl-title">{{ item.dept }}</text>
              <view class="pd-person-card">
                <view class="pd-person-row">
                  <text class="pd-person-label">所属人：</text>
                  <text class="pd-person-value">{{ item.person }}</text>
                </view>
                <view class="pd-person-row">
                  <text class="pd-person-label">比例：</text>
                  <text class="pd-person-value">{{ item.ratio }}</text>
                </view>
                <view class="pd-person-row">
                  <text class="pd-person-label">金额：</text>
                  <text class="pd-person-value pd-person-value--bold">{{ item.amount }}</text>
                </view>
                <view class="pd-person-row">
                  <text class="pd-person-label">状态：</text>
                  <view class="pd-status">
                    <view class="pd-status-dot" :class="'pd-status-dot--' + item.statusStyle" />
                    <text class="pd-status-text" :class="'pd-status-text--' + item.statusStyle">{{ item.status }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="pd-actions">
      <view class="pd-btn pd-btn--edit" @tap="onEdit">编辑</view>
      <view class="pd-btn pd-btn--confirm" @tap="onConfirm">确认</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
// import voucherImg from '@/assets/dev/icon-voucher.png'

const perfDetails = ref([
  { dept: '运营部', person: '张三', ratio: '10%', amount: '￥1,000', status: '已确认', statusStyle: 'green' },
  { dept: '销售部', person: '李四', ratio: '20%', amount: '￥2,000', status: '待确认', statusStyle: 'yellow' },
  { dept: '开发部', person: '王五', ratio: '15%', amount: '￥1,500', status: '待确认', statusStyle: 'yellow' },
])

const onEdit = () => {
  Taro.showToast({ title: '编辑', icon: 'none' })
}

const onConfirm = () => {
  Taro.showToast({ title: '确认', icon: 'none' })
}
</script>

<style>
.pd-page {
  min-height: 100vh;
  background: #F5F7F9;
  display: flex;
  flex-direction: column;
}

.pd-scroll {
  flex: 1;
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.pd-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.pd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pd-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.pd-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 16rpx;
}

.pd-value--green {
  color: #37AE7E;
}

.pd-value--medium {
  font-weight: 500;
}

.pd-voucher {
  width: 96rpx;
  height: 66rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.pd-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.pd-section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1D24;
}

.pd-timeline {
  display: flex;
  flex-direction: column;
}

.pd-tl-item {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
}

.pd-tl-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.pd-tl-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #E5E6EB;
  flex-shrink: 0;
}

.pd-tl-dot--green {
  background: #37AE7E;
}

.pd-tl-line {
  width: 2rpx;
  flex: 1;
  background: #E5E6EB;
  min-height: 20rpx;
}

.pd-tl-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-bottom: 40rpx;
}

.pd-tl-item:last-child .pd-tl-content {
  padding-bottom: 0;
}

.pd-tl-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.pd-person-card {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  background: #FBFBFB;
  border: 1rpx solid #EAF0EE;
  border-radius: 8rpx;
  padding: 24rpx;
}

.pd-person-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.pd-person-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.pd-person-value {
  font-size: 28rpx;
  color: #1A1D24;
}

.pd-person-value--bold {
  font-weight: 600;
}

.pd-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.pd-status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.pd-status-dot--green {
  background: #37AE7E;
}

.pd-status-dot--yellow {
  background: #FF9500;
}

.pd-status-text {
  font-size: 28rpx;
}

.pd-status-text--green {
  color: #37AE7E;
}

.pd-status-text--yellow {
  color: #FF9500;
}

.pd-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #F5F7F9;
}

.pd-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.pd-btn--edit {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  color: #5CC79C;
}

.pd-btn--confirm {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
  color: #FFFFFF;
}
</style>
