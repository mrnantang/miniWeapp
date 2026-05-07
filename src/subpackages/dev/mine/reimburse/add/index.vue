<template>
  <view class="add-reimb-page">
    <NavBar title="我要报销" />

    <scroll-view class="add-reimb-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view v-for="(card, ci) in cards" :key="ci" class="ar-card">
        <view class="ar-card-header">
          <text class="ar-card-title">报销{{ card.label }}</text>
          <text class="ar-card-delete">删除</text>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">费用承担部门</text>
          <view class="ar-value-row">
            <text class="ar-placeholder">请选择</text>
            <image class="ar-arrow" :src="iconArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">报销类型</text>
          <view class="ar-value-row">
            <text class="ar-value">{{ card.type }}</text>
            <image class="ar-arrow" :src="iconArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">关联客户</text>
          <view class="ar-value-row">
            <text class="ar-placeholder">请选择</text>
            <image class="ar-arrow" :src="iconArrow" mode="aspectFit" />
          </view>
        </view>
        <view v-if="card.showMileage" class="ar-divider" />
        <view v-if="card.showMileage" class="ar-field">
          <text class="ar-label">开始公里数</text>
          <text class="ar-placeholder">请输入</text>
        </view>
        <view v-if="card.showMileage" class="ar-divider" />
        <view v-if="card.showMileage" class="ar-field">
          <text class="ar-label">结束公里数</text>
          <text class="ar-placeholder">请输入</text>
        </view>
        <view v-if="card.showMileage" class="ar-divider" />
        <view v-if="card.showMileage" class="ar-field">
          <text class="ar-label">开始公里数图片</text>
          <view class="ar-upload-box">
            <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
            <text class="ar-upload-text">点击上传</text>
          </view>
        </view>
        <view v-if="card.showMileage" class="ar-divider" />
        <view v-if="card.showMileage" class="ar-field">
          <text class="ar-label">结束公里数图片</text>
          <view class="ar-upload-box">
            <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
            <text class="ar-upload-text">点击上传</text>
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">报销金额</text>
          <view class="ar-value-row">
            <text class="ar-placeholder">请输入</text>
            <text class="ar-unit">元</text>
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">上传支付凭证</text>
          <view class="ar-upload-box">
            <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
            <text class="ar-upload-text">点击上传</text>
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">上传发票</text>
          <view class="ar-upload-box">
            <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
            <text class="ar-upload-text">点击上传</text>
          </view>
        </view>
      </view>

      <view class="ar-add-row">
        <image class="ar-add-icon" :src="iconPlus" mode="aspectFit" />
        <text class="ar-add-text">添加报销</text>
      </view>
    </scroll-view>

    <view class="ar-submit-wrap">
      <view class="ar-submit">提交审批</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import iconArrow from '@/assets/dev/rightArror.png'
import iconPlus from '@/assets/dev/plus.png'

const cards = ref([
  { label: '一', type: '招待费', showMileage: false },
  { label: '二', type: '交通费', showMileage: true },
])
</script>

<style>
.add-reimb-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.add-reimb-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.ar-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.ar-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ar-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
}

.ar-card-delete {
  font-size: 28rpx;
  color: #F53F3F;
}

.ar-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.ar-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ar-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.ar-value-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.ar-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.ar-placeholder {
  font-size: 30rpx;
  color: #BBBEC2;
  text-align: right;
}

.ar-unit {
  font-size: 30rpx;
  color: #1A1D24;
}

.ar-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.ar-upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  width: 192rpx;
  height: 192rpx;
  border: 2rpx dashed #D9D9D9;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.ar-upload-icon {
  width: 32rpx;
  height: 32rpx;
}

.ar-upload-text {
  font-size: 24rpx;
  color: #1A1D24;
}

.ar-add-row {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  gap: 8rpx;
  padding: 20rpx 0;
}

.ar-add-icon {
  width: 32rpx;
  height: 32rpx;
}

.ar-add-text {
  font-size: 30rpx;
  color: #37AE7E;
}

.ar-submit-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40rpx 48rpx;
}

.ar-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
  background: linear-gradient(270deg, rgba(102, 220, 166, 1) 0%, rgba(88, 188, 150, 1) 100%);
}
</style>
