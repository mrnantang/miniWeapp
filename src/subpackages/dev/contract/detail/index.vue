<template>
  <view class="cdt-page">
    <view class="cdt-bg" :class="'cdt-bg--' + approvalStatus" />
    <view class="cdt-nav-bar">
      <view class="cdt-nav-back" @tap="goBack">
        <image class="cdt-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="cdt-nav-title">合同详情</text>
      <view class="cdt-nav-right" />
    </view>
    <view style="height: 153rpx;width: 100%;" />
    <scroll-view class="cdt-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="cdt-card">
        <text class="cdt-section-title">审批记录</text>
        <view class="cdt-divider" />
        <view class="cdt-approval-timeline">
          <view class="cdt-at-item">
            <view class="cdt-at-left">
              <view class="cdt-at-dot cdt-at-dot--gray" />
              <view class="cdt-at-line" />
            </view>
            <view class="cdt-at-content">
              <text class="cdt-at-title">二级审批</text>
              <view class="cdt-at-card">
                <text class="cdt-at-card-text">暂无数据</text>
              </view>
            </view>
          </view>
          <view class="cdt-at-item">
            <view class="cdt-at-left">
              <view class="cdt-at-dot cdt-at-dot--gray" />
              <view class="cdt-at-line" />
            </view>
            <view class="cdt-at-content">
              <text class="cdt-at-title">一级审批</text>
              <view class="cdt-at-card">
                <text class="cdt-at-card-text">暂无数据</text>
              </view>
            </view>
          </view>
          <view class="cdt-at-item">
            <view class="cdt-at-left">
              <view class="cdt-at-dot cdt-at-dot--gray" />
            </view>
            <view class="cdt-at-content">
              <text class="cdt-at-title">发起审批</text>
              <view class="cdt-at-card">
                <text class="cdt-at-card-text">暂无数据</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="cdt-card">
        <text class="cdt-section-title">需方信息</text>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">需方</text>
          <text class="cdt-value">金石科技</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">单位全称</text>
          <text class="cdt-value">金石科技信息科技有限公司</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">地址</text>
          <text class="cdt-value">江苏省苏州市吴中区幸福大道129号</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">联系人</text>
          <text class="cdt-value">孙大星</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">手机号</text>
          <text class="cdt-value">15877720098</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">账号</text>
          <text class="cdt-value">217271827811</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">开户行</text>
          <text class="cdt-value">建设银行</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">电话</text>
          <text class="cdt-value">400328829982</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">税号</text>
          <text class="cdt-value">21525626345435</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">收货省市区</text>
          <text class="cdt-value">广东省深圳市南山区</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">收货详细地址</text>
          <text class="cdt-value">关河工厂</text>
        </view>
      </view>

      <view class="cdt-card">
        <text class="cdt-section-title">供方信息</text>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">供方</text>
          <text class="cdt-value">德贝尔总公司</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">收款公户/私户</text>
          <text class="cdt-value">公户</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">收款公户账户</text>
          <text class="cdt-value">21892781378271381</text>
        </view>
      </view>

      <view class="cdt-card">
        <view class="cdt-section-head">
          <text class="cdt-section-title">合同信息</text>
          <text class="cdt-section-subtitle">智能喷枪购销合同</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">合同编号</text>
          <text class="cdt-value">HT-28761827818</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">安装时长</text>
          <view class="cdt-row-inline">
            <text class="cdt-value">10</text>
            <text class="cdt-suffix">天</text>
          </view>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">保修期限</text>
          <view class="cdt-row-inline">
            <text class="cdt-value">12</text>
            <text class="cdt-suffix">月</text>
          </view>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">是否含税</text>
          <text class="cdt-value">是</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">税点</text>
          <view class="cdt-row-inline">
            <text class="cdt-value">4</text>
            <text class="cdt-suffix">%</text>
          </view>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">付款方式</text>
          <text class="cdt-value">先付款后发货</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">支付方式</text>
          <text class="cdt-value">分期支付</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row">
          <text class="cdt-label">分付周期</text>
          <text class="cdt-value">4</text>
        </view>
      </view>

      <view class="cdt-card">
        <text class="cdt-section-title">分期信息</text>
        <view class="cdt-divider" />
        <view v-for="period in periods" :key="period.title" class="cdt-period-card">
          <text class="cdt-period-title">{{ period.title }}</text>
          <view class="cdt-period-body">
            <view class="cdt-period-row">
              <text class="cdt-period-label">支付比例</text>
              <view class="cdt-period-value-row">
                <text class="cdt-period-value">{{ period.ratio }}</text>
                <text class="cdt-period-suffix">%</text>
              </view>
            </view>
            <view class="cdt-period-row">
              <text class="cdt-period-label">支付金额</text>
              <view class="cdt-period-value-row">
                <text class="cdt-period-value">{{ period.amount }}</text>
                <text class="cdt-period-suffix">元</text>
              </view>
            </view>
            <view class="cdt-period-row">
              <text class="cdt-period-label">应收款节点</text>
              <text class="cdt-period-value">{{ period.node }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="cdt-bottom-spacer" />
    </scroll-view>

    <view v-if="approvalStatus === 'approved'" class="cdt-actions">
      <view class="cdt-btn cdt-btn--primary" @tap="onPreview">预览</view>
      <view class="cdt-btn cdt-btn--primary" @tap="onShare">分享给客户</view>
      <view class="cdt-btn cdt-btn--gradient" @tap="onUpload">上传回签</view>
    </view>
    <view v-else class="cdt-actions">
      <view class="cdt-btn cdt-btn--danger" @tap="onCancel">取消合同</view>
      <view class="cdt-btn cdt-btn--primary" @tap="onPreview">预览</view>
      <view class="cdt-btn cdt-btn--primary" @tap="onEdit">编辑</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import iconBack from '@/assets/dev/icon-back.png'

const approvalStatus = ref('pending')

const goBack = () => {
  Taro.navigateBack()
}

const periods = ref([
  { title: '一期', ratio: '30', amount: '30000', node: '合同签订' },
  { title: '二期', ratio: '30', amount: '30000', node: '发货后' },
  { title: '三期', ratio: '20', amount: '20000', node: '安装调试后' },
  { title: '四期', ratio: '20', amount: '20000', node: '验收后' },
])

const onCancel = () => {
  Taro.showToast({ title: '取消合同', icon: 'none' })
}

const onPreview = () => {
  Taro.showToast({ title: '预览', icon: 'none' })
}

const onEdit = () => {
  Taro.showToast({ title: '编辑', icon: 'none' })
}

const onShare = () => {
  Taro.showToast({ title: '分享给客户', icon: 'none' })
}

const onUpload = () => {
  Taro.showToast({ title: '上传回签', icon: 'none' })
}
</script>

<style>
.cdt-page {
  min-height: 100vh;
  background: #F5F7F9;
  position: relative;
}

.cdt-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 780rpx;
  pointer-events: none;
}

.cdt-bg--pending,
.cdt-bg--approved {
  background: linear-gradient(180deg, #EAFFF7 0%, rgba(234, 255, 247, 0) 100%);
}

.cdt-bg--rejected {
  background: linear-gradient(180deg, #FFEDED 0%, rgba(255, 237, 237, 0) 100%);
}

.cdt-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
  position: absolute;
  width: 90%;
  z-index: 1;
}

.cdt-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.cdt-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.cdt-nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}

.cdt-nav-right {
  width: 60rpx;
}

.cdt-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.cdt-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.cdt-section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.cdt-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cdt-section-subtitle {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.cdt-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.cdt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cdt-row-inline {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.cdt-label {
  font-size: 30rpx;
  color: #505361;
  flex-shrink: 0;
  margin-right: 12rpx;
}

.cdt-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.cdt-suffix {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cdt-approval-timeline {
  display: flex;
  flex-direction: column;
}

.cdt-at-item {
  display: flex;
  gap: 12rpx;
}

.cdt-at-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.cdt-at-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.cdt-at-dot--gray {
  background: #E5E6EB;
}

.cdt-at-line {
  width: 2rpx;
  flex: 1;
  background: #E5E6EB;
  min-height: 20rpx;
}

.cdt-at-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-bottom: 40rpx;
}

.cdt-at-item:last-child .cdt-at-content {
  padding-bottom: 0;
}

.cdt-at-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.cdt-at-card {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
}

.cdt-at-card-text {
  font-size: 28rpx;
  color: #62687D;
}

.cdt-period-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 28rpx;
}

.cdt-period-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #23252C;
}

.cdt-period-body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.cdt-period-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cdt-period-label {
  font-size: 28rpx;
  color: #505361;
}

.cdt-period-value-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.cdt-period-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}

.cdt-period-suffix {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cdt-bottom-spacer {
  height: 40rpx;
}

.cdt-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #F5F7F9;
  position: relative;
  z-index: 1;
}

.cdt-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.cdt-btn--danger {
  background: #FFE6E6;
  border: 2rpx solid #F53F3F;
  color: #F53F3F;
}

.cdt-btn--primary {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  color: #5CC79C;
}

.cdt-btn--gradient {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
  color: #FFFFFF;
  border: none;
}
</style>
