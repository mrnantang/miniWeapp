<template>
  <view class="perf-page">
    <NavBar title="业绩分配" />
    <view class="perf-wrap">
      <view class="perf-search-row">
        <view class="perf-search-box">
          <input class="perf-search-input" placeholder="请输入业绩编号/关联客户" placeholder-style="color:#9292A5" />
          <image class="perf-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="perf-btn" @tap="onFilter">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="perf-btn" @tap="onAdd">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>
      <scroll-view class="perf-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
        <view v-for="(item, idx) in perfList" :key="idx" class="perf-card">
          <view class="perf-card-top">
            <text class="perf-card-title">{{ item.name }}</text>
            <view class="perf-badge" :class="'perf-badge--' + item.badgeType">
              <text class="perf-badge-text">{{ item.badge }}</text>
            </view>
          </view>
          <view class="perf-card-info">
            <view class="perf-info-row">
              <view class="perf-info-col">
                <text class="perf-info-label">关联商机</text>
                <text class="perf-info-value">{{ item.opportunity }}</text>
              </view>
              <view class="perf-info-col">
                <text class="perf-info-label">关联合同</text>
                <text class="perf-info-value">{{ item.contract }}</text>
              </view>
            </view>
            <view class="perf-info-row">
              <view class="perf-info-col">
                <text class="perf-info-label">合同总金额</text>
                <text class="perf-info-value perf-info-value--amount">{{ item.totalAmount }}</text>
              </view>
              <view class="perf-info-col">
                <text class="perf-info-label">本次回款金额</text>
                <text class="perf-info-value perf-info-value--amount">{{ item.paidAmount }}</text>
              </view>
            </view>
          </view>
          <view class="perf-card-btn" @tap="onView(item)">{{ item.btnText }}</view>
        </view>
      </scroll-view>
    </view>

    <nut-popup v-model:visible="showFilter" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">全部筛选</text>
        </view>
        <view class="filter-body">
          <view class="filter-sidebar">
            <view class="filter-sidebar-item filter-sidebar-item--active">
              <text class="filter-sidebar-text filter-sidebar-text--active">状态</text>
            </view>
          </view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="filter-tags-section">
              <text class="filter-section-title">状态</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.status.includes('全部') }" @tap="toggleFilterTag('status', '全部')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.status.includes('全部') }">全部</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.status.includes('待确认') }" @tap="toggleFilterTag('status', '待确认')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.status.includes('待确认') }">待确认</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags.status.includes('已确认') }" @tap="toggleFilterTag('status', '已确认')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags.status.includes('已确认') }">已确认</text>
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
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Taro from '@tarojs/taro'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'

const showFilter = ref(false)
const filterIdx = ref(0)
const filterTags = reactive({
  status: ['全部'],
})

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

const perfList = ref([
  { name: '金石信息科技有限公司', badge: '待确认', badgeType: 'yellow', opportunity: '金石科技高端机采购书', contract: '智能设备购销合同', totalAmount: '￥200000', paidAmount: '￥100000', btnText: '编辑业绩分配' },
  { name: '及时设计文化传媒有限公司', badge: '已确认', badgeType: 'green', opportunity: '金石科技高端机采购书', contract: '智能设备购销合同', totalAmount: '￥200000', paidAmount: '￥100000', btnText: '查看业绩分配' },
  { name: '超凡实业有限公司', badge: '待确认', badgeType: 'yellow', opportunity: '喷粉设备采购项目', contract: '设备购销合同', totalAmount: '￥128000', paidAmount: '￥68000', btnText: '编辑业绩分配' },
])

const onFilter = () => {
  showFilter.value = true
}

const clearFilter = () => {
  showFilter.value = false
}

const onFilterConfirm = () => {
  showFilter.value = false
}

const onAdd = () => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/perf/add/index' })
}

const onView = (item) => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/perf/detail/index' })
}
</script>

<style>
.perf-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.perf-wrap {
  padding: 32rpx 40rpx;
}

.perf-scroll {
  padding-bottom: 0;
}

.perf-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.perf-search-box {
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

.perf-search-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}

.perf-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.perf-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.perf-btn image {
  width: 100%;
  height: 100%;
}

.perf-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.perf-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.perf-card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}

.perf-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.perf-badge--yellow {
  background: #FFEFD8;
  color: #FF9500;
}

.perf-badge--green {
  background: #E4FAEC;
  color: #37AE7E;
}

.perf-badge-text {
  font-size: 24rpx;
}

.perf-card-info {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #F9FAFB;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
}

.perf-info-row {
  display: flex;
  gap: 16rpx;
}

.perf-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.perf-info-label {
  font-size: 26rpx;
  color: #62687D;
}

.perf-info-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.perf-info-value--amount {
  font-weight: 500;
}

.perf-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56rpx;
  border: 1rpx solid #B1E9D3;
  border-radius: 8rpx;
  font-size: 28rpx;
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
  display: flex;
  align-items: center;
  padding: 12rpx 40rpx;
  height: 80rpx;
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
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
}

.filter-footer-submit-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}
</style>
