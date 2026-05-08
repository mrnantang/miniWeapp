<template>
  <view class="pa-page">
    <view class="pa-nav-bar">
      <view class="pa-nav-back" @tap="goBack">
        <image class="pa-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="pa-nav-title">业绩分配</text>
      <view class="pa-nav-right" />
    </view>

    <scroll-view class="pa-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="pa-card">
        <view class="pa-field">
          <text class="pa-label">合同编号</text>
          <input class="pa-input" v-model="form.contractNo" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="pa-divider" />
        <view class="pa-field">
          <text class="pa-label">合同名称</text>
          <input class="pa-input" v-model="form.contractName" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="pa-divider" />
        <view class="pa-field pa-field--suffix">
          <text class="pa-label">合同总金额</text>
          <view class="pa-input-row">
            <input class="pa-input" v-model="form.totalAmount" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="pa-suffix">元</text>
          </view>
        </view>
        <view class="pa-divider" />
        <view class="pa-field pa-field--suffix">
          <text class="pa-label">本次回款金额</text>
          <view class="pa-input-row">
            <input class="pa-input" v-model="form.paidAmount" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="pa-suffix">元</text>
          </view>
        </view>
        <view class="pa-divider" />
        <view class="pa-field pa-field--upload">
          <text class="pa-label">回款凭证</text>
          <view class="pa-upload-box">
            <image class="pa-upload-icon" :src="iconPlus" mode="aspectFit" />
            <text class="pa-upload-text">点击上传</text>
          </view>
        </view>
        <view class="pa-divider" />
        <view v-for="(dept, di) in deptList" :key="di" class="pa-dept-card">
          <view class="pa-dept-header">
            <text class="pa-dept-name">{{ dept.name }}</text>
            <text class="pa-dept-owner">（所属人：{{ dept.owner }}）</text>
          </view>
          <view class="pa-dept-body">
            <view class="pa-dept-row">
              <text class="pa-dept-label">比例</text>
              <input class="pa-dept-input" v-model="dept.ratio" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
              <text class="pa-dept-suffix">%</text>
            </view>
            <view class="pa-dept-row">
              <text class="pa-dept-label">金额</text>
              <input class="pa-dept-input" v-model="dept.amount" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
              <text class="pa-dept-suffix">元</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="pa-actions">
      <view class="pa-btn pa-btn--reset" @tap="onReset">重置</view>
      <view class="pa-btn pa-btn--confirm" @tap="onConfirm">确认</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import iconBack from '@/assets/dev/icon-back.png'
import iconPlus from '@/assets/dev/plus.png'

const form = reactive({
  contractNo: '',
  contractName: '',
  totalAmount: '',
  paidAmount: '',
})

const deptList = ref([
  { name: '运营部', owner: '孙星星', ratio: '', amount: '' },
  { name: '销售部', owner: '刘星', ratio: '', amount: '' },
  { name: '开发部', owner: '章程', ratio: '', amount: '' },
])

const goBack = () => {
  Taro.navigateBack()
}

const onReset = () => {
  form.contractNo = ''
  form.contractName = ''
  form.totalAmount = ''
  form.paidAmount = ''
  deptList.value = [
    { name: '运营部', owner: '孙星星', ratio: '', amount: '' },
    { name: '销售部', owner: '刘星', ratio: '', amount: '' },
    { name: '开发部', owner: '章程', ratio: '', amount: '' },
  ]
  Taro.showToast({ title: '已重置', icon: 'none' })
}

const onConfirm = () => {
  Taro.showToast({ title: '提交成功', icon: 'none' })
}
</script>

<style>
.pa-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.pa-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
}

.pa-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.pa-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.pa-nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}

.pa-nav-right {
  width: 60rpx;
}

.pa-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.pa-card {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
}

.pa-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pa-field--suffix {
  gap: 8rpx;
}

.pa-field--upload {
  align-items: flex-start;
}

.pa-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.pa-input {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
}

.pa-field--suffix .pa-input {
  width: auto;
  flex: 1;
}

.pa-input-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  justify-content: flex-end;
}

.pa-suffix {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.pa-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.pa-upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 148rpx;
  height: 148rpx;
  border: 2rpx dashed #E0E0E0;
  border-radius: 8rpx;
  background: #FBFBFB;
  flex-shrink: 0;
}

.pa-upload-icon {
  width: 36rpx;
  height: 36rpx;
}

.pa-upload-text {
  font-size: 30rpx;
  color: #1A1D24;
}

.pa-dept-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 28rpx;
}

.pa-dept-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pa-dept-name {
  font-size: 30rpx;
  color: #1A1D24;
}

.pa-dept-owner {
  font-size: 30rpx;
  color: #62687D;
}

.pa-dept-body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.pa-dept-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.pa-dept-label {
  font-size: 30rpx;
  color: #505361;
  flex-shrink: 0;
}

.pa-dept-input {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
}

.pa-dept-suffix {
  font-size: 30rpx;
  color: #505361;
  width: 28rpx;
  text-align: center;
  flex-shrink: 0;
}

.pa-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #FFFFFF;
}

.pa-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.pa-btn--reset {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  color: #5CC79C;
}

.pa-btn--confirm {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
  color: #FFFFFF;
}
</style>
