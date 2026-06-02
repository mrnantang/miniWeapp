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
            <text :class="card.expenseUserName ? 'ar-value' : 'ar-placeholder'">{{ card.expenseUserName || '请选择' }}</text>
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
              <image v-if="card.mileageStartFile" class="ar-upload-preview" :src="card.mileageStartFile.fileUrl" mode="aspectFill" />
              <template v-else>
                <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
                <text class="ar-upload-text">点击上传</text>
              </template>
            </view>
          </view>
          <view class="ar-divider" />
          <view class="ar-field">
            <text class="ar-label">结束公里数图片</text>
            <view class="ar-upload-box" @tap="onUpload(ci, 'mileage_end')">
              <image v-if="card.mileageEndFile" class="ar-upload-preview" :src="card.mileageEndFile.fileUrl" mode="aspectFill" />
              <template v-else>
                <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
                <text class="ar-upload-text">点击上传</text>
              </template>
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
            <image v-if="card.paymentVoucherFile" class="ar-upload-preview" :src="card.paymentVoucherFile.fileUrl" mode="aspectFill" />
            <template v-else>
              <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
              <text class="ar-upload-text">点击上传</text>
            </template>
          </view>
        </view>
        <view class="ar-divider" />
        <view class="ar-field">
          <text class="ar-label">上传发票</text>
          <view class="ar-upload-box" @tap="onUpload(ci, 'invoice')">
            <image v-if="card.invoiceFile" class="ar-upload-preview" :src="card.invoiceFile.fileUrl" mode="aspectFill" />
            <template v-else>
              <image class="ar-upload-icon" :src="iconPlus" mode="aspectFit" />
              <text class="ar-upload-text">点击上传</text>
            </template>
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

    <!-- 费用承担部门选择弹窗（userCascader：公司→部门→用户） -->
    <nut-popup v-model:visible="showDeptPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2200" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">费用承担部门</text>
        </view>
        <view class="filter-body">
          <scroll-view class="filter-content" scroll-y="true" :enhanced="true" :show-scrollbar="false">
            <view class="region-section">
              <view class="region-breadcrumb">
                <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': userDrillStack.length === 0 }" @tap="userCascaderBackTo(0)">{{ userDrillStack.length > 0 ? userDrillStack[0].name : '请选择公司' }}</text>
                <template v-for="(node, idx) in userDrillStack.slice(1)" :key="getUserCascaderNodeKey(node)">
                  <text class="region-breadcrumb-sep">/</text>
                  <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': idx + 1 === userDrillStack.length - 1 }" @tap="userCascaderBackTo(idx + 1)">{{ node.name }}</text>
                </template>
                <template v-if="selectedUserId">
                  <text class="region-breadcrumb-sep">/</text>
                  <text class="region-breadcrumb-item region-breadcrumb-item--active">{{ selectedUserName }}</text>
                </template>
              </view>
              <view v-if="cascaderLoading" class="region-loading"><text class="region-loading-text">加载中...</text></view>
              <view v-else class="org-tag-row">
                <view v-for="item in currentUserCascaderItems" :key="getUserCascaderNodeKey(item)" class="org-tag" :class="{ 'org-tag--active': isUserCascaderSelected(item) }" @tap="onUserCascaderTap(item)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': isUserCascaderSelected(item) }">{{ item.name }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="filter-footer">
          <view class="filter-footer-btn filter-footer-clear" @tap="showDeptPopup = false">
            <text class="filter-footer-clear-text">取消</text>
          </view>
          <view class="filter-footer-btn filter-footer-submit" @tap="onDeptConfirm">
            <text class="filter-footer-submit-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <!-- 关联客户选择弹窗 -->
    <nut-popup v-model:visible="showCustomerPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2100" safe-area-inset-bottom>
      <view class="customer-popup">
        <view class="customer-header">
          <text class="customer-header-btn" @tap="showCustomerPopup = false">取消</text>
          <text class="customer-header-title">选择关联客户</text>
          <text class="customer-header-btn customer-header-confirm" @tap="showCustomerPopup = false">确认</text>
        </view>
        <scroll-view class="customer-list" scroll-y>
          <view v-if="customerLoading" class="customer-loading">加载中...</view>
          <view v-else-if="customerList.length === 0" class="customer-empty">暂无关联客户</view>
          <template v-else v-for="item in customerList" :key="item.id">
            <view class="customer-row" @tap="onCustomerSelect(item)">
              <text class="customer-name">{{ item.name }}</text>
            </view>
            <view class="customer-divider" />
          </template>
        </scroll-view>
      </view>
    </nut-popup>

    <!-- 报销类型选择弹窗 -->
    <nut-popup v-model:visible="showTypePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100" safe-area-inset-bottom>
      <view class="type-popup">
        <view class="type-header">
          <text class="type-header-btn" @tap="showTypePopup = false">取消</text>
          <text class="type-header-title">选择报销类型</text>
          <text class="type-header-btn type-header-confirm" @tap="showTypePopup = false">确认</text>
        </view>
        <scroll-view class="type-list" scroll-y>
          <template v-for="item in reimbTypeOptions" :key="item">
            <view class="type-row" @tap="onTypeSelect(item)">
              <text class="type-name">{{ item }}</text>
            </view>
            <view class="type-divider" />
          </template>
        </scroll-view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { createReimburse, type UpsertReimbursementRequest, type ReimbursementItemInput, type AttachmentInput } from '@/api/reimburse'
import { getRelatedCustomers } from '@/api/expense'
import type { CustomerItem } from '@/api/customer'
import { uploadFile } from '@/api/material'
import { getUserCascader, type UserCascaderNode } from '@/api/system'
import iconArrow from '@/assets/dev/rightArror.png'
import iconPlus from '@/assets/dev/plus.png'

/** 上传后得到的文件信息 */
interface UploadedFile {
  fileName: string
  fileUrl: string
  fileExt: string
  fileSize: number
}

interface CardData {
  expenseUserId: number
  expenseUserName: string
  expenseDepartmentId: number
  expenseDepartmentName: string
  reimbursementType: string
  customerId: number
  customerName: string
  startMileage: string
  endMileage: string
  amount: string
  mileageStartFile: UploadedFile | null
  mileageEndFile: UploadedFile | null
  paymentVoucherFile: UploadedFile | null
  invoiceFile: UploadedFile | null
}

const emptyCard = (): CardData => ({
  expenseUserId: 0, expenseUserName: '', expenseDepartmentId: 0, expenseDepartmentName: '', reimbursementType: '', customerId: 0, customerName: '',
  startMileage: '', endMileage: '', amount: '',
  mileageStartFile: null, mileageEndFile: null, paymentVoucherFile: null, invoiceFile: null,
})

const labelMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const cards = ref<CardData[]>([emptyCard()])

function cardLabel(idx: number): string {
  return labelMap[idx] || String(idx + 1)
}

function addCard() {
  cards.value.push(emptyCard())
}

function removeCard(idx: number) {
  if (cards.value.length <= 1) return
  cards.value.splice(idx, 1)
}

// ========== 费用承担部门选择弹窗（userCascader：公司→部门→用户） ==========
const showDeptPopup = ref(false)
const cascaderLoading = ref(false)
const userCascaderTree = ref<UserCascaderNode[]>([])
const userDrillStack = ref<UserCascaderNode[]>([])
const selectedUserId = ref(0)
const selectedUserName = ref('')
let currentDeptCardIdx = 0

const currentUserCascaderItems = computed(() => {
  if (userDrillStack.value.length === 0) return userCascaderTree.value
  const last = userDrillStack.value[userDrillStack.value.length - 1]
  return last.children || []
})

function getUserCascaderNodeKey(node: UserCascaderNode): string {
  if (node.nodeType === 'user') return `u-${node.userId}`
  if (node.nodeType === 'department') return `d-${node.departmentId || node.name}`
  return `c-${node.companyId || node.name}`
}

function isUserCascaderSelected(item: UserCascaderNode): boolean {
  return selectedUserId.value > 0 && selectedUserId.value === item.userId
}

async function fetchUserCascader() {
  if (userCascaderTree.value.length > 0 || cascaderLoading.value) return
  cascaderLoading.value = true
  try {
    const res = await getUserCascader({ companyId: 1 })
    userCascaderTree.value = res.items || []
  } catch {
    // 错误已在 request 层统一处理
  } finally {
    cascaderLoading.value = false
  }
}

function onUserCascaderTap(item: UserCascaderNode) {
  if (item.nodeType === 'user') {
    // 选中用户（单选）
    selectedUserId.value = item.userId || 0
    selectedUserName.value = item.name
  } else {
    // 公司或部门 → 下钻
    userDrillStack.value.push(item)
    selectedUserId.value = 0
    selectedUserName.value = ''
  }
}

function userCascaderBackTo(index: number) {
  userDrillStack.value = userDrillStack.value.slice(0, index)
  selectedUserId.value = 0
  selectedUserName.value = ''
}

function onDeptConfirm() {
  const card = cards.value[currentDeptCardIdx]
  card.expenseUserId = selectedUserId.value
  card.expenseUserName = selectedUserName.value
  // 从级联路径提取部门信息（userDrillStack 最后一项是用户所属部门）
  if (userDrillStack.value.length > 0) {
    const deptNode = userDrillStack.value[userDrillStack.value.length - 1]
    card.expenseDepartmentId = deptNode.departmentId || 0
    card.expenseDepartmentName = deptNode.name
  }
  showDeptPopup.value = false
}

function onSelectDept(ci: number) {
  currentDeptCardIdx = ci
  showDeptPopup.value = true
  fetchUserCascader()
}

// ========== 报销类型选择弹窗 ==========
const reimbTypeOptions = ['招待费', '礼品费', '交通费', '高速过路费', '住宿费', '办公费', '福利费', '宣传及推广费', '宣传及广告费', '其他个人费用', '其他非本人费用']
const showTypePopup = ref(false)
let currentTypeCardIdx = 0

function onSelectType(ci: number) {
  currentTypeCardIdx = ci
  showTypePopup.value = true
}

function onTypeSelect(typeName: string) {
  const card = cards.value[currentTypeCardIdx]
  card.reimbursementType = typeName
  showTypePopup.value = false
}

// ========== 客户选择弹窗 ==========
const showCustomerPopup = ref(false)
const customerLoading = ref(false)
const customerList = ref<CustomerItem[]>([])
/** 当前正在编辑的卡片索引 */
let currentCardIdx = 0

async function onSelectCustomer(ci: number) {
  currentCardIdx = ci
  showCustomerPopup.value = true
  if (customerList.value.length === 0) {
    customerLoading.value = true
    try {
      customerList.value = await getRelatedCustomers()
    } catch {
      // 错误已在 request 层统一处理
    } finally {
      customerLoading.value = false
    }
  }
}

function onCustomerSelect(customer: CustomerItem) {
  const card = cards.value[currentCardIdx]
  card.customerId = customer.id
  card.customerName = customer.name
  showCustomerPopup.value = false
}

// ========== 文件上传 ==========
async function onUpload(ci: number, attType: string) {
  try {
    const res = await Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })
    const filePath = res.tempFilePaths[0]
    Taro.showLoading({ title: '上传中...' })
    const uploadRes = await uploadFile(filePath, 'reimburse')
    Taro.hideLoading()

    const file: UploadedFile = {
      fileName: uploadRes.fileName,
      fileUrl: uploadRes.url,
      fileExt: uploadRes.mimeType,
      fileSize: uploadRes.fileSize,
    }

    const card = cards.value[ci]
    const keyMap: Record<string, keyof Pick<CardData, 'mileageStartFile' | 'mileageEndFile' | 'paymentVoucherFile' | 'invoiceFile'>> = {
      mileage_start: 'mileageStartFile',
      mileage_end: 'mileageEndFile',
      payment_voucher: 'paymentVoucherFile',
      invoice: 'invoiceFile',
    }
    const key = keyMap[attType]
    if (key) {
      card[key] = file as unknown as (UploadedFile & null)
    }

    Taro.showToast({ title: '上传成功', icon: 'success' })
  } catch (err) {
    Taro.hideLoading()
    if ((err as { errMsg?: string }).errMsg?.includes('cancel')) return
    Taro.showToast({ title: '上传失败', icon: 'none' })
  }
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

  /** 根据卡片上传的文件构建附件列表 */
  function buildAttachments(card: CardData): AttachmentInput[] {
    const list: AttachmentInput[] = []
    const sources: { file: UploadedFile | null; type: string }[] = [
      { file: card.mileageStartFile, type: 'mileage_start' },
      { file: card.mileageEndFile, type: 'mileage_end' },
      { file: card.paymentVoucherFile, type: 'payment_voucher' },
      { file: card.invoiceFile, type: 'invoice' },
    ]
    for (const s of sources) {
      if (s.file) {
        list.push({
          attachmentType: s.type,
          fileName: s.file.fileName,
          fileUrl: s.file.fileUrl,
          fileExt: s.file.fileExt,
          fileSize: s.file.fileSize,
        })
      }
    }
    return list
  }

  const items: ReimbursementItemInput[] = cards.value.map(card => ({
    reimbursementType: card.reimbursementType,
    amount: Math.round(Number(card.amount) * 100),
    description: '',
    customerId: card.customerId || 0,
    customerName: card.customerName || '',
    expenseDepartmentId: card.expenseDepartmentId || 0,
    startMileage: Number(card.startMileage) || 0,
    endMileage: Number(card.endMileage) || 0,
    extraPayload: {},
    attachments: buildAttachments(card),
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

/* 上传预览图 */
.ar-upload-preview {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

/* 客户选择弹窗 */
.customer-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
}

.customer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
  flex-shrink: 0;
}

.customer-header-btn {
  font-size: 28rpx;
  color: #9292A5;
}

.customer-header-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.customer-header-confirm {
  color: #37AE7E;
}

.customer-list {
  flex: 1;
  padding: 0 40rpx;
  overflow-y: auto;
}

.customer-loading,
.customer-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  font-size: 28rpx;
  color: #9292A5;
}

.customer-row {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
}

.customer-name {
  font-size: 30rpx;
  color: #1A1D24;
}

.customer-divider {
  height: 1rpx;
  background: #F4F4F4;
}

/* 报销类型选择弹窗 */
.type-popup {
  display: flex;
  flex-direction: column;
  max-height: 75vh;
  background: #FFFFFF;
}

.type-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
  flex-shrink: 0;
}

.type-header-btn {
  font-size: 28rpx;
  color: #9292A5;
}

.type-header-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.type-header-confirm {
  color: #37AE7E;
}

.type-list {
  padding: 0 40rpx 40rpx;
  overflow-y: auto;
}

.type-row {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
}

.type-name {
  font-size: 30rpx;
  color: #1A1D24;
}

.type-divider {
  height: 1rpx;
  background: #F4F4F4;
}

/* 部门级联选择器（复用 expense 页面样式） */
.filter-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filter-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 40rpx;
  position: relative;
}

.filter-header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.filter-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.filter-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24rpx;
}

.filter-footer {
  display: flex;
  gap: 28rpx;
  padding: 20rpx 40rpx;
}

.filter-footer-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-footer-clear {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.filter-footer-clear-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
}

.filter-footer-submit {
  background: linear-gradient(270deg, rgba(102, 220, 166, 1) 0%, rgba(88, 188, 150, 1) 100%);
}

.filter-footer-submit-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}

.region-section {
  display: flex;
  flex-direction: column;
}

.region-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4rpx;
  margin-bottom: 24rpx;
}

.region-breadcrumb-item {
  font-size: 28rpx;
  color: #9292A5;
}

.region-breadcrumb-item--active {
  color: #37AE7E;
  font-weight: 500;
}

.region-breadcrumb-sep {
  font-size: 28rpx;
  color: #9292A5;
  margin: 0 4rpx;
}

.region-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.region-loading-text {
  font-size: 26rpx;
  color: #9292A5;
}

.org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.org-tag {
  width: 208rpx;
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  box-sizing: border-box;
  text-align: center;
}

.org-tag--active {
  background: #EDFAF5;
}

.org-tag-text {
  font-size: 26rpx;
  color: #62687D;
}

.org-tag-text--active {
  color: #37AE7E;
}
</style>
