<template>
  <view class="rd-page">
    <view style="position: relative;">
      <view class="rd-bg" :class="'rd-bg--' + approvalStatus" />
      <view class="rd-nav-bar">
        <view class="rd-nav-back" @tap="goBack">
          <image class="rd-nav-back-icon" :src="iconBack" mode="aspectFit" />
        </view>
        <text class="rd-nav-title">费用详情</text>
        <view class="rd-nav-right" />
      </view>
    </view>
    <view style="height: 176rpx;width: 100%;" />
    <scroll-view class="rd-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="rd-info-card">
        <view class="rd-info-field">
          <text class="rd-info-label">费用编号</text>
          <text class="rd-info-value">{{ detail.expenseNo }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">费用承担部门</text>
          <text class="rd-info-value">{{ detail.expenseDepartmentName || '-' }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">关联客户</text>
          <text class="rd-info-value">{{ detail.customerName || '-' }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">收款账户</text>
          <text class="rd-info-value">{{ detail.payeeAccount || '-' }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">申请金额</text>
          <text class="rd-info-value rd-info-value--price">{{ formatAmount(detail.amount) }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">费用项目</text>
          <text class="rd-info-value">{{ EXPENSE_ITEM_MAP[detail.expenseItem] || detail.expenseItem }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">费用说明</text>
          <text class="rd-info-value">{{ detail.description || '-' }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-info-field">
          <text class="rd-info-label">发起时间</text>
          <text class="rd-info-value">{{ formatDate(detail.submittedAt || detail.createdAt) }}</text>
        </view>
      </view>

      <view class="rd-approval-card">
        <view class="rd-approval-header">
          <text class="rd-approval-title">审批记录</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-timeline">
          <view v-for="(node, nIdx) in timelineNodes" :key="nIdx" class="rd-timeline-item">
            <view class="rd-timeline-dot-col">
              <view class="rd-timeline-line" :class="node.topLineClass" />
              <view class="rd-timeline-dot" :class="node.dotClass" />
              <view class="rd-timeline-line" :class="node.bottomLineClass" />
            </view>
            <view class="rd-timeline-content" :class="{ 'rd-timeline-content--dim': node.isDim }">
              <text class="rd-timeline-text">{{ node.nodeName }}</text>
              <view v-for="(approver, aIdx) in node.approvers" :key="aIdx" class="rd-approval-box">
                <view v-if="aIdx === 0 && node.approvalRule" class="rd-ap-field">
                  <text class="rd-ap-label">审批原则</text>
                  <text class="rd-ap-value">{{ node.approvalRule === 'all' ? '全部审批通过即通过' : '任一通过即通过' }}</text>
                </view>
                <view v-if="aIdx === 0 && node.approvalRule" class="rd-ap-dash" />
                <view class="rd-ap-field">
                  <text class="rd-ap-label">审批人</text>
                  <text class="rd-ap-value">{{ approver.name }}</text>
                </view>
                <view class="rd-ap-field">
                  <text class="rd-ap-label">审批状态</text>
                  <text class="rd-ap-value" :class="{ 'rd-ap-value--reject': approver.status === 'rejected' }">
                    {{ APPROVER_STATUS_MAP[approver.status] || approver.status }}
                  </text>
                </view>
                <view v-if="approver.status === 'rejected' && approver.comment" class="rd-ap-field">
                  <text class="rd-ap-label">驳回原因</text>
                  <text class="rd-ap-value">{{ approver.comment }}</text>
                </view>
                <view v-if="approver.operatedAt" class="rd-ap-field">
                  <text class="rd-ap-label">审批时间</text>
                  <text class="rd-ap-value">{{ formatDate(approver.operatedAt) }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="rd-actions">
      <view v-if="detail.canCancel" class="rd-btn rd-btn--cancel" @tap="onCancel">撤销申请</view>
      <view v-if="detail.canEdit" class="rd-btn rd-btn--submit" @tap="onEdit">编辑</view>
    </view>

    <!-- 编辑费用弹窗 -->
    <view v-if="showEditPopup">
      <nut-popup v-model:visible="showEditPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }"
        :z-index="2100" portal-disable>
        <view class="exp-add-popup">
          <view class="exp-add-header">
            <text class="exp-add-header-btn" @tap="showEditPopup = false">取消</text>
            <text class="exp-add-header-title">编辑费用</text>
            <text class="exp-add-header-btn exp-add-header-confirm" @tap="onSubmitEdit">确认</text>
          </view>
          <scroll-view class="exp-add-body" scroll-y>
            <view class="exp-add-field">
              <text class="exp-add-label">费用编号</text>
              <text class="exp-add-value">{{ editForm.expenseNo || '自动生成' }}</text>
            </view>
            <view class="exp-add-divider" />
            <view class="exp-add-field">
              <text class="exp-add-label">费用承担部门</text>
              <view class="exp-add-value-row" @tap="onSelectDept">
                <text :class="editForm.dept ? 'exp-add-value' : 'exp-add-value exp-add-value--placeholder'">{{
                  editForm.dept || '请选择' }}</text>
                <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
              </view>
            </view>
            <view class="exp-add-divider" />
            <view class="exp-add-field">
              <text class="exp-add-label">申请金额</text>
              <view class="exp-add-value-row">
                <input class="exp-add-input" v-model="editForm.amount" placeholder="请输入"
                  placeholder-style="color:#BBBEC2;font-size:30rpx" type="digit" />
                <text class="exp-add-unit">元</text>
              </view>
            </view>
            <view class="exp-add-divider" />
            <view class="exp-add-field">
              <text class="exp-add-label">费用项目</text>
              <view class="exp-add-value-row" @tap="onSelectItem">
                <text class="exp-add-value">{{ editForm.itemLabel || '请选择' }}</text>
                <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
              </view>
            </view>
            <view class="exp-add-divider" />
            <view class="exp-add-field">
              <text class="exp-add-label">关联客户</text>
              <view class="exp-add-value-row" @tap="onSelectCustomer">
                <text :class="editForm.customer ? 'exp-add-value' : 'exp-add-value exp-add-value--placeholder'">{{
                  editForm.customer || '请选择' }}</text>
                <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
              </view>
            </view>
            <view class="exp-add-divider" />
            <view class="exp-add-field">
              <text class="exp-add-label">费用说明</text>
              <input class="exp-add-input exp-add-input--right" v-model="editForm.remark" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
            </view>
            <view class="exp-add-divider" />
            <view class="exp-add-field">
              <text class="exp-add-label">收款账户</text>
              <input class="exp-add-input exp-add-input--right" v-model="editForm.account" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
            </view>
          </scroll-view>
        </view>
      </nut-popup>
    </view>
    <!-- 部门选择 -->
    <DeptSelectionPopup v-model="showDeptPopup" title="选择部门" @confirm="onDeptConfirm" />

    <!-- 客户选择 -->
    <CustomerSelectPopup v-model="showCustomerPopup" @select="onCustomerSelect" />

    <!-- 费用项目选择 -->
    <nut-popup v-model:visible="showItemPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }"
      :z-index="2200" portal-disable>
      <view class="exp-item-popup">
        <view class="exp-add-header">
          <text class="exp-add-header-btn" @tap="showItemPopup = false">取消</text>
          <text class="exp-add-header-title">选择费用项目</text>
          <text class="exp-add-header-btn exp-add-header-confirm" @tap="showItemPopup = false">确认</text>
        </view>
        <view class="exp-item-list">
          <template v-for="(it, idx) in EXPENSE_ITEM_OPTIONS" :key="it.value">
            <view class="exp-item-row" @tap="onItemSelect(it)">
              <text class="exp-item-text">{{ it.label }}</text>
              <view class="exp-item-radio" :class="{ 'exp-item-radio--checked': editForm.item === it.value }">
                <view v-if="editForm.item === it.value" class="exp-item-radio-dot" />
              </view>
            </view>
            <view v-if="idx < EXPENSE_ITEM_OPTIONS.length - 1" class="exp-add-divider" />
          </template>
        </view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import Taro from '@tarojs/taro'
import {
  getExpenseDetail, cancelExpense, updateExpense,
  EXPENSE_ITEM_MAP, EXPENSE_ITEM_OPTIONS,
  type ExpenseDetailResponse,
} from '@/api/expense'
import type { CustomerItem } from '@/api/customer'
import DeptSelectionPopup from '@/components/DeptSelectionPopup.vue'
import CustomerSelectPopup from '@/components/CustomerSelectPopup.vue'
import iconBack from '@/assets/dev/icon-back.png'
import iconArrow from '@/assets/dev/rightArror.png'

const APPROVER_STATUS_MAP: Record<string, string> = {
  pending: '待审批',
  approved: '审批通过',
  rejected: '审批驳回',
}

const detail = ref<ExpenseDetailResponse>({
  id: 0,
  expenseNo: '',
  amount: 0,
  expenseItem: '',
  expenseDepartmentId: 0,
  expenseDepartmentName: '',
  customerId: 0,
  customerName: '',
  description: '',
  payeeAccount: '',
  status: '',
  submittedAt: '',
  createdAt: '',
  applicantId: 0,
  applicantName: '',
  companyId: 0,
  departmentId: 0,
  latestRejectReason: '',
  canApprove: false,
  canCancel: false,
  canEdit: false,
  attachments: [],
  approvalFlow: { nodes: [] },
  approvalHistory: [],
})

const approvalStatus = computed(() => {
  const s = detail.value.status
  if (s === 'approval_rejected') return 'rejected'
  if (s === 'approval_passed') return 'approved'
  return 'pending'
})

const timelineNodes = computed(() => {
  const nodes = detail.value.approvalFlow?.nodes || []
  const result = nodes
    .sort((a, b) => b.nodeNo - a.nodeNo)
    .map((node, idx, arr) => {
      const first = idx === 0
      const last = idx === arr.length - 1
      const hasApproval = node.approvers.some(a => a.status === 'approved' || a.status === 'rejected')
      return {
        nodeName: node.nodeName,
        approvalRule: node.approvalRule,
        approvers: node.approvers,
        isDim: !hasApproval && !first,
        topLineClass: first ? 'rd-timeline-line--top' : 'rd-timeline-line--fill',
        dotClass: hasApproval ? 'rd-timeline-dot--solid' : 'rd-timeline-dot--empty',
        bottomLineClass: last ? 'rd-timeline-line--none' : 'rd-timeline-line--fill',
      }
    })
  result.push({
    nodeName: '发起审批',
    approvalRule: '',
    approvers: [],
    isDim: result.length > 0,
    topLineClass: result.length > 0 ? 'rd-timeline-line--fill' : 'rd-timeline-line--top',
    dotClass: 'rd-timeline-dot--empty',
    bottomLineClass: 'rd-timeline-line--none',
  })
  return result
})

function formatAmount(cent: number): string {
  if (cent === undefined || cent === null) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return dateStr.replace(/T/, ' ').replace(/\..*/, '').slice(0, 19)
}

const goBack = () => {
  Taro.navigateBack()
}

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  if (!id) return
  try {
    const res = await getExpenseDetail(id)
    detail.value = res
  } catch {
    // 错误已在 request 层统一处理
  }
}

async function onCancel() {
  try {
    const res = await Taro.showModal({ title: '提示', content: '确定要撤销该费用申请吗？' })
    if (!res.confirm) return
    await cancelExpense(detail.value.id)
    Taro.showToast({ title: '已撤销', icon: 'success' })
    fetchDetail()
  } catch {
    // 用户取消或请求失败
  }
}

// 编辑弹窗
const showEditPopup = ref(false)
const showDeptPopup = ref(false)
const showCustomerPopup = ref(false)
const showItemPopup = ref(false)

const editForm = reactive({
  expenseNo: '',
  dept: '', deptId: 0,
  amount: '',
  item: '', itemLabel: '',
  customer: '', customerId: 0,
  remark: '',
  account: '',
})

function onSelectDept() {
  showDeptPopup.value = true
}

function onDeptConfirm(payload: { id: number; name: string }) {
  editForm.deptId = payload.id
  editForm.dept = payload.name
}

function onSelectCustomer() {
  showCustomerPopup.value = true
}

function onCustomerSelect(customer: CustomerItem) {
  editForm.customerId = customer.id
  editForm.customer = customer.name
}

function onSelectItem() {
  showItemPopup.value = true
}

function onItemSelect(it: { value: string; label: string }) {
  editForm.item = it.value
  editForm.itemLabel = it.label
}

function onEdit() {
  editForm.expenseNo = detail.value.expenseNo
  editForm.dept = detail.value.expenseDepartmentName || ''
  editForm.deptId = detail.value.expenseDepartmentId || 0
  editForm.amount = detail.value.amount ? String(detail.value.amount / 100) : ''
  editForm.item = detail.value.expenseItem || ''
  editForm.itemLabel = EXPENSE_ITEM_MAP[detail.value.expenseItem] || ''
  editForm.customer = detail.value.customerName || ''
  editForm.customerId = detail.value.customerId || 0
  editForm.remark = detail.value.description || ''
  editForm.account = detail.value.payeeAccount || ''
  showEditPopup.value = true
}

async function onSubmitEdit() {
  if (!editForm.item) {
    Taro.showToast({ title: '请选择费用项目', icon: 'none' })
    return
  }
  if (!editForm.amount || Number(editForm.amount) <= 0) {
    Taro.showToast({ title: '请输入申请金额', icon: 'none' })
    return
  }
  if (!editForm.remark) {
    Taro.showToast({ title: '请输入费用说明', icon: 'none' })
    return
  }
  if (!editForm.account) {
    Taro.showToast({ title: '请输入收款账户', icon: 'none' })
    return
  }
  try {
    await updateExpense(detail.value.id, {
      amount: Math.round(Number(editForm.amount) * 100),
      expenseDepartmentId: editForm.deptId || 0,
      expenseItem: editForm.item,
      customerId: editForm.customerId || 0,
      customerName: editForm.customer || '',
      description: editForm.remark,
      payeeAccount: editForm.account,
      attachments: [],
    })
    Taro.showToast({ title: '修改成功', icon: 'success' })
    showEditPopup.value = false
    fetchDetail()
  } catch {
    // 错误已在 request 层处理
  }
}

fetchDetail()
</script>

<style>
.rd-page {
  min-height: 100vh;
  background: #F5F7F9;
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

.rd-info-value--price {
  font-weight: 600;
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

/* 编辑弹窗 */
.exp-add-popup {
  display: flex;
  flex-direction: column;
  max-height: 75vh;
  padding: 40rpx 0 0;
  background: #FFFFFF;
}

.exp-add-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 0 40rpx 40rpx;
}

.exp-add-header-btn {
  font-size: 32rpx;
  color: #828593;
}

.exp-add-header-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}

.exp-add-header-confirm {
  color: #37AE7E;
}

.exp-add-body {
  padding: 0 40rpx 40rpx;
  box-sizing: border-box;
}

.exp-add-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exp-add-label {
  font-size: 30rpx;
  color: #505361;
  flex-shrink: 0;
}

.exp-add-value-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.exp-add-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.exp-add-value--placeholder {
  color: #BBBEC2;
}

.exp-add-unit {
  font-size: 30rpx;
  color: #9292A5;
}

.exp-add-input {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
  width: 240rpx;
}

.exp-add-input--right {
  text-align: right;
}

.exp-add-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.exp-add-divider {
  height: 1rpx;
  background: #F4F4F4;
  margin: 28rpx 0;
}

.exp-item-popup {
  display: flex;
  flex-direction: column;
  max-height: 75vh;
  padding: 40rpx 0 0;
  background: #FFFFFF;
}

.exp-item-list {
  padding: 0 40rpx 40rpx;
}

.exp-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exp-item-text {
  font-size: 30rpx;
  color: #1A1D24;
}

.exp-item-radio {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.exp-item-radio--checked {
  border-color: #37AE7E;
}

.exp-item-radio-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #37AE7E;
}
</style>
