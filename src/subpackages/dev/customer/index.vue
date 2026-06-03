<template>
  <view class="customer-page">
    <view class="customer-wrap">
      <view class="customer-search-row">
        <view class="customer-search-box">
          <input class="customer-search-input" v-model="searchKeyword" placeholder="请输入搜索" placeholder-style="color:#9292A5;font-size:30rpx" @input="onSearchInput" />
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
            :key="tab.value"
            class="customer-tab"
            :class="{ 'customer-tab--active': activeCustomerTab === tab.value }"
            @tap="onTabChange(tab.value)"
          >
            <text class="customer-tab-text" :class="{ 'customer-tab-text--active': activeCustomerTab === tab.value }">{{ tab.label }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view class="customer-list-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="onLoadMore">
        <view v-if="loading && list.length === 0" class="customer-empty">
          <text class="customer-empty-text">加载中...</text>
        </view>

        <view v-for="card in list" :key="card.id" class="cc-card" @tap="goDetail(card.id)">
          <view class="cc-head">
            <text class="cc-name">{{ card.name }}</text>
            <view class="cc-badge" :class="'cc-badge--' + (FOLLOW_STATUS_STYLE[card.followStatus] || 'cyan')">
              <text class="cc-badge-text" :class="'cc-badge-text--' + (FOLLOW_STATUS_STYLE[card.followStatus] || 'cyan')">{{ card.followStatusLabel || '待定' }}</text>
            </view>
          </view>
          <view class="cc-info">
            <view class="cc-info-item">
              <image class="cc-icon" :src="iconPhone" mode="aspectFit" />
              <text class="cc-info-text cc-info-text--active">{{ card.phone || '-' }}</text>
            </view>
            <view class="cc-info-item">
              <image class="cc-icon" :src="gradeIcon" mode="aspectFit" />
              <text class="cc-info-text">{{ card.levelLabel || '-' }}</text>
            </view>
          </view>
          <view class="cc-tags">
            <view class="cc-info-item">
              <image class="cc-icon" :src="iconIndustry" mode="aspectFit" />
              <text class="cc-info-text">{{ card.industryLabel || '-' }}</text>
            </view>
            <view class="cc-info-item">
              <image class="cc-icon" :src="locationIcon" mode="aspectFit" />
              <text class="cc-info-text">{{ regionDisplay(card) || '-' }}</text>
            </view>
          </view>
          <view class="cc-note">
            <text class="cc-note-label">最新跟进：</text>
            <text class="cc-note-text">{{ card.latestFollowRecord || '暂无' }}</text>
          </view>
        </view>

        <view v-if="loading && list.length > 0" class="customer-loading-more">
          <text class="customer-loading-more-text">加载更多...</text>
        </view>

        <view v-if="!loading && list.length === 0" class="customer-empty">
          <text class="customer-empty-text">暂无数据</text>
        </view>

        <view v-if="!hasMore && list.length > 0" class="customer-empty">
          <text class="customer-empty-text">没有更多了</text>
        </view>
      </scroll-view>
    </view>

    <FilterPopup v-model="showFilter" :sidebar-items="filterSidebarItems" @confirm="onFilterPopupConfirm" />

    <tab-bar />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import FilterPopup from '../leads/components/FilterPopup.vue'
import { getCustomerList, type CustomerItem } from '@/api/customer'
import gradeIcon from '@/assets/dev/icon-grade.png'
import locationIcon from '@/assets/dev/icon-location.png'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'
import iconPhone from '@/assets/dev/icon-phone.png'
import iconIndustry from '@/assets/dev/icon-industry.png'

const TAB_MAP: Record<string, string> = {
  all: 'all',
  pending_follow: 'pending_follow',
  soon_recycle: 'soon_recycle',
  operation: 'operation',
  sales: 'sales',
  development: 'development',
  global: 'global',
}

const FOLLOW_STATUS_STYLE: Record<string, string> = {
  pending: 'cyan',
  valid: 'green',
  invalid: 'gray',
  duplicate: 'gray',
}

const customerTabs = [
  { label: '全部', value: 'all' },
  { label: '待跟进客户', value: 'pending_follow' },
  { label: '即将回收客户', value: 'soon_recycle' },
  { label: '运营公海', value: 'operation' },
  { label: '销售公海', value: 'sales' },
  { label: '开发公海', value: 'development' },
  { label: '大公海', value: 'global' },
]

const activeCustomerTab = ref('all')
const list = ref<CustomerItem[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const searchKeyword = ref('')
const showFilter = ref(false)
const filters = reactive<Record<string, string[]>>({})

let searchTimer: ReturnType<typeof setTimeout> | null = null

const filterSidebarItems = [
  { label: '客户行业', type: 'industry', paramKey: 'industry' },
  { label: '客户等级', type: 'leadLevel', paramKey: 'level' },
  { label: '省/市/区', type: 'region', paramKey: 'regionPaths' },
  { label: '渠道来源', type: 'channel', paramKey: 'channelCodes' },
  { label: '负责人', type: 'userCascader', paramKey: 'ownerUserName' },
  { label: '客户创建时间', type: 'time', paramKey: 'createdAt' },
]

const regionDisplay = (item: CustomerItem): string => {
  const parts = [item.provinceName, item.cityName, item.districtName].filter(Boolean)
  return parts.join('/')
}

const fetchList = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    page.value = 1
    list.value = []
    hasMore.value = true
  }
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      tab: TAB_MAP[activeCustomerTab.value] || 'all',
      page: page.value,
      pageSize,
    }
    if (searchKeyword.value.trim()) {
      params.customerName = searchKeyword.value.trim()
    }
    if (filters.industry?.length) params.industry = filters.industry[0]
    if (filters.level?.length) params.level = filters.level[0]
    if (filters.regionPaths?.length) params.regionPaths = filters.regionPaths
    if (filters.ownerUserName?.length) params.ownerUserName = filters.ownerUserName[0]
    const res = await getCustomerList(params as Parameters<typeof getCustomerList>[0])
    if (reset) {
      list.value = res.items || []
    } else {
      list.value = [...list.value, ...(res.items || [])]
    }
    hasMore.value = list.value.length < res.total
  } catch {
    // keep current data on failure
  } finally {
    loading.value = false
  }
}

const onTabChange = (tabValue: string) => {
  if (activeCustomerTab.value === tabValue) return
  activeCustomerTab.value = tabValue
  fetchList(true)
}

const onLoadMore = () => {
  if (loading.value || !hasMore.value) return
  page.value++
  fetchList(false)
}

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchList(true)
  }, 300)
}

const onFilterPopupConfirm = (result: { type: string; selected: string[]; paramKey?: string; startTime?: string; endTime?: string }) => {
  const key = result.paramKey || result.type
  if (result.type === 'time') {
    // time type not yet supported in API params
  } else {
    if (result.selected.length === 0) {
      delete filters[key]
    } else {
      filters[key] = result.selected
    }
  }
  showFilter.value = false
  fetchList(true)
}

const goAddCustomer = () => {
  Taro.navigateTo({ url: '/subpackages/dev/customer/add-customer/index' })
}

const goDetail = (id: number) => {
  Taro.navigateTo({ url: `/subpackages/dev/customer/detail/index?id=${id}` })
}

onMounted(() => {
  fetchList(true)
})

useDidShow(() => {
  fetchList(true)
})
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
  margin-bottom: 32rpx;
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
  width: 80%;
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

.customer-list-scroll {
  height: calc(100vh - 400rpx);
}

.customer-empty {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
}

.customer-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.customer-loading-more {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.customer-loading-more-text {
  font-size: 26rpx;
  color: #9292A5;
}
</style>
