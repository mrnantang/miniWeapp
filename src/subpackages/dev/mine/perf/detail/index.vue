<template>
  <view class="pd-page">
    <view class="pd-nav-bar">
      <view class="pd-nav-back" @tap="goBack">
        <image class="pd-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="pd-nav-title">业绩分配</text>
      <view class="pd-nav-right" />
    </view>

    <scroll-view class="pd-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="pd-card">
        <view class="pd-field">
          <text class="pd-label">合同名称</text>
          <text class="pd-value pd-value--green">超凡科技有限公司购销合同</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">客户名称</text>
          <text class="pd-value pd-value--green">超凡科技有限公司</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">联系电话</text>
          <text class="pd-value">19800287765</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">合同总金额</text>
          <text class="pd-value pd-value--medium">￥100,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">税点</text>
          <text class="pd-value">3%</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">税额</text>
          <text class="pd-value pd-value--medium">￥100,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">业务费</text>
          <text class="pd-value pd-value--medium">￥100,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">业绩总金额</text>
          <text class="pd-value pd-value--medium">￥1200,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">关联商机</text>
          <text class="pd-value pd-value--green">超凡科技有限公司自动报价单</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field">
          <text class="pd-label">本次回款金额</text>
          <text class="pd-value pd-value--medium">￥10,000</text>
        </view>
        <view class="pd-divider" />
        <view class="pd-field pd-field--voucher">
          <text class="pd-label">回款凭证</text>
          <image class="pd-voucher-img" src="https://via.placeholder.com/96x66" mode="aspectFill" />
        </view>
      </view>

      <view class="pd-card">
        <text class="pd-section-title">业绩分配细则</text>
        <view class="pd-divider" />
        <view class="pd-timeline">
          <view class="pd-timeline-item">
            <view class="pd-timeline-indicator">
              <view class="pd-timeline-line pd-timeline-line--top" />
              <view class="pd-timeline-dot pd-timeline-dot--filled" />
              <view class="pd-timeline-line pd-timeline-line--bottom" />
            </view>
            <view class="pd-timeline-content">
              <text class="pd-timeline-dept">运营部</text>
              <view class="pd-timeline-card">
                <view class="pd-timeline-row">
                  <text class="pd-timeline-label">所属人：</text>
                  <text class="pd-timeline-val">张三</text>
                  <text class="pd-timeline-label">比例：</text>
                  <text class="pd-timeline-val">10%</text>
                </view>
                <view class="pd-timeline-row">
                  <text class="pd-timeline-label">金额：</text>
                  <text class="pd-timeline-val pd-timeline-val--bold">￥1,000</text>
                  <view class="pd-timeline-status">
                    <view class="pd-status-dot pd-status-dot--green" />
                    <text class="pd-status-text">已确认</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="pd-timeline-item">
            <view class="pd-timeline-indicator">
              <view class="pd-timeline-line pd-timeline-line--top" />
              <view class="pd-timeline-dot" />
              <view class="pd-timeline-line pd-timeline-line--bottom" />
            </view>
            <view class="pd-timeline-content">
              <text class="pd-timeline-dept">销售部</text>
              <view class="pd-timeline-card">
                <view class="pd-timeline-row">
                  <text class="pd-timeline-label">所属人：</text>
                  <text class="pd-timeline-val">孙星星</text>
                  <text class="pd-timeline-label">比例：</text>
                  <text class="pd-timeline-val">20%</text>
                </view>
                <view class="pd-timeline-row">
                  <text class="pd-timeline-label">金额：</text>
                  <text class="pd-timeline-val pd-timeline-val--bold">￥2,000</text>
                  <view class="pd-timeline-status">
                    <view class="pd-status-dot pd-status-dot--yellow" />
                    <text class="pd-status-text">待确认</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="pd-timeline-item">
            <view class="pd-timeline-indicator">
              <view class="pd-timeline-line pd-timeline-line--top" />
              <view class="pd-timeline-dot" />
              <view class="pd-timeline-line pd-timeline-line--end" />
            </view>
            <view class="pd-timeline-content">
              <text class="pd-timeline-dept">开发部</text>
              <view class="pd-timeline-card">
                <view class="pd-timeline-row">
                  <text class="pd-timeline-label">所属人：</text>
                  <text class="pd-timeline-val">刘子惠</text>
                  <text class="pd-timeline-label">比例：</text>
                  <text class="pd-timeline-val">20%</text>
                </view>
                <view class="pd-timeline-row">
                  <text class="pd-timeline-label">金额：</text>
                  <text class="pd-timeline-val pd-timeline-val--bold">￥2,000</text>
                  <view class="pd-timeline-status">
                    <view class="pd-status-dot pd-status-dot--yellow" />
                    <text class="pd-status-text">待确认</text>
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
import Taro from '@tarojs/taro'
import iconBack from '@/assets/dev/icon-back.png'

const goBack = () => {
  Taro.navigateBack()
}

const onEdit = () => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/perf/add/index' })
}

const onConfirm = () => {
  Taro.showToast({ title: '已确认', icon: 'none' })
}
</script>

<style>
.pd-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.pd-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
}

.pd-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.pd-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.pd-nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}

.pd-nav-right {
  width: 60rpx;
}

.pd-scroll {
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

.pd-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pd-field--voucher {
  align-items: flex-start;
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
}

.pd-value--green {
  color: #37AE7E;
}

.pd-value--medium {
  font-weight: 500;
}

.pd-voucher-img {
  width: 96rpx;
  height: 66rpx;
  border-radius: 4rpx;
  flex-shrink: 0;
}

.pd-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.pd-section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}

.pd-timeline {
  display: flex;
  flex-direction: column;
}

.pd-timeline-item {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
}

.pd-timeline-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.pd-timeline-line {
  width: 2rpx;
  background: #E5E6EB;
  flex-shrink: 0;
}

.pd-timeline-line--top {
  height: 8rpx;
}

.pd-timeline-line--bottom {
  flex: 1;
  min-height: 8rpx;
}

.pd-timeline-line--end {
  height: 8rpx;
}

.pd-timeline-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 100rpx;
  border: 2rpx solid #37AE7E;
  box-sizing: border-box;
  flex-shrink: 0;
  margin: 4rpx 0;
}

.pd-timeline-dot--filled {
  background: #37AE7E;
  border: none;
}

.pd-timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding-bottom: 40rpx;
}

.pd-timeline-item:last-child .pd-timeline-content {
  padding-bottom: 0;
}

.pd-timeline-dept {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.pd-timeline-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FBFBFB;
  border: 1rpx solid #EAF0EE;
  border-radius: 8rpx;
  padding: 24rpx;
}

.pd-timeline-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.pd-timeline-label {
  font-size: 28rpx;
  color: #62687D;
}

.pd-timeline-val {
  font-size: 28rpx;
  color: #1A1D24;
}

.pd-timeline-val--bold {
  font-weight: 600;
}

.pd-timeline-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-left: auto;
}

.pd-status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 100rpx;
  flex-shrink: 0;
}

.pd-status-dot--green {
  background: #37AE7E;
}

.pd-status-dot--yellow {
  background: #FFAE17;
}

.pd-status-text {
  font-size: 28rpx;
  color: #1A1D24;
}

.pd-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #FFFFFF;
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
