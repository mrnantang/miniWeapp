<template>
  <view class="reimb-page">
    <NavBar title="我的报销" />
    <view class="reimb-wrap">
      <view class="reimb-search-row">
        <view class="reimb-search-box">
          <input class="reimb-search-input" placeholder="请输入报销编号/关联客户" placeholder-style="color:#9292A5" />
          <image class="reimb-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="reimb-btn" @tap="onFilter">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="reimb-btn" @tap="onAdd">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>
      <scroll-view class="reimb-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
        <view v-for="(item, idx) in reimbList" :key="idx" class="reimb-card">
          <view class="reimb-card-top">
            <view class="reimb-card-left">
              <text class="reimb-card-no">{{ item.no }}</text>
              <text class="reimb-card-sub">(报销编号)</text>
            </view>
            <view class="reimb-badge" :class="'reimb-badge--' + item.badgeType">
              <text class="reimb-badge-text">{{ item.badge }}</text>
            </view>
          </view>
          <view class="reimb-card-info">
            <view class="reimb-info-col">
              <text class="reimb-info-label">报销总金额</text>
              <text class="reimb-info-value">￥{{ item.amount }}</text>
            </view>
            <view class="reimb-info-col">
              <text class="reimb-info-label">报销类型</text>
              <text class="reimb-info-value">{{ item.types }}</text>
            </view>
          </view>
          <view class="reimb-card-actions">
            <view class="od-action-btn"
              :class="{ 'od-action-btn--cancel': item.badgeType !== 'green', 'od-action-btn--cancel-disabled': item.badgeType === 'green' }">
              取消报销</view>
            <view class="od-action-btn od-action-btn--view" @tap="onView(item)">查看报销</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <nut-popup v-model:visible="showFilter" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">全部筛选</text>
        </view>
        <view class="filter-body">
          <view class="filter-sidebar">
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 1 }"
              @tap="filterIdx = 1">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 1 }">报销类型</text>
            </view>
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 2 }"
              @tap="filterIdx = 2">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 2 }">报销状态</text>
            </view>
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 3 }"
              @tap="filterIdx = 3">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 3 }">报销时间</text>
            </view>
          </view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view v-if="filterIdx === 1" class="filter-tags-section">
              <text class="filter-section-title">报销类型</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('全部') }"
                  @tap="toggleFilterTag('reimbType', '全部')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('全部') }">全部</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('交通费') }"
                  @tap="toggleFilterTag('reimbType', '交通费')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('交通费') }">交通费</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('差旅费') }"
                  @tap="toggleFilterTag('reimbType', '差旅费')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('招待费') }">招待费</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('交通费') }"
                  @tap="toggleFilterTag('reimbType', '交通费')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('交通费') }">交通费</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('加油费') }"
                  @tap="toggleFilterTag('reimbType', '加油费')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('加油费') }">加油费</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('固定资产') }"
                  @tap="toggleFilterTag('reimbType', '固定资产')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('固定资产') }">固定资产</text>
                </view>
              </view>
            </view>

            <view v-if="filterIdx === 2" class="filter-tags-section">
              <text class="filter-section-title">报销状态</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbStatus.includes('全部') }"
                  @tap="toggleFilterTag('reimbStatus', '全部')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes('全部') }">全部</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbStatus.includes('待审批') }"
                  @tap="toggleFilterTag('reimbStatus', '待审批')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes('待审批') }">待审批</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbStatus.includes('审批通过') }"
                  @tap="toggleFilterTag('reimbStatus', '审批通过')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes('审批通过') }">审批通过</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbStatus.includes('审批驳回') }"
                  @tap="toggleFilterTag('reimbStatus', '审批驳回')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbStatus.includes('审批驳回') }">审批驳回</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 3" class="filter-tags-section">
              <text class="filter-section-title">时间范围</text>
              <view class="filter-date-row">
                <view class="filter-date-box" @tap="openDatePopup('start')">
                  <text class="filter-date-box-text" :class="{ 'filter-date-box-text--set': startTime }">{{ startTime ||
                    '开始时间' }}</text>
                </view>
                <text class="filter-date-sep">至</text>
                <view class="filter-date-box" @tap="openDatePopup('end')">
                  <text class="filter-date-box-text" :class="{ 'filter-date-box-text--set': endTime }">{{ endTime ||
                    '结束时间' }}</text>
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

    <nut-popup v-model:visible="showDatePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100" safe-area-inset-bottom>
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

<script setup>
import { ref, reactive, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Taro from '@tarojs/taro'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'

const onAdd = () => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/reimburse/add/index' })
}

const reimbList = ref([
  { no: 'BX-992812781', badge: '待审批', badgeType: 'yellow', amount: '1,280.00', types: '交通费 | 招待费 | 高速过路费' },
  { no: 'BX-992812782', badge: '审批通过', badgeType: 'red', amount: '3,560.00', types: '办公用品 | 交通费' },
  { no: 'BX-992812783', badge: '三级审批通过', badgeType: 'green', amount: '8,200.00', types: '交通费 | 招待费 | 住宿费' },
  { no: 'BX-992812784', badge: '待审批', badgeType: 'yellow', amount: '520.00', types: '快递费' },
])

const showFilter = ref(false)
const filterIdx = ref(1)
const showDatePopup = ref(false)
const datePickerTarget = ref('start')

const filterTags = reactive({
  company: ['全部'],
  dept: ['全部'],
  subDept: ['全部'],
  employee: ['全部'],
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

const daysInMonth = (y, m) => new Date(y, m, 0).getDate()
const days = computed(() => {
  const y = years[pickerValue.value[0]]
  const m = months[pickerValue.value[1]]
  return Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1)
})

const pickerValue = ref([2, now.getMonth(), now.getDate() - 1])

const toggleFilterTag = (key, tag) => {
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

const onView = (item) => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/reimburse/detail/index' })
}

const onFilter = () => {
  showFilter.value = true
}

const clearFilter = () => {
  showFilter.value = false
}

const onFilterConfirm = () => {
  showFilter.value = false
}

const openDatePopup = (type) => {
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

const onPickerChange = (e) => {
  pickerValue.value = e.detail.value
}
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
