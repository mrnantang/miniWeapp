<template>
  <view class="rd-page">
    <view class="rd-bg" :class="'rd-bg--' + approvalStatus" />
    <view class="rd-nav-bar">
      <view class="rd-nav-back" @tap="goBack">
        <image class="rd-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="rd-nav-title">费用详情</text>
      <view class="rd-nav-right" />
    </view>
    <view style="height: 176rpx;width: 100%;">
    </view>
    <scroll-view class="rd-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="rd-info-card">
        <view class="rd-info-field">
          <text class="rd-info-label">费用编号</text>
          <text class="rd-info-value">{{ detail.feeNo }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">费用承担部门</text>
          <text class="rd-info-value">{{ detail.dept }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">关联客户</text>
          <text class="rd-info-value">{{ detail.customer }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">收款账户</text>
          <text class="rd-info-value">{{ detail.account }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">申请金额</text>
          <text class="rd-info-value">{{ detail.amount }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">费用项目</text>
          <text class="rd-info-value">{{ detail.item }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">费用说明</text>
          <text class="rd-info-value">{{ detail.remark }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">发起时间</text>
          <text class="rd-info-value">{{ detail.time }}</text>
        </view>
      </view>

      <view class="rd-approval-card">
        <view class="rd-approval-header">
          <text class="rd-approval-title">审批记录</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-timeline">
          <view class="rd-timeline-item">
            <view class="rd-timeline-dot-col">
              <view class="rd-timeline-line rd-timeline-line--top" />
              <view class="rd-timeline-dot rd-timeline-dot--empty" />
              <view class="rd-timeline-line rd-timeline-line--fill" />
            </view>
            <view class="rd-timeline-content rd-timeline-content--dim">
              <text class="rd-timeline-text">二级审批</text>
            </view>
          </view>
          <view class="rd-timeline-item">
            <view class="rd-timeline-dot-col">
              <view class="rd-timeline-line rd-timeline-line--fill" />
              <view class="rd-timeline-dot rd-timeline-dot--empty" />
              <view class="rd-timeline-line rd-timeline-line--fill" />
            </view>
            <view class="rd-timeline-content rd-timeline-content--dim">
              <text class="rd-timeline-text">一级审批</text>
            </view>
          </view>
          <view class="rd-timeline-item">
            <view class="rd-timeline-dot-col">
              <view class="rd-timeline-line rd-timeline-line--fill" />
              <view class="rd-timeline-dot rd-timeline-dot--solid" />
              <view class="rd-timeline-line rd-timeline-line--none" />
            </view>
            <view class="rd-timeline-content">
              <text class="rd-timeline-text">发起审批</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="rd-actions">
      <view class="rd-btn rd-btn--cancel">撤销申请</view>
      <view class="rd-btn rd-btn--submit">编辑</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import iconBack from '@/assets/dev/icon-back.png'

const detail = ref({
  feeNo: '32423432421341',
  dept: '德贝尔总公司/销售总部/销售一部',
  customer: '超凡科技有限公司',
  account: '217388178371823232',
  amount: '￥1000',
  item: '招待费',
  remark: '给客户买礼物，投其所好',
  time: '2024/01/23 10:12',
})

const goBack = () => {
  Taro.navigateBack()
}

const approvalStatus = ref('pending') // pending | approved | rejected
</script>

<style>
.rd-page {
  min-height: 100vh;
  background: #F5F7F9;
  position: relative;
}

.rd-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 780rpx;
  pointer-events: none;
}

.rd-bg--pending,
.rd-bg--approved {
  background: linear-gradient(180deg, #EAFFF7 0%, rgba(234, 255, 247, 0) 100%);
}

.rd-bg--rejected {
  background: linear-gradient(180deg, #FFEDED 0%, rgba(255, 237, 237, 0) 100%);
}

.rd-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
  position: absolute;
  width: 90%;
  z-index: 1;
}

.rd-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.rd-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.rd-nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}

.rd-nav-right {
  width: 60rpx;
}

.rd-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.rd-info-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.rd-info-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-info-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.rd-info-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}

.rd-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.rd-approval-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.rd-approval-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-approval-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.rd-timeline {
  display: flex;
  flex-direction: column;
}

.rd-timeline-item {
  display: flex;
  gap: 12rpx;
}

.rd-timeline-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.rd-timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.rd-timeline-dot--solid {
  background: #37AE7E;
}

.rd-timeline-dot--empty {
  border: 2rpx solid #E5E6EB;
  background: transparent;
}

.rd-timeline-line {
  width: 2rpx;
  flex: 1;
  min-height: 16rpx;
}

.rd-timeline-line--fill {
  background: #E5E6EB;
}

.rd-timeline-line--top {
  background: #E5E6EB;
  min-height: 4rpx;
  flex: 0 0 8rpx;
}

.rd-timeline-line--none {
  background: transparent;
}

.rd-timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.rd-timeline-content--dim {
  opacity: 0.5;
}

.rd-timeline-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.rd-approval-box {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 20rpx 24rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
}

.rd-ap-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-ap-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.rd-ap-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}

.rd-ap-value--reject {
  color: #F53F3F;
}

.rd-ap-dash {
  height: 1rpx;
  background: transparent;
  border-top: 2rpx dashed #ECEBEB;
  margin: 4rpx 0;
}

.rd-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  position: relative;
  z-index: 1;
}

.rd-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.rd-btn--cancel {
  background: #FFE6E6;
  border: 1rpx solid #F53F3F;
  color: #F53F3F;
}

.rd-btn--submit {
  background: #EFFDF7;
  border: 1rpx solid #5CC79C;
  color: #5CC79C;
}
</style>
