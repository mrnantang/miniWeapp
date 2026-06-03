<template>
  <view class="pa-page">
    <view class="pa-nav-bar">
      <view class="pa-nav-back" @tap="goBack">
        <image class="pa-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="pa-nav-title">编辑业绩分配</text>
      <view class="pa-nav-right" />
    </view>

    <scroll-view class="pa-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="pa-card">
        <view v-for="(dept, di) in deptList" :key="di" class="pa-dept-card">
          <view class="pa-dept-header">
            <text class="pa-dept-name">{{ dept.name }}</text>
            <text class="pa-dept-owner">（所属人：{{ dept.owner }}）</text>
          </view>
          <view class="pa-dept-body">
            <view class="pa-dept-row">
              <text class="pa-dept-label">比例</text>
              <input class="pa-dept-input" v-model="dept.ratio" type="digit" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
              <text class="pa-dept-suffix">%</text>
            </view>
            <view class="pa-dept-row">
              <text class="pa-dept-label">金额</text>
              <input class="pa-dept-input" v-model="dept.amount" type="digit" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
              <text class="pa-dept-suffix">元</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="pa-actions">
      <view class="pa-btn pa-btn--reset" @tap="onReset">重置</view>
      <view class="pa-btn pa-btn--confirm" @tap="onConfirm">{{ isEdit ? '保存' : '确认' }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getPerfDetail, createPerf, updatePerf } from '@/api/perf'
import { uploadFile } from '@/api/material'
import iconBack from '@/assets/dev/icon-back.png'
import iconPlus from '@/assets/dev/plus.png'

function fmtFenDisplay(val) {
  if (val == null) return ''
  return String(val / 100)
}

const isEdit = ref(false)
const editId = ref(0)
const receiptId = ref(0)
const voucherFile = ref(null)

const detail = reactive({
  contractNo: '', contractName: '', contractAmount: 0, receiptAmount: 0,
})

const deptList = ref([])

const DEPT_TYPE_MAP = [
  { name: '运营部', owner: '-', type: 'operation', roleType: 'no_confirm' },
  { name: '销售部',   owner: '-', type: 'sales',       roleType: 'no_confirm' },
  { name: '开发部',   owner: '-', type: 'development', roleType: 'no_confirm' },
]

onMounted(() => {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id) || 0
  const rid = Number(instance.router?.params?.receiptId) || 0

  if (id) {
    isEdit.value = true
    editId.value = id
    loadEditData(id)
  } else {
    receiptId.value = rid
    // 初始化空部门
    deptList.value = DEPT_TYPE_MAP.map(d => ({
      ...d, ratio: '', amount: '', departmentId: 0, employeeId: 0,
    }))
  }
})

async function loadEditData(id) {
  try {
    const res = await getPerfDetail(id)
    Object.assign(detail, {
      contractNo: res.contractNo || '',
      contractName: res.contractName || '',
      contractAmount: res.contractAmount || 0,
      receiptAmount: res.receiptAmount || 0,
    })
    detail.remittanceVoucher = res.remittanceVoucher
    receiptId.value = res.receiptId

    deptList.value = DEPT_TYPE_MAP.map(d => {
      const match = (res.items || []).find(i => i.departmentType === d.type)
      return {
        ...d,
        owner: match?.employeeName || '-',
        ratio: match?.performanceRatio != null ? String(match.performanceRatio) : '',
        amount: match?.performanceAmount != null ? String(match.performanceAmount / 100) : '',
        departmentId: match?.departmentId || 0,
        employeeId: match?.employeeId || 0,
      }
    })
  } catch {
    Taro.showToast({ title: '加载失败', icon: 'none' })
  }
}

const goBack = () => {
  Taro.navigateBack()
}

const onReset = () => {
  deptList.value.forEach(d => { d.ratio = ''; d.amount = '' })
  voucherFile.value = null
  Taro.showToast({ title: '已重置', icon: 'none' })
}

const onUploadVoucher = async () => {
  try {
    const res = await Taro.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'] })
    Taro.showLoading({ title: '上传中...' })
    const uploadRes = await uploadFile(res.tempFilePaths[0], 'perf')
    Taro.hideLoading()
    voucherFile.value = {
      attachmentType: 'remittance_voucher',
      fileName: uploadRes.fileName,
      fileUrl: uploadRes.url,
      fileExt: uploadRes.mimeType,
      fileSize: uploadRes.fileSize,
    }
    Taro.showToast({ title: '上传成功', icon: 'success' })
  } catch (e) {
    Taro.hideLoading()
    if ((e).errMsg?.includes('cancel')) return
    Taro.showToast({ title: '上传失败', icon: 'none' })
  }
}

const onConfirm = async () => {
  const items = deptList.value.filter(d => d.employeeId > 0 && Number(d.ratio) > 0).map(d => ({
    departmentId: d.departmentId,
    departmentType: d.type,
    employeeId: d.employeeId,
    employeeName: d.owner,
    performanceAmount: Math.round(Number(d.amount) * 100),
    performanceRatio: Number(d.ratio),
    roleType: d.roleType,
  }))

 /*  if (items.length === 0) {
    Taro.showToast({ title: '请填写分配明细', icon: 'none' })
    return
  } */

  const totalAmount = items.reduce((sum, i) => sum + i.performanceAmount, 0)

  try {
    if (isEdit.value) {
      await updatePerf(editId.value, { performanceBaseAmount: totalAmount, items })
    } else {
      const data = { receiptId: receiptId.value, performanceBaseAmount: totalAmount, items }
      if (voucherFile.value) data.remittanceVoucher = voucherFile.value
      await createPerf(data)
    }
    Taro.showToast({ title: isEdit.value ? '保存成功' : '提交成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  } catch {
    // 错误已在 request 层统一处理
  }
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

.pa-upload-preview {
  flex-shrink: 0;
}

.pa-upload-preview-img {
  width: 148rpx;
  height: 148rpx;
  border-radius: 8rpx;
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
