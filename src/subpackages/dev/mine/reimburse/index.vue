<template>
  <view class="reimb-page">
    <NavBar title="我的报销" />
    <view class="reimb-wrap">
      <view class="reimb-search-row">
        <view class="reimb-search-box">
          <input class="reimb-search-input" v-model="keyword" placeholder="请输入报销编号/关联客户" placeholder-style="color:#9292A5" @confirm="onSearch" />
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
        <view v-else-if="reimbList.length === 0" class="reimb-empty">
          <text class="reimb-empty-text">暂无报销记录</text>
        </view>
        <view v-else v-for="(item, idx) in reimbList" :key="item.id || idx" class="reimb-card">
          <view class="reimb-card-top">
            <view class="reimb-card-left">
              <text class="reimb-card-no">{{ item.reimbursementNo }}</text>
              <text class="reimb-card-sub">(报销编号)</text>
            </view>
            <view class="reimb-badge" :class="'reimb-badge--' + getBadgeType(item.status)">
              <text class="reimb-badge-text">{{ REIMB_STATUS_MAP[item.status] || item.status }}</text>
            </view>
          </view>
          <view class="reimb-card-info">
            <view class="reimb-info-col">
              <text class="reimb-info-label">报销总金额</text>
              <text class="reimb-info-value">{{ formatAmount(item.totalAmount) }}</text>
            </view>
            <view class="reimb-info-col">
              <text class="reimb-info-label">报销类型</text>
              <text class="reimb-info-value">{{ item.reimbursementTypesDisplay || '-' }}</text>
            </view>
          </view>
          <view class="reimb-card-actions">
            <view class="od-action-btn"
              :class="{ 'od-action-btn--cancel': item.canCancel, 'od-action-btn--cancel-disabled': !item.canCancel }"
              @tap="item.canCancel && onCancel(item)">
              取消报销</view>
            <view class="od-action-btn od-action-btn--view" @tap="onView(item)">查看报销</view>
          </view>
        </view>
        <view v-if="reimbList.length > 0" class="reimb-load-more">
          <text v-if="hasMore" @tap="onLoadMore">加载更多</text>
          <text v-else style="color:#BBBEC2">已加载全部</text>
        </view>
      </scroll-view>
    </view>

    <nut-popup v-model:visible="showFilter" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-btn" @tap="clearFilter">取消</text>
          <text class="filter-header-title">筛选</text>
          <text class="filter-header-btn filter-header-confirm" @tap="onFilterConfirm">确定</text>
        </view>
        <view class="filter-body">
          <view class="filter-sidebar">
            <view v-for="(tab, tIdx) in ['报销类型', '报销状态', '报销时间']" :key="tIdx" class="filter-sidebar-item"
              :class="{ 'filter-sidebar-item--active': filterIdx === tIdx + 1 }" @tap="filterIdx = tIdx + 1">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === tIdx + 1 }">{{ tab }}</text>
            </view>
          </view>
          <view class="filter-content">
            <view v-if="filterIdx === 1" class="filter-tags-section">
              <text class="filter-section-title">报销类型</text>
              <view class="filter-tag-row">
                <view v-for="tag in reimbTypeOptions" :key="tag" class="filter-tag"
                  :class="{ 'filter-tag--active': filterTags.reimbType.includes(tag) }" @tap="toggleFilterTag('reimbType', tag)">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.reimbType.includes(tag) }">{{ tag }}</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 2" class="filter-tags-section">
              <text class="filter-section-title">报销状态</text>
              <view class="filter-tag-row">
                <view v-for="tag in reimbStatusOptions" :key="tag" class="filter-tag"
                  :class="{ 'filter-tag--active': filterTags.reimbStatus.includes(tag) }" @tap="toggleFilterTag('reimbStatus', tag)">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes(tag) }">{{ tag }}</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 3" class="filter-tags-section">
              <text class="filter-section-title">报销时间</text>
              <view class="filter-date-row">
                <view class="filter-date-box" @tap="openDatePopup('start')">
                  <text class="filter-date-box-text" :class="{ 'filter-date-box-text--set': startTime }">{{ startTime || '开始时间' }}</text>
                </view>
                <text class="filter-date-sep">-</text>
                <view class="filter-date-box" @tap="openDatePopup('end')">
                  <text class="filter-date-box-text" :class="{ 'filter-date-box-text--set': endTime }">{{ endTime || '结束时间' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showDatePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100">
      <view class="date-popup">
        <view class="filter-header">
          <text class="filter-header-btn" @tap="showDatePopup = false">取消</text>
          <text class="filter-header-title">{{ datePopupTitle }}</text>
          <text class="filter-header-btn filter-header-confirm" @tap="onDateConfirm">确定</text>
        </view>
        <picker-view class="date-picker-body" :value="pickerValue" @change="onPickerChange">
          <picker-view-column>
            <view v-for="y in years" :key="y" class="picker-item">{{ y }}年</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="m in months" :key="m" class="picker-item">{{ m }}月</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="d in days" :key="d" class="picker-item">{{ d }}日</view>
          </picker-view-column>
        </picker-view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getReimburseList, cancelReimburse, REIMB_STATUS_MAP, REIMB_STATUS_BADGE_MAP, type ReimbursementListItem } from '@/api/reimburse'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'

const keyword = ref('')
const loading = ref(false)
const reimbList = ref<ReimbursementListItem[]>([])
const page = ref(1)
const pageSize = 20
const total = ref(0)
const hasMore = ref(true)

const reimbTypeOptions = ['全部', '招待费', '礼品费', '交通费', '高速过路费', '住宿费', '办公费', '福利费', '宣传及推广费', '宣传及广告费', '其他个人费用', '其他非本人费用']
const reimbStatusOptions = ['全部', '待审批', '审批驳回', '审批通过', '已撤销']

function formatAmount(cent: number): string {
  if (cent === undefined || cent === null) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function getBadgeType(status: string): string {
  return REIMB_STATUS_BADGE_MAP[status] || 'gray'
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
      params.reimbursementNo = keyword.value
    }
    // 筛选参数
    if (!filterTags.reimbType.includes('全部')) {
      params.reimbursementType = filterTags.reimbType[0]
    }
    if (!filterTags.reimbStatus.includes('全部')) {
      const statusMap: Record<string, string> = { '待审批': 'pending_approval', '审批驳回': 'approval_rejected', '审批通过': 'approval_passed', '已撤销': 'cancelled' }
      params.status = statusMap[filterTags.reimbStatus[0]]
    }
    if (startTime.value) params.submittedAtStart = startTime.value
    if (endTime.value) params.submittedAtEnd = endTime.value

    const res = await getReimburseList(params)
    if (reset) {
      reimbList.value = res.items || []
    } else {
      reimbList.value = [...reimbList.value, ...(res.items || [])]
    }
    total.value = res.total
    hasMore.value = reimbList.value.length < res.total
  } catch {
    // 错误已在 request 层统一处理
  } finally {
    loading.value = false
  }
}

function onSearch() {
  fetchList(true)
}

function onLoadMore() {
  if (!hasMore.value || loading.value) return
  page.value++
  fetchList(false)
}

const onAdd = () => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/reimburse/add/index' })
}

function onView(item: ReimbursementListItem) {
  Taro.navigateTo({ url: '/subpackages/dev/mine/reimburse/detail/index?id=' + item.id })
}

async function onCancel(item: ReimbursementListItem) {
  try {
    const res = await Taro.showModal({ title: '提示', content: '确定要撤销该报销单吗？' })
    if (!res.confirm) return
    await cancelReimburse(item.id)
    Taro.showToast({ title: '已撤销', icon: 'success' })
    fetchList(true)
  } catch {
    // 用户取消或请求失败
  }
}

const showFilter = ref(false)
const filterIdx = ref(1)
const showDatePopup = ref(false)
const datePickerTarget = ref('start')

const filterTags = reactive({
  reimbType: ['全部'],
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

const toggleFilterTag = (key: string, tag: string) => {
  const arr = filterTags[key]
  if (tag === '全部') {
    filterTags[key] = ['全部']
    return
  }
  if (arr.includes('全部')) {
    filterTags[key] = [tag]
  } else {
    const idx = arr.indexOf(tag)
    if (idx >= 0) {
      arr.splice(idx, 1)
      if (arr.length === 0) {
        filterTags[key] = ['全部']
      }
    } else {
      arr.push(tag)
    }
  }
}

const onFilter = () => {
  showFilter.value = true
}

const clearFilter = () => {
  showFilter.value = false
}

const onFilterConfirm = () => {
  showFilter.value = false
  fetchList(true)
}

const openDatePopup = (type: string) => {
  datePickerTarget.value = type
  showDatePopup.value = true
}

const onDateConfirm = () => {
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

const onPickerChange = (e: { detail: { value: number[] } }) => {
  pickerValue.value = e.detail.value
}

useDidShow(() => {
  fetchList(true)
})
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
  width: 80%;
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
</style>
