<template>
  <view class="reimb-page">
    <NavBar title="费用申请" />
    <view class="reimb-wrap">
      <view class="reimb-search-row">
        <view class="reimb-search-box">
          <input class="reimb-search-input" v-model="keyword" placeholder="请输入费用编号/关联客户" placeholder-style="color:#9292A5" @confirm="onSearch" />
          <image class="reimb-search-icon" :src="iconSearch" mode="aspectFit" @tap="onSearch" />
        </view>
        <view class="reimb-btn" @tap="onFilter">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="reimb-btn" @tap="onAdd">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>
      <scroll-view class="reimb-scroll" scroll-y :enhanced="true" :show-scrollbar="false" @scrolltolower="onLoadMore">
        <view v-if="loading" class="reimb-loading">加载中...</view>
        <view v-else-if="expenseList.length === 0" class="reimb-empty">
          <text class="reimb-empty-text">暂无费用申请记录</text>
        </view>
        <view v-else v-for="item in expenseList" :key="item.id" class="reimb-card">
          <view class="reimb-card-top">
            <view class="reimb-card-left">
              <text class="reimb-card-no">{{ item.expenseNo }}</text>
            </view>
            <view class="reimb-badge" :class="'reimb-badge--' + getBadgeType(item.status)">
              <text class="reimb-badge-text">{{ EXPENSE_STATUS_MAP[item.status] || item.status }}</text>
            </view>
          </view>
          <view class="reimb-card-info">
            <view class="reimb-info-col">
              <text class="reimb-info-label">申请金额</text>
              <text class="reimb-info-value">{{ formatAmount(item.amount) }}</text>
            </view>
            <view class="reimb-info-col">
              <text class="reimb-info-label">费用项目</text>
              <text class="reimb-info-value">{{ EXPENSE_ITEM_MAP[item.expenseItem] || item.expenseItem }}</text>
            </view>
          </view>
          <view class="reimb-card-actions">
            <view class="od-action-btn"
              :class="{ 'od-action-btn--cancel': item.canCancel, 'od-action-btn--cancel-disabled': !item.canCancel }"
              @tap="item.canCancel && onCancel(item)">
              取消费用申请</view>
            <view class="od-action-btn od-action-btn--view" @tap="onView(item)">查看费用申请</view>
          </view>
        </view>
        <view v-if="expenseList.length > 0" class="reimb-load-more">
          <text v-if="hasMore" @tap="onLoadMore">加载更多</text>
          <text v-else style="color:#BBBEC2">已加载全部</text>
        </view>
      </scroll-view>
    </view>

    <!-- 新增费用弹窗 -->
    <nut-popup v-model:visible="showAddPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100" portal-disable>
      <view class="exp-add-popup">
        <view class="exp-add-header">
          <text class="exp-add-header-btn" @tap="showAddPopup = false">取消</text>
          <text class="exp-add-header-title">申请费用</text>
          <text class="exp-add-header-btn exp-add-header-confirm" @tap="onSubmitAdd">确认</text>
        </view>
        <scroll-view class="exp-add-body" scroll-y>
          <view class="exp-add-field">
            <text class="exp-add-label">费用编号</text>
            <text class="exp-add-value exp-add-value--placeholder">自动生成，无需输入</text>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">费用承担部门</text>
            <view class="exp-add-value-row" @tap="onSelectDept">
              <text :class="addForm.dept ? 'exp-add-value' : 'exp-add-value exp-add-value--placeholder'">{{ addForm.dept || '请选择' }}</text>
              <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
            </view>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">申请金额</text>
            <view class="exp-add-value-row">
              <input class="exp-add-input" v-model="addForm.amount" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" type="digit" />
              <text class="exp-add-unit">元</text>
            </view>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">费用项目</text>
            <view class="exp-add-value-row" @tap="onSelectItem">
              <text class="exp-add-value">{{ addForm.itemLabel || '请选择' }}</text>
              <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
            </view>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">关联客户</text>
            <view class="exp-add-value-row" @tap="onSelectCustomer">
              <text :class="addForm.customer ? 'exp-add-value' : 'exp-add-value exp-add-value--placeholder'">{{ addForm.customer || '请选择' }}</text>
              <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
            </view>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">费用说明</text>
            <input class="exp-add-input exp-add-input--right" v-model="addForm.remark" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">收款账户</text>
            <input class="exp-add-input exp-add-input--right" v-model="addForm.account" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx;text-align:right" />
          </view>
        </scroll-view>
      </view>
    </nut-popup>

    <!-- 费用项目选择弹窗 -->
    <nut-popup v-model:visible="showItemPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2200" portal-disable>
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
              <view class="exp-item-radio" :class="{ 'exp-item-radio--checked': addForm.item === it.value }">
                <view v-if="addForm.item === it.value" class="exp-item-radio-dot" />
              </view>
            </view>
            <view v-if="idx < EXPENSE_ITEM_OPTIONS.length - 1" class="exp-add-divider" />
          </template>
        </view>
      </view>
    </nut-popup>

    <!-- 客户选择弹窗 -->
    <CustomerSelectPopup v-model="showCustomerPopup" @select="onCustomerSelect" />

    <!-- 部门选择弹窗 -->
    <DeptSelectionPopup v-model="showDeptPopup" title="选择部门" @confirm="onDeptConfirm" />

    <!-- 筛选弹窗 -->
    <nut-popup v-model:visible="showFilter" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" portal-disable safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">全部筛选</text>
        </view>
        <view class="filter-body">
          <view class="filter-sidebar">
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 1 }" @tap="filterIdx = 1">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 1 }">费用状态</text>
            </view>
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 2 }" @tap="filterIdx = 2">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 2 }">发起时间</text>
            </view>
          </view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view v-if="filterIdx === 1" class="filter-tags-section">
              <text class="filter-section-title">审批状态</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbStatus.includes('待审批') }" @tap="toggleFilterTag('待审批')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes('待审批') }">待审批</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbStatus.includes('审批通过') }" @tap="toggleFilterTag('审批通过')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes('审批通过') }">审批通过</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbStatus.includes('审批驳回') }" @tap="toggleFilterTag('审批驳回')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes('审批驳回') }">审批驳回</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 2" class="filter-tags-section">
              <text class="filter-section-title">发起时间</text>
              <view class="filter-date-row">
                <view class="filter-date-box" @tap="openDatePopup('start')">
                  <text class="filter-date-box-text" :class="{ 'filter-date-box-text--set': startTime }">{{ startTime || '开始时间' }}</text>
                </view>
                <text class="filter-date-sep">至</text>
                <view class="filter-date-box" @tap="openDatePopup('end')">
                  <text class="filter-date-box-text" :class="{ 'filter-date-box-text--set': endTime }">{{ endTime || '结束时间' }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="filter-footer">
          <view class="filter-footer-btn filter-footer-clear" @tap="clearFilter">
            <text class="filter-footer-clear-text">清空选择</text>
          </view>
          <view class="filter-footer-btn filter-footer-submit" @tap="onFilterConfirm">
            <text class="filter-footer-submit-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <!-- 日期选择弹窗 -->
    <nut-popup v-model:visible="showDatePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100" portal-disable safe-area-inset-bottom>
      <view class="date-popup">
        <view class="filter-header">
          <text class="filter-header-btn" @tap="showDatePopup = false">取消</text>
          <text class="filter-header-title">{{ datePopupTitle }}</text>
          <text class="filter-header-btn filter-header-confirm" @tap="onDateConfirm">确认</text>
        </view>
        <picker-view class="date-picker-body" :value="pickerValue" indicator-style="height: 68rpx;" @change="onPickerChange">
          <picker-view-column>
            <view v-for="y in years" :key="y" class="picker-item">{{ y }}</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="m in months" :key="m" class="picker-item">{{ m < 10 ? '0' + m : m }}</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="d in days" :key="d" class="picker-item">{{ d < 10 ? '0' + d : d }}</view>
          </picker-view-column>
        </picker-view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import DeptSelectionPopup from '@/components/DeptSelectionPopup.vue'
import CustomerSelectPopup from '@/components/CustomerSelectPopup.vue'
import {
  getExpenseList, createExpense, cancelExpense,
  EXPENSE_STATUS_MAP, EXPENSE_STATUS_BADGE_MAP, EXPENSE_ITEM_MAP, EXPENSE_ITEM_OPTIONS,
  type ExpenseListItem,
} from '@/api/expense'
import type { CustomerItem } from '@/api/customer'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'
import iconArrow from '@/assets/dev/rightArror.png'

// 列表
const keyword = ref('')
const loading = ref(false)
const expenseList = ref<ExpenseListItem[]>([])
const page = ref(1)
const pageSize = 20
const hasMore = ref(true)

function formatAmount(cent: number): string {
  if (cent === undefined || cent === null) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function getBadgeType(status: string): string {
  return EXPENSE_STATUS_BADGE_MAP[status] || 'gray'
}

async function fetchList(reset = false) {
  if (loading.value) return
  if (reset) {
    page.value = 1
    hasMore.value = true
  }
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, pageSize }
    if (keyword.value) {
      params.expenseNo = keyword.value
    }
    if (!filterTags.reimbStatus.includes('全部')) {
      const statusMap: Record<string, string> = { '待审批': 'pending_approval', '审批通过': 'approval_passed', '审批驳回': 'approval_rejected' }
      params.status = statusMap[filterTags.reimbStatus[0]]
    }
    if (startTime.value) params.submittedAtStart = startTime.value
    if (endTime.value) params.submittedAtEnd = endTime.value

    const res = await getExpenseList(params as Record<string, unknown>)
    if (reset) {
      expenseList.value = res.items || []
    } else {
      expenseList.value = [...expenseList.value, ...(res.items || [])]
    }
    hasMore.value = expenseList.value.length < res.total
  } catch {
    // 错误已在 request 层统一处理
  } finally {
    loading.value = false
  }
}

function onSearch() { fetchList(true) }

function onLoadMore() {
  if (!hasMore.value || loading.value) return
  page.value++
  fetchList(false)
}

function onView(item: ExpenseListItem) {
  Taro.navigateTo({ url: '/subpackages/dev/mine/expense/detail/index?id=' + item.id })
}

async function onCancel(item: ExpenseListItem) {
  try {
    const res = await Taro.showModal({ title: '提示', content: '确定要撤销该费用申请吗？' })
    if (!res.confirm) return
    await cancelExpense(item.id)
    Taro.showToast({ title: '已撤销', icon: 'success' })
    fetchList(true)
  } catch {
    // 用户取消或请求失败
  }
}

// 新增弹窗
const showAddPopup = ref(false)
const showItemPopup = ref(false)

const addForm = reactive({
  dept: '',
  deptId: 0,
  amount: '',
  item: '',
  itemLabel: '',
  customer: '',
  customerId: 0,
  remark: '',
  account: '',
})

function onAdd() {
  showAddPopup.value = true
}

// 部门级联选择
const showDeptPopup = ref(false)

function onDeptConfirm(payload: { id: number; name: string }) {
  addForm.deptId = payload.id
  addForm.dept = payload.name
}

function onSelectDept() {
  showDeptPopup.value = true
}

function onSelectItem() {
  showItemPopup.value = true
}

// 客户选择
const showCustomerPopup = ref(false)

function onSelectCustomer() {
  showCustomerPopup.value = true
}

function onCustomerSelect(item: CustomerItem) {
  addForm.customerId = item.id
  addForm.customer = item.name
}

function onItemSelect(it: { value: string; label: string }) {
  addForm.item = it.value
  addForm.itemLabel = it.label
}

async function onSubmitAdd() {
  if (!addForm.item) {
    Taro.showToast({ title: '请选择费用项目', icon: 'none' })
    return
  }
  if (!addForm.amount || Number(addForm.amount) <= 0) {
    Taro.showToast({ title: '请输入申请金额', icon: 'none' })
    return
  }
  if (!addForm.remark) {
    Taro.showToast({ title: '请输入费用说明', icon: 'none' })
    return
  }
  if (!addForm.account) {
    Taro.showToast({ title: '请输入收款账户', icon: 'none' })
    return
  }
  try {
    await createExpense({
      amount: Math.round(Number(addForm.amount) * 100),
      expenseDepartmentId: addForm.deptId || 0,
      expenseItem: addForm.item,
      customerId: addForm.customerId || 0,
      customerName: addForm.customer || '',
      description: addForm.remark,
      payeeAccount: addForm.account,
      attachments: [],
    })
    Taro.showToast({ title: '提交成功', icon: 'success' })
    showAddPopup.value = false
    // 重置表单
    addForm.dept = ''
    addForm.deptId = 0
    addForm.amount = ''
    addForm.item = ''
    addForm.itemLabel = ''
    addForm.customer = ''
    addForm.customerId = 0
    addForm.remark = ''
    addForm.account = ''
    fetchList(true)
  } catch {
    // 错误已在 request 层统一处理
  }
}

// 筛选
const showFilter = ref(false)
const filterIdx = ref(1)
const showDatePopup = ref(false)
const datePickerTarget = ref('start')

const filterTags = reactive({
  reimbStatus: ['全部'],
})
const startTime = ref('')
const endTime = ref('')

const datePopupTitle = computed(() => datePickerTarget.value === 'start' ? '选择开始时间' : '选择结束时间')

const now = new Date()
const currentYear = now.getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate()
const days = computed(() => {
  const y = years[pickerValue.value[0]]
  const m = months[pickerValue.value[1]]
  return Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1)
})

const pickerValue = ref([2, now.getMonth(), now.getDate() - 1])

function toggleFilterTag(tag: string) {
  const arr = filterTags.reimbStatus
  if (tag === '全部') {
    filterTags.reimbStatus = ['全部']
    return
  }
  if (arr.includes('全部')) {
    filterTags.reimbStatus = [tag]
  } else {
    const idx = arr.indexOf(tag)
    if (idx >= 0) {
      arr.splice(idx, 1)
      if (arr.length === 0) {
        filterTags.reimbStatus = ['全部']
      }
    } else {
      arr.push(tag)
    }
  }
}

function onFilter() { showFilter.value = true }

function clearFilter() {
  filterTags.reimbStatus = ['全部']
  startTime.value = ''
  endTime.value = ''
}

function onFilterConfirm() {
  showFilter.value = false
  fetchList(true)
}

function openDatePopup(type: string) {
  datePickerTarget.value = type
  showDatePopup.value = true
}

function onDateConfirm() {
  const y = years[pickerValue.value[0]]
  const m = months[pickerValue.value[1]]
  const d = days.value[pickerValue.value[2]]
  const dateStr = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
  if (datePickerTarget.value === 'start') {
    startTime.value = dateStr
  } else {
    endTime.value = dateStr
  }
  showDatePopup.value = false
}

function onPickerChange(e: { detail: { value: number[] } }) {
  pickerValue.value = e.detail.value
}

fetchList(true)
</script>

<style>
.reimb-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.reimb-wrap {
  padding: 32rpx 40rpx;
}

.reimb-scroll {
  width: 100%;
  white-space: nowrap;
  padding-bottom: 0;
  border-bottom: 1rpx solid #E5E6EB;
}

.reimb-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.reimb-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  height: 68rpx;
  background: #FFFFFF;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.reimb-search-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}

.reimb-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.reimb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.reimb-loading,
.reimb-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.reimb-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.reimb-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.reimb-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reimb-card-left {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.reimb-card-no {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.reimb-card-sub {
  font-size: 32rpx;
  font-weight: 500;
  color: #62687D;
}

.reimb-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rpx 16rpx;
  border-radius: 6rpx;
  flex-shrink: 0;
}

.reimb-badge--yellow {
  background: #FFF7E6;
  color: #E6A23C;
}

.reimb-badge--red {
  background: #FFF4F4;
  color: #F53F3F;
}

.reimb-badge--green {
  background: #EDFAF5;
  color: #37AE7E;
}

.reimb-badge--gray {
  background: #F5F5F5;
  color: #9292A5;
}

.reimb-badge-text {
  font-size: 24rpx;
}

.reimb-card-info {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
  background: #F9FAFB;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  margin: 28rpx 0;
}

.reimb-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.reimb-info-label {
  font-size: 26rpx;
  color: #62687D;
}

.reimb-info-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.reimb-card-actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.od-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 0;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.od-action-btn--cancel {
  background: #FFF4F4;
  border: 1rpx solid #FFE8E8;
  color: #F53F3F;
}

.od-action-btn--cancel-disabled {
  background: transparent;
  border: 1rpx solid #E8EAF3;
  color: #BBBEC2;
}

.od-action-btn--view {
  background: #FFFFFF;
  border: 1rpx solid #B1E9D3;
  color: #37AE7E;
}

.reimb-load-more {
  text-align: center;
  font-size: 26rpx;
  color: #5CC79C;
  padding: 20rpx 0;
}

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

.filter-sidebar {
  width: 260rpx;
  background: #F6F7FB;
  flex-shrink: 0;
}

.filter-sidebar-item {
  padding: 20rpx 40rpx;
}

.filter-sidebar-item--active {
  background: #FFFFFF;
  border-radius: 6rpx;
}

.filter-sidebar-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #62687D;
}

.filter-sidebar-text--active {
  color: #37AE7E;
}

.filter-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24rpx;
}

.filter-tags-section {
  padding: 0;
}

.filter-section-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
  display: block;
  margin: 6rpx 0 24rpx 0;
}

.filter-section-title:first-child {
  margin-top: 0;
}

.filter-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.filter-tag {
  width: 208rpx;
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  box-sizing: border-box;
  text-align: center;
}

.filter-tag--active {
  background: #EDFAF5;
}

.filter-tag-text {
  font-size: 26rpx;
  color: #62687D;
}

.filter-tag-text--active {
  color: #37AE7E;
}

.filter-date-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.filter-date-box {
  flex: 1;
  height: 60rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-date-box-text {
  font-size: 26rpx;
  color: #BBBEC2;
}

.filter-date-box-text--set {
  color: #1A1D24;
}

.filter-date-sep {
  font-size: 26rpx;
  color: #1A1D24;
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

.filter-header-btn {
  font-size: 28rpx;
  color: #9292A5;
}

.filter-header-confirm {
  color: #37AE7E;
}

.date-popup {
  display: flex;
  flex-direction: column;
}

.date-picker-body {
  width: 100%;
  height: 440rpx;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68rpx;
  font-size: 28rpx;
  color: #1A1D24;
}

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
