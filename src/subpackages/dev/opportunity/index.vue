<template>
  <view class="opp-page">
    <view class="opp-wrap">
      <view class="opp-search-row">
        <view class="opp-search-box">
          <input class="opp-search-input" v-model="searchKeyword" placeholder="请输入搜索" placeholder-style="color:#9292A5;font-size:30rpx" @input="onSearchInput" @confirm="onSearchConfirm" />
          <image class="opp-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="opp-btn" @tap="showFilter = true">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="opp-btn" @tap="goAddOpp">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="opp-tabs-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
        <view class="opp-tabs">
          <view
            v-for="tab in oppTabs"
            :key="tab"
            class="opp-tab"
            :class="{ 'opp-tab--active': activeOppTab === tab }"
            @tap="onTabChange(tab)"
          >
            <text class="opp-tab-text" :class="{ 'opp-tab-text--active': activeOppTab === tab }">{{ tab }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view
        class="opp-list-scroll"
        scroll-y="true"
        :enhanced="true"
        :show-scrollbar="false"
        @scrolltolower="onLoadMore"
      >
        <view v-if="loading && list.length === 0" class="opp-empty">
          <text class="opp-empty-text">加载中...</text>
        </view>

        <view v-for="card in list" :key="card.id" class="oc-card" @tap="goDetail(card)">
          <view class="oc-head">
            <text class="oc-name">{{ card.opportunityName }}</text>
            <view class="oc-badge" :class="'oc-badge--' + (statusBadgeMap[card.followStatus] || 'yellow')">
              <text class="oc-badge-text" :class="'oc-badge-text--' + (statusBadgeMap[card.followStatus] || 'yellow')">{{ card.followStatusLabel }}</text>
            </view>
          </view>
          <view class="oc-info">
            <view class="oc-info-row">
              <view class="oc-info-col">
                <text class="oc-info-label">商机编号</text>
                <text class="oc-info-value">{{ card.opportunityNo }}</text>
              </view>
              <view class="oc-info-col">
                <text class="oc-info-label">需求产品</text>
                <text class="oc-info-value">{{ card.requiredProductLabel || '-' }}</text>
              </view>
            </view>
            <view class="oc-info-row">
              <view class="oc-info-col">
                <text class="oc-info-label">预计销售金额</text>
                <text class="oc-info-value oc-info-value--price">{{ card.expectedSalesAmountBandLabel || '-' }}</text>
              </view>
              <view class="oc-info-col">
                <text class="oc-info-label">预计签单日期</text>
                <text class="oc-info-value">{{ formatTime(card.expectedDealDate) }}</text>
              </view>
            </view>
          </view>
          <view class="oc-note">
            <text class="oc-note-label">最新跟进：</text>
            <text class="oc-note-text">{{ card.latestFollowRecord || '-' }}</text>
          </view>
        </view>

        <view v-if="loading && list.length > 0" class="opp-loading-more">
          <text class="opp-empty-text">加载更多...</text>
        </view>

        <view v-if="!loading && list.length === 0" class="opp-empty">
          <text class="opp-empty-text">暂无数据</text>
        </view>

        <view v-if="!hasMore && list.length > 0" class="opp-empty">
          <text class="opp-empty-text">没有更多了</text>
        </view>
      </scroll-view>
    </view>

    <FilterPopup v-model="showFilter" :sidebar-items="filterSidebarItems" @confirm="onFilterPopupConfirm" />

    <tab-bar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDidShow } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import FilterPopup from './components/FilterPopup.vue'
import { queryOpportunityPage, type OpportunityPageItem } from '@/api/opportunity'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'

const tabStatusMap: Record<string, string> = {
  '全部': 'all',
  '待跟进': 'pending_follow',
  '接触中': 'contacting',
  '已拜访': 'visited',
  '已报价': 'quoted',
  '签约': 'signing'
}

const statusBadgeMap: Record<string, string> = {
  pending_follow: 'yellow',
  contacting: 'yellow',
  visited: 'green',
  quoted: 'green',
  signing: 'green',
  won: 'green',
}

function formatTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').slice(0, 10)
}

const oppTabs = ['全部', '待跟进', '接触中', '已拜访', '已报价', '签约']
const activeOppTab = ref('全部')

const list = ref<OpportunityPageItem[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const searchKeyword = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const fetchList = async (reset = false) => {
  if (loading.value) return
  if (reset) {
    page.value = 1
    list.value = []
    hasMore.value = true
  }
  if (!hasMore.value && !reset) return
  loading.value = true
  try {
    const res = await queryOpportunityPage({
      page: page.value,
      pageSize,
      followStatus: tabStatusMap[activeOppTab.value] || 'all',
      keyword: searchKeyword.value || undefined,
    })
    if (reset) {
      list.value = res.items || []
    } else {
      list.value = [...list.value, ...(res.items || [])]
    }
    hasMore.value = list.value.length < res.total
  } catch {
    // 保持当前数据
  } finally {
    loading.value = false
  }
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

const onSearchConfirm = () => {
  if (searchTimer) clearTimeout(searchTimer)
  fetchList(true)
}

const onTabChange = (tab: string) => {
  if (activeOppTab.value === tab) return
  activeOppTab.value = tab
  fetchList(true)
}

const showFilter = ref(false)
const selectedTags = ref<string[]>([])

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

const onFilterPopupConfirm = (result: any) => {
  selectedTags.value = result.selected
  showFilter.value = false
}

const goAddOpp = () => {
  Taro.navigateTo({ url: '/subpackages/dev/opportunity/add-opportunity/index' })
}

const goDetail = (card: OpportunityPageItem) => {
  Taro.navigateTo({ url: `/subpackages/dev/opportunity/detail/index?id=${card.id}` })
}

onMounted(() => {
  fetchList(true)
})

useDidShow(() => {
  fetchList(true)
})
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
  width: 80%;
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

.opp-list-scroll {
  height: calc(100vh - 360rpx);
}

.opp-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.opp-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.opp-loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx 0;
}
</style>
