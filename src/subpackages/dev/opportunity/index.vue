<template>
  <view class="opp-page">
    <view class="opp-wrap">
      <view class="opp-search-row">
        <view class="opp-search-box">
          <input class="opp-search-input" placeholder="请输入搜索" placeholder-style="color:#9292A5;font-size:30rpx" />
          <image class="opp-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="opp-btn" @tap="showFilter = true">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="opp-btn" @tap="goAddOpp">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="opp-tabs-scroll" scroll-x :enhanced="true" :show-scrollbar="false">
        <view class="opp-tabs">
          <view
            v-for="tab in oppTabs"
            :key="tab"
            class="opp-tab"
            :class="{ 'opp-tab--active': activeOppTab === tab }"
            @tap="activeOppTab = tab"
          >
            <text class="opp-tab-text" :class="{ 'opp-tab-text--active': activeOppTab === tab }">{{ tab }}</text>
          </view>
        </view>
      </scroll-view>

      <view v-for="card in oppCards" :key="card.name" class="oc-card" @tap="goDetail(card)">
        <view class="oc-head">
          <text class="oc-name">{{ card.name }}</text>
          <view class="oc-badge" :class="'oc-badge--' + card.badgeStyle">
            <text class="oc-badge-text" :class="'oc-badge-text--' + card.badgeStyle">{{ card.badge }}</text>
          </view>
        </view>
        <view class="oc-info">
          <view class="oc-info-row">
            <view class="oc-info-col">
              <text class="oc-info-label">商机编号</text>
              <text class="oc-info-value">{{ card.oppNo }}</text>
            </view>
            <view class="oc-info-col">
              <text class="oc-info-label">需求产品</text>
              <text class="oc-info-value">{{ card.product }}</text>
            </view>
          </view>
          <view class="oc-info-row">
            <view class="oc-info-col">
              <text class="oc-info-label">预计销售金额</text>
              <text class="oc-info-value oc-info-value--price">￥{{ card.amount }}</text>
            </view>
            <view class="oc-info-col">
              <text class="oc-info-label">预计签单日期</text>
              <text class="oc-info-value">{{ card.signDate }}</text>
            </view>
          </view>
        </view>
        <view class="oc-note">
          <text class="oc-note-label">最新跟进：</text>
          <text class="oc-note-text">{{ card.note }}</text>
        </view>
      </view>
    </view>

    <FilterPopup v-model="showFilter" :sidebar-items="filterSidebarItems" @confirm="onFilterPopupConfirm" />

    <tab-bar />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import TabBar from '../tabs/index.vue'
import FilterPopup from './components/FilterPopup.vue'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'
import Taro from '@tarojs/taro'
const oppTabs = ['全部', '待跟进', '接触中', '已拜访', '已报价', '签约', '大公海']
const activeOppTab = ref('全部')

const oppCards = [
  { name: '金石科技高端采购书', badge: '待跟进', badgeStyle: 'yellow', oppNo: 'XS-101289021', product: '自动喷粉枪', amount: '1280.00', signDate: '2025/02/01', note: '客户有意向，但未表明哪款产品' },
  { name: '金剑制造实业控股', badge: '待跟进', badgeStyle: 'yellow', oppNo: 'XS-101289022', product: '静电粉末喷涂设备', amount: '2560.00', signDate: '2025/03/15', note: '客户有意向，但未表明哪款产品' },
  { name: '及时设计文化传媒有限公司', badge: '已报价', badgeStyle: 'green', oppNo: 'XS-101289023', product: '全自动涂装产线', amount: '8800.00', signDate: '2025/04/20', note: '客户有意向，但未表明哪款产品' },
]

const showFilter = ref(false)
const selectedTags = ref([])

const filterSidebarItems = [
  { label: '公司名称', type: 'org' },
  { label: '部门来源', type: 'org' },
  { label: '客户行业', type: 'industry' },
  { label: '商机等级', type: 'leadLevel' },
  { label: '省/市/区', type: 'region' },
  { label: '渠道来源', type: 'channel' },
  { label: '负责人', type: 'org' },
  { label: '跟进人', type: 'org' },
  { label: '分配时间', type: 'time' },
]

const onFilterPopupConfirm = (result) => {
  selectedTags.value = result.selected
  showFilter.value = false
}

const goAddOpp = () => {
  Taro.navigateTo({ url: '/subpackages/dev/opportunity/add-opportunity/index' })
}

const goDetail = (card) => {
  Taro.navigateTo({ url: '/subpackages/dev/opportunity/detail/index' })
}
</script>

<style>
.opp-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 140rpx;
}

.opp-wrap {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.opp-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.opp-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 68rpx;
  background: #F6F7FB;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  padding: 0 20rpx;
}
.opp-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.opp-search-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}
.opp-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border: 2rpx solid #CEF0E2;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.opp-tabs-scroll {
  width: 100%;
  white-space: nowrap;
  padding-bottom: 0;
  border-bottom: 1rpx solid #E5E6EB;
}
.opp-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 40rpx;
}
.opp-tab {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding-bottom: 30rpx;
  border-bottom: 4rpx solid transparent;
}
.opp-tab--active {
  border-bottom-color: #37AE7E;
}
.opp-tab-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #9292A5;
  white-space: nowrap;
}
.opp-tab-text--active {
  color: #1A1D24;
}

.oc-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.oc-card:last-child {
  margin-bottom: 0;
}
.oc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.oc-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}
.oc-badge {
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
}
.oc-badge--yellow {
  background: #FFF4E5;
}
.oc-badge--green {
  background: #EDFAF5;
}
.oc-badge--gray {
  background: #F2F3F5;
}
.oc-badge-text {
  font-size: 24rpx;
}
.oc-badge-text--yellow {
  color: #FF9500;
}
.oc-badge-text--green {
  color: #37AE7E;
}
.oc-badge-text--gray {
  color: #9292A5;
}
.oc-info {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 16rpx 20rpx;
  background: #FFFFFF;
  border: 1rpx solid #E6EBF0;
  border-radius: 8rpx;
}
.oc-info-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.oc-info-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
  flex: 1;
}
.oc-info-label {
  font-size: 26rpx;
  font-weight: 400;
  color: #62687D;
}
.oc-info-value {
  font-size: 26rpx;
  font-weight: 400;
  color: #1A1D24;
}
.oc-info-value--price {
  font-weight: 500;
}
.oc-note {
  display: flex;
  padding: 12rpx 16rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 6rpx;
}
.oc-note-label {
  font-size: 24rpx;
  color: #62687D;
  flex-shrink: 0;
}
.oc-note-text {
  font-size: 24rpx;
  color: #1A1D24;
}
</style>
