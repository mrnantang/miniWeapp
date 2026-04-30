<template>
  <view class="leads-page">
    <view class="leads-wrap">
      <view class="leads-search-row">
        <view class="leads-search-box">
          <input class="leads-search-input" placeholder="请输入搜索" placeholder-style="color:#9292A5;font-size:30rpx" />
          <image class="leads-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="leads-btn" @tap="showFilter = true">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="leads-btn" @tap="goAddLead">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="leads-tabs-scroll" scroll-x :enhanced="true" :show-scrollbar="false">
        <view class="leads-tabs">
          <view
            v-for="tab in leadsTabs"
            :key="tab"
            class="leads-tab"
            :class="{ 'leads-tab--active': activeLeadTab === tab }"
            @tap="activeLeadTab = tab"
          >
            <text class="leads-tab-text" :class="{ 'leads-tab-text--active': activeLeadTab === tab }">{{ tab }}</text>
          </view>
        </view>
      </scroll-view>

      <view v-for="card in leadCards" :key="card.name" class="lc-card">
        <view class="lc-head">
          <text class="lc-name">{{ card.name }}</text>
          <view class="lc-badge" :class="'lc-badge--' + card.badgeStyle">
            <text class="lc-badge-text" :class="'lc-badge-text--' + card.badgeStyle">{{ card.badge }}</text>
          </view>
        </view>
        <view class="lc-info">
          <view class="lc-info-item">
            <image class="lc-icon" :src="iconPhone" mode="aspectFit" />
            <text class="lc-info-text lc-info-text--active">15899280987</text>
          </view>
          <view class="lc-info-item">
            <image class="lc-icon" :src="card.icon2" mode="aspectFit" />
            <text class="lc-info-text">{{ card.label2 }}</text>
          </view>
        </view>
        <view class="lc-tags">
          <view class="lc-info-item">
            <image class="lc-icon" :src="iconIndustry" mode="aspectFit" />
            <text class="lc-info-text">{{ card.industry }}</text>
          </view>
          <view class="lc-info-item">
            <image class="lc-icon" :src="card.icon4" mode="aspectFit" />
            <text class="lc-info-text">{{ card.label4 }}</text>
          </view>
        </view>
        <view class="lc-note">
          <text class="lc-note-label">最新跟进：</text>
          <text class="lc-note-text">{{ card.note }}</text>
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
import gradeIcon from '@/assets/dev/icon-grade.png'
import locationIcon from '@/assets/dev/icon-location.png'
import wechatIcon from '@/assets/dev/icon-wechat.png'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'
import iconPhone from '@/assets/dev/icon-phone.png'
import iconIndustry from '@/assets/dev/icon-industry.png'
import Taro from '@tarojs/taro'
const leadsTabs = ['全部', '待跟进线索', '即将回收线索', '运营公海', '销售公海', '开发公海', '大公海']
const activeLeadTab = ref('全部')

const leadCards = [
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
  { label: '跟进人', type: 'org' },
  { label: '分配时间', type: 'time' },
]

const onFilterPopupConfirm = (result) => {
  selectedTags.value = result.selected
  showFilter.value = false
}

const goAddLead = () => {
  Taro.navigateTo({ url: '/subpackages/dev/leads/add-lead/index' })
}
</script>

<style>
.leads-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 140rpx;
}

.leads-wrap {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.leads-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.leads-search-box {
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
.leads-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.leads-search-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}
.leads-btn {
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

.leads-tabs-scroll {
  width: 100%;
  white-space: nowrap;
  padding-bottom: 0;
  border-bottom: 1rpx solid #E5E6EB;
}
.leads-tabs {
  display: inline-flex;
  gap: 40rpx;
}
.leads-tab {
  display: inline-flex;
  align-items: center;
  padding-bottom: 30rpx;
  border-bottom: 4rpx solid transparent;
}
.leads-tab--active {
  border-bottom-color: #37AE7E;
}
.leads-tab-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #9292A5;
  white-space: nowrap;
}
.leads-tab-text--active {
  color: #1A1D24;
}

.lc-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.lc-card:last-child {
  margin-bottom: 0;
}
.lc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.lc-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}
.lc-badge {
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
}
.lc-badge--cyan {
  background: #D8F8FF;
}
.lc-badge--green {
  background: #EDFAF5;
}
.lc-badge--gray {
  background: #F2F3F5;
}
.lc-badge-text {
  font-size: 24rpx;
}
.lc-badge-text--cyan {
  color: #15C2E9;
}
.lc-badge-text--green {
  color: #37AE7E;
}
.lc-badge-text--gray {
  color: #9292A5;
}
.lc-info {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.lc-info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}
.lc-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.lc-info-text {
  font-size: 26rpx;
  color: #62687D;
}
.lc-info-text--active {
  color: #37AE7E;
}
.lc-tags {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.lc-note {
  display: flex;
  padding: 10rpx 12rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 6rpx;
}
.lc-note-label {
  font-size: 24rpx;
  color: #62687D;
  flex-shrink: 0;
}
.lc-note-text {
  font-size: 24rpx;
  color: #1A1D24;
}
</style>