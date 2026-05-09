<template>
  <view class="customer-page">
    <view class="customer-wrap">
      <view class="customer-search-row">
        <view class="customer-search-box">
          <input class="customer-search-input" placeholder="请输入搜索" placeholder-style="color:#9292A5;font-size:30rpx" />
          <image class="customer-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="customer-btn" @tap="showFilter = true">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="customer-btn" @tap="goAddCustomer">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="customer-tabs-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
        <view class="customer-tabs">
          <view
            v-for="tab in customerTabs"
            :key="tab"
            class="customer-tab"
            :class="{ 'customer-tab--active': activeCustomerTab === tab }"
            @tap="activeCustomerTab = tab"
          >
            <text class="customer-tab-text" :class="{ 'customer-tab-text--active': activeCustomerTab === tab }">{{ tab }}</text>
          </view>
        </view>
      </scroll-view>

      <view v-for="card in customerCards" :key="card.name" class="cc-card" @tap="goDetail(card)">
        <view class="cc-head">
          <text class="cc-name">{{ card.name }}</text>
          <view class="cc-badge" :class="'cc-badge--' + card.badgeStyle">
            <text class="cc-badge-text" :class="'cc-badge-text--' + card.badgeStyle">{{ card.badge }}</text>
          </view>
        </view>
        <view class="cc-info">
          <view class="cc-info-item">
            <image class="cc-icon" :src="iconPhone" mode="aspectFit" />
            <text class="cc-info-text cc-info-text--active">15899280987</text>
          </view>
          <view class="cc-info-item">
            <image class="cc-icon" :src="card.icon2" mode="aspectFit" />
            <text class="cc-info-text">{{ card.label2 }}</text>
          </view>
        </view>
        <view class="cc-tags">
          <view class="cc-info-item">
            <image class="cc-icon" :src="iconIndustry" mode="aspectFit" />
            <text class="cc-info-text">{{ card.industry }}</text>
          </view>
          <view class="cc-info-item">
            <image class="cc-icon" :src="card.icon4" mode="aspectFit" />
            <text class="cc-info-text">{{ card.label4 }}</text>
          </view>
        </view>
        <view class="cc-note">
          <text class="cc-note-label">最新跟进：</text>
          <text class="cc-note-text">{{ card.note }}</text>
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
import FilterPopup from '../leads/components/FilterPopup.vue'
import gradeIcon from '@/assets/dev/icon-grade.png'
import locationIcon from '@/assets/dev/icon-location.png'
import wechatIcon from '@/assets/dev/icon-wechat.png'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'
import iconPhone from '@/assets/dev/icon-phone.png'
import iconIndustry from '@/assets/dev/icon-industry.png'
import Taro from '@tarojs/taro'
const customerTabs = ['全部', '待跟进客户', '即将回收客户', '运营公海', '销售公海', '开发公海', '大公海']
const activeCustomerTab = ref('全部')

const customerCards = [
  { name: '超凡实业技术有限公司', badge: '待定', badgeStyle: 'cyan', icon2: gradeIcon, label2: 'A级线索', industry: '电气行业', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '客户有意向，但未表明哪款产品' },
  { name: '金剑制造实业控股', badge: '有效', badgeStyle: 'green', icon2: gradeIcon, label2: 'A级线索', industry: '电气行业', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '客户有意向，但未表明哪款产品' },
  { name: '及时设计文化传媒有限公司', badge: '无效', badgeStyle: 'gray', icon2: gradeIcon, label2: 'A级线索', industry: '电气行业', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '客户有意向，但未表明哪款产品' },
]

const showFilter = ref(false)
const selectedTags = ref([])

const filterSidebarItems = [
  { label: '公司名称', type: 'org' },
  { label: '部门来源', type: 'org' },
  { label: '客户行业', type: 'industry' },
  { label: '线索等级', type: 'leadLevel' },
  { label: '省/市/区', type: 'region' },
  { label: '渠道来源', type: 'channel' },
  { label: '负责人', type: 'org' },
  { label: '协作人', type: 'org' },
  { label: '客户创建时间', type: 'time' },
]

const onFilterPopupConfirm = (result) => {
  selectedTags.value = result.selected
  showFilter.value = false
}

const goAddCustomer = () => {
  Taro.navigateTo({ url: '/subpackages/dev/customer/add-customer/index' })
}

const goDetail = (card) => {
  Taro.navigateTo({ url: '/subpackages/dev/customer/detail/index' })
}
</script>

<style>
.customer-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 140rpx;
}

.customer-wrap {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.customer-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.customer-search-box {
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
.customer-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.customer-search-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}
.customer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.customer-tabs-scroll {
  width: 100%;
  white-space: nowrap;
  padding-bottom: 0;
  border-bottom: 1rpx solid #E5E6EB;
}
.customer-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 40rpx;
}
.customer-tab {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding-bottom: 30rpx;
  border-bottom: 4rpx solid transparent;
}
.customer-tab--active {
  border-bottom-color: #37AE7E;
}
.customer-tab-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #9292A5;
  white-space: nowrap;
}
.customer-tab-text--active {
  color: #1A1D24;
}

.cc-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.cc-card:last-child {
  margin-bottom: 0;
}
.cc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cc-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}
.cc-badge {
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
}
.cc-badge--cyan {
  background: #D8F8FF;
}
.cc-badge--green {
  background: #EDFAF5;
}
.cc-badge--gray {
  background: #F2F3F5;
}
.cc-badge-text {
  font-size: 24rpx;
}
.cc-badge-text--cyan {
  color: #15C2E9;
}
.cc-badge-text--green {
  color: #37AE7E;
}
.cc-badge-text--gray {
  color: #9292A5;
}
.cc-info {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.cc-info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}
.cc-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.cc-info-text {
  font-size: 26rpx;
  color: #62687D;
}
.cc-info-text--active {
  color: #37AE7E;
}
.cc-tags {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.cc-note {
  display: flex;
  padding: 10rpx 12rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 6rpx;
}
.cc-note-label {
  font-size: 24rpx;
  color: #62687D;
  flex-shrink: 0;
}
.cc-note-text {
  font-size: 24rpx;
  color: #1A1D24;
}
</style>
