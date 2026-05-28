<template>
  <view class="add-reimb-page">
    <NavBar title="我要报销" />

    <scroll-view class="add-reimb-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view v-for="(card, ci) in cards" :key="ci" class="ar-card">
        <view class="ar-card-header">
          <text class="ar-card-title">报销{{ cardLabel(ci) }}</text>
          <text class="ar-card-delete" @tap="removeCard(ci)">删除</text>
        </view>
        <view class="ar-divider" />
        <view class="ar-field" @tap="onSelectDept(ci)">
          <text class="ar-label">费用承担部门</text>
          <view class="ar-value-row">
            <text :class="card.deptName ? 'ar-value' : 'ar-placeholder'">{{ card.deptName || '请选择' }}</text>
            <image class="ar-arrow" :src="iconArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field" @tap="onSelectType(ci)">
          <text class="ar-label">报销类型</text>
          <view class="ar-value-row">
            <text :class="card.reimbursementType ? 'ar-value' : 'ar-placeholder'">{{ card.reimbursementType || '请选择' }}</text>
            <image class="ar-arrow" :src="iconArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field" @tap="onSelectCustomer(ci)">
          <text class="ar-label">关联客户</text>
          <view class="ar-value-row">
            <text :class="card.customerName ? 'ar-value' : 'ar-placeholder'">{{ card.customerName || '请选择' }}</text>
            <image class="ar-arrow" :src="iconArrow" mode="aspectFit" />
          </view>
        </view>
        <!-- 交通费显示里程字段 -->
        <template v-if="card.reimbursementType === '交通费'">
          <view class="ar-divider" />
          <view class="ar-field">
            <text class="ar-label">开始公里数</text>
            <input class="ar-input" v-model="card.startMileage" placeholder="请输入" placeholder-style="color:#BBBEC2" type="digit" />
          </view>
          <view class="ar-divider" />
          <view class="ar-field">
            <text class="ar-label">结束公里数</text>
            <input class="ar-input" v-model="card.endMileage" placeholder="请输入" placeholder-style="color:#BBBEC2" type="digit" />
          </view>
          <view class="ar-divider" />
          <view class="ar-field">
            <text class="ar-label">开始公里数图片</text>
            <view class="ar-upload-box" @tap="onUpload(ci, 'mileage_start')">
              <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
              <text class="ar-upload-text">点击上传</text>
            </view>
          </view>
          <view class="ar-divider" />
          <view class="ar-field">
            <text class="ar-label">结束公里数图片</text>
            <view class="ar-upload-box" @tap="onUpload(ci, 'mileage_end')">
              <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
              <text class="ar-upload-text">点击上传</text>
            </view>
          </view>
        </template>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">报销金额</text>
          <view class="ar-value-row">
            <input class="ar-input ar-input--amount" v-model="card.amount" placeholder="请输入" placeholder-style="color:#BBBEC2" type="digit" />
            <text class="ar-unit">元</text>
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">上传支付凭证</text>
          <view class="ar-upload-box" @tap="onUpload(ci, 'payment_voucher')">
            <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
            <text class="ar-upload-text">点击上传</text>
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">上传发票</text>
          <view class="ar-upload-box" @tap="onUpload(ci, 'invoice')">
            <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
            <text class="ar-upload-text">点击上传</text>
          </view>
        </view>
      </view>

      <view class="ar-add-row" @tap="addCard">
        <image class="ar-add-icon" :src="iconPlus" mode="aspectFit" />
        <text class="ar-add-text">添加报销</text>
      </view>
    </scroll-view>

    <view class="ar-submit-wrap">
      <view class="ar-submit" @tap="onSubmit">提交审批</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { createReimburse, type UpsertReimbursementRequest, type ReimbursementItemInput } from '@/api/reimburse'
import iconArrow from '@/assets/dev/rightArror.png'
import iconPlus from '@/assets/dev/plus.png'

interface CardData {
  deptId: number
  deptName: string
  reimbursementType: string
  customerId: number
  customerName: string
  startMileage: string
  endMileage: string
  amount: string
}

const labelMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const cards = ref<CardData[]>([
  { deptId: 0, deptName: '', reimbursementType: '', customerId: 0, customerName: '', startMileage: '', endMileage: '', amount: '' },
])

function cardLabel(idx: number): string {
  return labelMap[idx] || String(idx + 1)
}

function addCard() {
  cards.value.push({ deptId: 0, deptName: '', reimbursementType: '', customerId: 0, customerName: '', startMileage: '', endMileage: '', amount: '' })
}

function removeCard(idx: number) {
  if (cards.value.length <= 1) return
  cards.value.splice(idx, 1)
}

function onSelectDept(_ci: number) {
  Taro.showToast({ title: '部门选择功能开发中', icon: 'none' })
}

function onSelectType(_ci: number) {
  Taro.showToast({ title: '类型选择功能开发中', icon: 'none' })
}

function onSelectCustomer(_ci: number) {
  Taro.showToast({ title: '客户选择功能开发中', icon: 'none' })
}

function onUpload(_ci: number, _attType: string) {
  Taro.showToast({ title: '上传功能开发中', icon: 'none' })
}

async function onSubmit() {
  // 校验
  for (let i = 0; i < cards.value.length; i++) {
    const card = cards.value[i]
    if (!card.reimbursementType) {
      Taro.showToast({ title: `请选择报销${labelMap[i] || i + 1}的类型`, icon: 'none' })
      return
    }
    if (!card.amount || Number(card.amount) <= 0) {
      Taro.showToast({ title: `请输入报销${labelMap[i] || i + 1}的金额`, icon: 'none' })
      return
    }
  }

  const items: ReimbursementItemInput[] = cards.value.map(card => ({
    reimbursementType: card.reimbursementType,
    amount: Math.round(Number(card.amount) * 100),
    description: '',
    customerId: card.customerId || 0,
    customerName: card.customerName || '',
    expenseDepartmentId: card.deptId || 0,
    startMileage: Number(card.startMileage) || 0,
    endMileage: Number(card.endMileage) || 0,
    extraPayload: {},
    attachments: [],
  }))

  const data: UpsertReimbursementRequest = {
    departmentId: 0,
    customerId: 0,
    customerName: '',
    attachments: [],
    items,
  }

  try {
    await createReimburse(data)
    Taro.showToast({ title: '提交成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  } catch {
    // 错误已在 request 层统一处理
  }
}
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

.ar-input {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.ar-input--amount {
  width: 200rpx;
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
