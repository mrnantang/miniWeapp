<template>
  <view class="leads-page">
    <view class="leads-wrap">
      <view class="leads-search-row">
        <view class="leads-search-box">
          <input class="leads-search-input" v-model="searchKeyword" placeholder="请输入搜索"
            placeholder-style="color:#9292A5;font-size:30rpx" @input="onSearchInput" />
          <image class="leads-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="leads-btn" @tap="showFilter = true">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="leads-btn" @tap="goAddLead">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="leads-tabs-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
        <view class="leads-tabs">
          <view v-for="tab in leadsTabs" :key="tab.label" class="leads-tab"
            :class="{ 'leads-tab--active': activeLeadTab === tab.value }" @tap="onTabChange(tab.value)">
            <text class="leads-tab-text" :class="{ 'leads-tab-text--active': activeLeadTab === tab.value }">
              {{ tab.label }}
            </text>
          </view>
        </view>
      </scroll-view>

      <scroll-view class="leads-list-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false"
        @scrolltolower="onLoadMore">
        <view v-if="loading && list.length === 0" class="leads-empty">
          <text class="leads-empty-text">加载中...</text>
        </view>

        <!-- 公海卡片 -->
        <template v-if="POOL_TABS.includes(activeLeadTab)">
          <view v-for="card in list" :key="card.id" class="lc-card" @tap="goDetail(card.id)">
            <view class="lc-head">
              <text class="lc-name">{{ card.customerName || card.companyName }}</text>
            </view>
            <view class="lc-info">
              <view class="lc-info-item">
                <view class="pool-icon pool-icon--phone">
                  <image class="pool-icon-img" :src="iconPhone" mode="aspectFit" />
                </view>
                <text class="lc-info-text lc-info-text--active">{{ card.phone || '-' }}</text>
              </view>
              <view class="lc-info-item">
                <view class="pool-icon pool-icon--default">
                  <image class="pool-icon-img" :src="gradeIcon" mode="aspectFit" />
                </view>
                <text class="lc-info-text">{{ card.leadLevel || '-' }}级线索</text>
              </view>
            </view>
            <view class="lc-tags">
              <view class="lc-info-item">
                <view class="pool-icon pool-icon--default">
                  <image class="pool-icon-img" :src="iconIndustry" mode="aspectFit" />
                </view>
                <text class="lc-info-text">{{ card.customerIndustryLabel || '-' }}</text>
              </view>
              <view class="lc-info-item">
                <view class="pool-icon pool-icon--default">
                  <image class="pool-icon-img" :src="locationIcon" mode="aspectFit" />
                </view>
                <text class="lc-info-text">{{ regionDisplay(card) || '-' }}</text>
              </view>
            </view>
            <view class="lc-actions">
              <view class="pool-btn" @tap.stop="onAssignPool(card.id)">
                <text class="pool-btn-text">分配</text>
              </view>
              <view class="pool-btn" @tap.stop="onClaimPool(card.id)">
                <text class="pool-btn-text">立刻领取</text>
              </view>
            </view>
          </view>
        </template>

        <!-- 普通卡片 -->
        <template v-else>
          <view v-for="card in list" :key="card.id" class="lc-card" @tap="goDetail(card.id)">
            <view class="lc-head">
              <text class="lc-name">{{ card.customerName || card.companyName }}</text>
              <view class="lc-badge" :class="statusBadgeStyle(card.status)">
                <text class="lc-badge-text" :class="statusBadgeTextStyle(card.status)">{{ statusLabel(card.status)
                }}</text>
              </view>
            </view>
            <view class="lc-info">
              <view class="lc-info-item">
                <image class="lc-icon" :src="iconPhone" mode="aspectFit" />
                <text class="lc-info-text lc-info-text--active">{{ card.phone || '-' }}</text>
              </view>
              <view class="lc-info-item">
                <image class="lc-icon" :src="gradeIcon" mode="aspectFit" />
                <text class="lc-info-text">{{ card.leadLevel || '-' }}级线索</text>
              </view>
            </view>
            <view class="lc-tags">
              <view class="lc-info-item">
                <image class="lc-icon" :src="iconIndustry" mode="aspectFit" />
                <text class="lc-info-text">{{ card.customerIndustryLabel || '-' }}</text>
              </view>
              <view class="lc-info-item">
                <image class="lc-icon" :src="locationIcon" mode="aspectFit" />
                <text class="lc-info-text">{{ regionDisplay(card) || '-' }}</text>
              </view>
            </view>
            <view class="lc-note">
              <text class="lc-note-label">最新跟进：</text>
              <text class="lc-note-text">{{ card.remark || '暂无' }}</text>
            </view>
          </view>
        </template>

        <view v-if="loading && list.length > 0" class="leads-loading-more">
          <text class="leads-loading-more-text">加载更多...</text>
        </view>

        <view v-if="!loading && list.length === 0" class="leads-empty">
          <text class="leads-empty-text">暂无数据</text>
        </view>

        <view v-if="!hasMore && list.length > 0" class="leads-empty">
          <text class="leads-empty-text">没有更多了</text>
        </view>
      </scroll-view>
    </view>

    <FilterPopup v-model="showFilter" :sidebar-items="filterSidebarItems" @confirm="onFilterConfirm"
      @clear="onFilterClear" />

    <tab-bar />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import FilterPopup from './components/FilterPopup.vue'
import { getLeadList, getLeadsPools, assignLeads, claimLeads, type LeadItem, type LeadListSummary } from '@/api/lead'
import gradeIcon from '@/assets/dev/icon-grade.png'
import locationIcon from '@/assets/dev/icon-location.png'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'
import iconPhone from '@/assets/dev/icon-phone.png'
import iconIndustry from '@/assets/dev/icon-industry.png'

const TAB_MAP: Record<string, string> = {
  all: 'all',
  pending_followup: 'pending_followup',
  soon_recycle: 'soon_recycle',
  operation: 'operation',
  sales: 'sales',
  development: 'development',
  global: 'global'
}

const STATUS_LABEL: Record<string, string> = {
  pending: '待定',
  valid: '有效',
  invalid: '无效',
  duplicate: '重复',
}

const leadsTabs = [
  { label: '全部', value: 'all' },
  { label: '待跟进线索', value: 'pending_followup' },
  { label: '即将回收线索', value: 'soon_recycle' },
  { label: '运营公海', value: 'operation' },
  { label: '销售公海', value: 'sales' },
  { label: '开发公海', value: 'development' },
  { label: '大公海', value: 'global' },
]

const POOL_TABS = ['operation', 'sales', 'development', 'global']

const activeLeadTab = ref('all')
const list = ref<LeadItem[]>([])
const summary = ref<LeadListSummary | null>(null)
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const searchKeyword = ref('')
const showFilter = ref(false)

const filters = reactive<Record<string, string[]>>({})

let searchTimer: ReturnType<typeof setTimeout> | null = null

// 筛选侧边栏配置
const filterSidebarItems = [
  { label: '客户行业', type: 'industry', paramKey: 'customerIndustries' },
  { label: '线索等级', type: 'leadLevel', paramKey: 'leadLevels' },
  { label: '省/市/区', type: 'region', paramKey: 'regionPaths' },
  { label: '渠道来源', type: 'channel', paramKey: 'channelCodes' },
  { label: '负责人', type: 'userCascader', paramKey: 'ownerUserName' },
  { label: '跟进人', type: 'userCascader', paramKey: 'followerUserName' },
  { label: '分配时间', type: 'time', paramKey: 'assignedAt' },
]

// FilterPopup 中文值 → API 英文码映射
const industryCodeMap: Record<string, string> = {
  '电气行业': 'electrical', '管道行业': 'pipeline', '卷涂行业': 'coil_coating',
  '家居行业': 'home', '家具行业': 'furniture', '交通行业': 'transportation',
  '行业类别': 'industry_category', '铝材行业': 'aluminum', '体育用品': 'sports_goods',
  '五金行业': 'hardware', '消防器材': 'fire_equipment', '新能源行业': 'new_energy',
  '重工行业': 'heavy_industry', '其他行业': 'other',
}

const leadLevelCodeMap: Record<string, string> = {
  'A级线索': 'A', 'B级线索': 'B', 'C级线索': 'C', 'D级线索': 'D',
}

const channelCodeMap: Record<string, string> = {
  '抖音平台': 'douyin', '百度平台': 'baidu', '腾讯广告': 'wechat_mp', '小红书': 'xiaohongshu',
}

const tabCount = (tabValue: string): number | null => {
  if (!summary.value) return null
  const map: Record<string, number | undefined> = {
    all: summary.value.allCount,
    pending_followup: summary.value.pendingFollowupCount,
    soon_recycle: summary.value.soonRecycleCount,
    operation: summary.value.operationPoolCount,
    sales: summary.value.salesPoolCount,
    development: summary.value.developmentPoolCount,
    global: summary.value.globalPoolCount,
  }
  return map[tabValue] ?? null
}

const statusLabel = (status: string): string => {
  return STATUS_LABEL[status] || status || '待定'
}

const statusBadgeStyle = (status: string): string => {
  if (status === 'valid') return 'lc-badge--green'
  if (status === 'invalid' || status === 'duplicate') return 'lc-badge--gray'
  return 'lc-badge--cyan'
}

const statusBadgeTextStyle = (status: string): string => {
  if (status === 'valid') return 'lc-badge-text--green'
  if (status === 'invalid' || status === 'duplicate') return 'lc-badge-text--gray'
  return 'lc-badge-text--cyan'
}

const regionDisplay = (item: LeadItem): string => {
  const parts = [item.provinceName, item.cityName, item.districtName].filter(Boolean)
  return parts.join('/')
}

const fetchList = async (reset = false) => {
  if (loading.value) return
  const currentTab = activeLeadTab.value

  if (reset) {
    page.value = 1
    list.value = []
    hasMore.value = true
  }

  loading.value = true
  try {
    const params: Record<string, unknown> = {
      tab: TAB_MAP[currentTab] || 'all',
      page: page.value,
      pageSize,
    }

    // 搜索关键词
    if (searchKeyword.value.trim()) {
      params.customerName = searchKeyword.value.trim()
    }

    // 客户行业
    if (filters.customerIndustries?.length) {
      params.customerIndustries = filters.customerIndustries.map(v => industryCodeMap[v] || v)
    }
    // 线索等级
    if (filters.leadLevels?.length) {
      params.leadLevels = filters.leadLevels.map(v => leadLevelCodeMap[v] || v)
    }
    // 省市区路径
    if (filters.regionPaths?.length) {
      params.regionPaths = filters.regionPaths
    }
    // 渠道来源
    if (filters.channelCodes?.length) {
      params.channelCodes = filters.channelCodes.map(v => channelCodeMap[v] || v)
    }
    // 负责人
    if (filters.ownerUserName?.length) {
      params.ownerUserName = filters.ownerUserName[0]
    }
    // 跟进人
    if (filters.followerUserName?.length) {
      params.followerUserName = filters.followerUserName[0]
    }
    // 分配时间
    if (filters.assignedAt?.length) {
      if (filters.assignedAt[0]) params.assignedAtStart = filters.assignedAt[0]
      if (filters.assignedAt[1]) params.assignedAtEnd = filters.assignedAt[1]
    }
    const isPoolTab = POOL_TABS.includes(currentTab)
    if (isPoolTab) {
      delete params.tab
      params.tab = currentTab
      const res = await getLeadsPools(params as Parameters<typeof getLeadsPools>[0])
      if (reset) {
        list.value = res.items || []
      } else {
        list.value = [...list.value, ...(res.items || [])]
      }
      hasMore.value = list.value.length < res.total
    } else {
      const res = await getLeadList(params as Parameters<typeof getLeadList>[0])
      if (reset) {
        list.value = res.items || []
      } else {
        list.value = [...list.value, ...(res.items || [])]
      }
      summary.value = res.summary || null
      hasMore.value = list.value.length < res.total
    }
  } catch {
    // 请求失败保持当前数据
  } finally {
    loading.value = false
  }
}

const onTabChange = (tabValue: string) => {
  if (activeLeadTab.value === tabValue) return
  activeLeadTab.value = tabValue
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

const applyFilter = (key: string, values: string[]) => {
  if (values.length === 0) {
    delete filters[key]
  } else {
    filters[key] = values
  }
}

const onFilterConfirm = (result: { type: string; selected: string[]; startTime?: string; endTime?: string; paramKey?: string; userName?: string; userId?: number }) => {

  const key = result.paramKey || result.type
  if (result.type === 'time') {
    applyFilter(key, [result.startTime || '', result.endTime || ''].filter(Boolean))
  } else if (result.type === 'userCascader') {
    applyFilter(key, result.userName ? [result.userName] : [])
  } else {
    applyFilter(key, [...result.selected])
  }

  showFilter.value = false
  fetchList(true)
}

const onFilterClear = (payload: { type: string; paramKey?: string }) => {
  const key = payload.paramKey || payload.type
  delete filters[key]
  fetchList(true)
}

const goAddLead = () => {
  Taro.navigateTo({ url: '/subpackages/dev/leads/add-lead/index' })
}

const goDetail = (id: number) => {
  Taro.navigateTo({ url: `/subpackages/dev/leads/detail/index?id=${id}` })
}

const onAssignPool = async (_id: number) => {
  Taro.showToast({ title: '功能开发中', icon: 'none' })
}

const onClaimPool = async (id: number) => {
  try {
    await claimLeads({ leadIds: [id] })
    Taro.showToast({ title: '领取成功', icon: 'success' })
    fetchList(true)
  } catch (e) {
    Taro.showToast({ title: (e as Error).message || '领取失败', icon: 'none' })
  }
}

onMounted(() => {
  fetchList(true)
})

useDidShow(() => {
  fetchList(true)
})
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
  flex-wrap: nowrap;
  gap: 40rpx;
}

.leads-tab {
  display: inline-flex;
  flex-shrink: 0;
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

.leads-tab-count {
  font-size: 28rpx;
}

.leads-list-scroll {
  height: calc(100vh - 400rpx);
}

.lc-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 20rpx;
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
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lc-badge {
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

.leads-empty {
  display: flex;
  justify-content: center;
  padding: 60rpx 0;
}

.leads-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.leads-loading-more {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.leads-loading-more-text {
  font-size: 26rpx;
  color: #9292A5;
}

/* ====== 公海卡片 ====== */
.pool-icon {
  width: 36rpx;
  height: 36rpx;
  border-radius: 5rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pool-icon--phone {
  background: #EDFAF5;
}
.pool-icon--default {
  background: #F0F2FA;
}
.pool-icon-img {
  width: 24rpx;
  height: 24rpx;
}

.lc-actions {
  display: flex;
  gap: 20rpx;
}
.pool-btn {
  flex: 1;
  height: 56rpx;
  border-radius: 8rpx;
  background: #FFFFFF;
  border: 1rpx solid #37AE7E;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pool-btn-text {
  font-size: 24rpx;
  color: #37AE7E;
}
</style>
