<template>
  <view class="rd-page">
    <view class="rd-bg" />
    <NavBar title="报销详情" />

    <scroll-view class="rd-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="rd-status-card">
        <text class="rd-status-no">BX-992812781</text>
        <view class="rd-status-badge">待审批</view>
      </view>

      <view v-for="(card, ci) in detailCards" :key="ci" class="rd-card">
        <text class="rd-card-title">报销{{ card.label }}</text>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">费用承担部门</text>
          <text class="rd-value">{{ card.dept }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">报销类型</text>
          <text class="rd-value">{{ card.type }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">关联客户</text>
          <text class="rd-value">{{ card.customer }}</text>
        </view>
        <view v-if="card.showMileage" class="rd-divider" />
        <view v-if="card.showMileage" class="rd-field">
          <text class="rd-label">开始公里数</text>
          <text class="rd-value">{{ card.startMileage }}</text>
        </view>
        <view v-if="card.showMileage" class="rd-divider" />
        <view v-if="card.showMileage" class="rd-field">
          <text class="rd-label">结束公里数</text>
          <text class="rd-value">{{ card.endMileage }}</text>
        </view>
        <view v-if="card.showMileage" class="rd-divider" />
        <view v-if="card.showMileage" class="rd-upload-field">
          <text class="rd-label">开始公里数图片</text>
          <view class="rd-upload-list">
            <view class="rd-upload-thumb" />
          </view>
        </view>
        <view v-if="card.showMileage" class="rd-divider" />
        <view v-if="card.showMileage" class="rd-upload-field">
          <text class="rd-label">结束公里数图片</text>
          <view class="rd-upload-list">
            <view class="rd-upload-thumb" />
          </view>
        </view>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">报销金额</text>
          <text class="rd-value rd-value--price">￥{{ card.amount }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-upload-field">
          <text class="rd-label">上传支付凭证</text>
          <view class="rd-upload-list">
            <view class="rd-upload-thumb" />
          </view>
        </view>
        <view class="rd-divider" />
        <view class="rd-upload-field">
          <text class="rd-label">上传发票</text>
          <view class="rd-upload-list">
            <view class="rd-upload-thumb" />
          </view>
        </view>
      </view>

      <view class="rd-summary-card">
        <view class="rd-summary-row">
          <text class="rd-summary-label">报销总金额</text>
          <text class="rd-summary-value">￥22,680.00</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-summary-row">
          <text class="rd-summary-label">报销总次数</text>
          <text class="rd-summary-value">2</text>
        </view>
      </view>
    </scroll-view>

    <view class="rd-actions">
      <view class="rd-btn rd-btn--cancel">取消</view>
      <view class="rd-btn rd-btn--submit">提交审批</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'

const detailCards = ref([
  { label: '一', dept: '销售部', type: '招待费', customer: '金石科技', showMileage: false, amount: '12,800.00' },
  { label: '二', dept: '销售部', type: '交通费', customer: '超凡实业', showMileage: true, startMileage: '12,000', endMileage: '12,350', amount: '9,880.00' },
])
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
  background: linear-gradient(180deg, #EAFFF7 0%, rgba(234, 255, 247, 0) 100%);
  pointer-events: none;
}

.rd-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.rd-status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.rd-status-no {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
}

.rd-status-badge {
  padding: 6rpx 16rpx;
  background: #FFF7E6;
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #E6A23C;
}

.rd-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.rd-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
}

.rd-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.rd-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-upload-field {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.rd-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.rd-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.rd-value--price {
  font-weight: 600;
}

.rd-upload-list {
  display: flex;
  gap: 12rpx;
}

.rd-upload-thumb {
  width: 128rpx;
  height: 128rpx;
  background: #F5F7F9;
  border: 1rpx solid #E4E9EF;
  border-radius: 8rpx;
}

.rd-summary-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.rd-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-summary-label {
  font-size: 30rpx;
  color: #62687D;
}

.rd-summary-value {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1D24;
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
  padding: 16rpx 0;
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
