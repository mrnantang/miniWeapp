<template>
  <view class="reimb-page">
    <NavBar title="费用申请" />
    <view class="reimb-wrap">
      <view class="reimb-search-row">
        <view class="reimb-search-box">
          <input class="reimb-search-input" placeholder="请输入费用编号/关联客户" placeholder-style="color:#9292A5" />
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
              取消费用申请</view>
            <view class="od-action-btn od-action-btn--view" @tap="onView(item)">查看费用申请</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <nut-popup v-model:visible="showAddPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100">
      <view class="exp-add-popup">
        <view class="exp-add-header">
          <text class="exp-add-header-btn" @tap="showAddPopup = false">取消</text>
          <text class="exp-add-header-title">申请费用</text>
          <text class="exp-add-header-btn exp-add-header-confirm" @tap="showAddPopup = false">确认</text>
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
              <text class="exp-add-value exp-add-value--placeholder">{{ addForm.dept || '请选择' }}</text>
              <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
            </view>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">申请金额</text>
            <view class="exp-add-value-row">
              <input class="exp-add-input" v-model="addForm.amount" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
              <text class="exp-add-unit">元</text>
            </view>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">费用项目</text>
            <view class="exp-add-value-row" @tap="onSelectItem">
              <text class="exp-add-value">{{ addForm.item || '请选择' }}</text>
              <image class="exp-add-arrow" :src="iconArrow" mode="aspectFit" />
            </view>
          </view>
          <view class="exp-add-divider" />
          <view class="exp-add-field">
            <text class="exp-add-label">关联客户</text>
            <view class="exp-add-value-row" @tap="onSelectCustomer">
              <text class="exp-add-value exp-add-value--placeholder">{{ addForm.customer || '请选择' }}</text>
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

    <nut-popup v-model:visible="showItemPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2200">
      <view class="exp-item-popup">
        <view class="exp-add-header">
          <text class="exp-add-header-btn" @tap="showItemPopup = false">取消</text>
          <text class="exp-add-header-title">选择费用项目</text>
          <text class="exp-add-header-btn exp-add-header-confirm" @tap="showItemPopup = false">确认</text>
        </view>
        <view class="exp-item-list">
          <template v-for="(it, idx) in expenseItemList" :key="it">
            <view class="exp-item-row" @tap="onItemSelect(it)">
              <text class="exp-item-text">{{ it }}</text>
              <view class="exp-item-radio" :class="{ 'exp-item-radio--checked': addForm.item === it }">
                <view v-if="addForm.item === it" class="exp-item-radio-dot" />
              </view>
            </view>
            <view v-if="idx < expenseItemList.length - 1" class="exp-add-divider" />
          </template>
        </view>
      </view>
    </nut-popup>

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
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 2}"
              @tap="filterIdx = 2">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 2 }">报销时间</text>
            </view>
          </view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view v-if="filterIdx === 1" class="filter-tags-section">
              <text class="filter-section-title">审批</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('待审批') }"
                  @tap="toggleFilterTag('reimbType', '待审批')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('待审批') }">待审批</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('审批通过') }"
                  @tap="toggleFilterTag('reimbType', '审批通过')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('审批通过') }">审批通过</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.reimbType.includes('审批驳回') }"
                  @tap="toggleFilterTag('reimbType', '审批驳回')">
                  <text class="filter-tag-text"
                    :class="{ 'filter-tag-text--active': filterTags.reimbType.includes('招待费') }">审批驳回</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 2" class="filter-tags-section">
              <text class="filter-section-title">发起时间</text>
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
import iconArrow from '@/assets/dev/rightArror.png'

const showAddPopup = ref(false)
const showItemPopup = ref(false)

const addForm = reactive({
  dept: '',
  amount: '',
  item: '招待费',
  customer: '',
  remark: '',
  account: '',
})

const expenseItemList = ['差旅费', '广告投流', '办公费', '招待费', '交通费', '通讯费', '采购付款', '其他', '业务费']

const onAdd = () => {
  showAddPopup.value = true
}

const onSelectDept = () => {
  Taro.showToast({ title: '选择部门', icon: 'none' })
}

const onSelectItem = () => {
  showItemPopup.value = true
}

const onSelectCustomer = () => {
  Taro.showToast({ title: '选择客户', icon: 'none' })
}

const onItemSelect = (item) => {
  addForm.item = item
  showItemPopup.value = false
}

const reimbList = ref([
  { no: 'BX-992812781', badge: '待审批', badgeType: 'yellow', amount: '1,280.00', types: '审批通过 | 招待费 | 高速过路费' },
  { no: 'BX-992812782', badge: '审批通过', badgeType: 'red', amount: '3,560.00', types: '办公用品 | 审批通过' },
  { no: 'BX-992812783', badge: '三级审批通过', badgeType: 'green', amount: '8,200.00', types: '审批通过 | 招待费 | 住宿费' },
  { no: 'BX-992812784', badge: '待审批', badgeType: 'yellow', amount: '520.00', types: '快递费' },
])

const showFilter = ref(false)
const filterIdx = ref(1)
const showDatePopup = ref(false)
const datePickerTarget = ref('start')

const filterTags = reactive({
  company: ['待审批'],
  dept: ['待审批'],
  subDept: ['待审批'],
  employee: ['待审批'],
  reimbType: ['待审批'],
  reimbStatus: ['待审批'],
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
  if (tag === '待审批') {
    filterTags[key] = ['待审批']
    return
  }
  if (arr.includes('待审批')) {
    filterTags[key] = [tag]
  } else {
    const idx = arr.indexOf(tag)
    if (idx >= 0) {
      arr.splice(idx, 1)
      if (arr.length === 0) {
        filterTags[key] = ['待审批']
      }
    } else {
      arr.push(tag)
    }
  }
}

const onView = (item) => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/expense/detail/index' })
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
