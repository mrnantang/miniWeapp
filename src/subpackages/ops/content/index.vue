<template>
  <view class="page">
    <view class="header">
      <text class="header-title">营销</text>
    </view>

    <view class="leads-search-row">
      <view class="leads-search-box">
        <input class="leads-search-input" v-model="keyword" placeholder="请输入搜索" placeholder-style="color:#9292A5;font-size:30rpx" @confirm="onSearch" />
        <image class="leads-search-icon" :src="iconSearch" mode="aspectFit" @tap="onSearch" />
      </view>
      <view class="leads-btn" @tap="showFilter = true">
        <image :src="iconFilter" mode="aspectFit" />
      </view>
      <view class="leads-btn" @tap="goAdd">
        <image :src="iconAdd" mode="aspectFit" />
      </view>
    </view>

    <scroll-view class="task-list" scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="onLoadMore">
      <view v-if="loading" class="task-loading">加载中...</view>
      <view v-else-if="taskList.length === 0" class="task-empty">
        <text class="task-empty-text">暂无营销任务</text>
      </view>
      <view v-else v-for="item in taskList" :key="item.id" class="task-card">
        <view class="task-card-header">
          <text class="task-card-name">{{ item.name }}</text>
          <view class="task-card-badge" :class="'task-card-badge--' + getBadgeType(item.status)">
            <text class="task-card-badge-text">{{ TASK_STATUS_MAP[item.status] || item.status }}</text>
          </view>
        </view>

        <view class="task-card-body">
          <view class="task-card-row">
            <view class="task-card-field">
              <text class="task-card-label">任务编号</text>
              <text class="task-card-value">{{ item.taskNo }}</text>
            </view>
            <view class="task-card-field task-card-field--fixed">
              <text class="task-card-label">营销渠道</text>
              <text class="task-card-value">{{ formatChannels(item.channels) }}</text>
            </view>
          </view>
          <view class="task-card-row">
            <view class="task-card-field">
              <text class="task-card-label">循环间隔</text>
              <text class="task-card-value">{{ item.isRecurring ? item.recurrenceIntervalDays + '天' : '无循环' }}</text>
            </view>
            <view class="task-card-field task-card-field--fixed">
              <text class="task-card-label">开始时间</text>
              <text class="task-card-value">{{ formatDate(item.startAt) }}</text>
            </view>
          </view>
        </view>

        <view class="task-card-actions">
          <view class="task-card-btn task-card-btn--delete" @tap="onDelete(item)">
            <text class="task-card-btn-text">删除</text>
          </view>
          <view class="task-card-btn task-card-btn--edit" @tap="onView(item)">
            <text class="task-card-btn-text">查看</text>
          </view>
        </view>
      </view>
      <view v-if="taskList.length > 0" class="task-load-more">
        <text v-if="hasMore" @tap="onLoadMore">加载更多</text>
        <text v-else style="color:#BBBEC2">已加载全部</text>
      </view>
    </scroll-view>

    <tab-bar />

    <!-- 筛选弹窗 -->
    <nut-popup v-model:visible="showFilter" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '680rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">全部筛选</text>
        </view>
        <view class="filter-body">
          <scroll-view class="filter-sidebar" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="filter-sidebar-item filter-sidebar-item--active">
              <text class="filter-sidebar-text filter-sidebar-text--active">任务状态</text>
            </view>
          </scroll-view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="org-tags">
              <view class="org-tag-row">
                <view
                  v-for="s in statusOptions"
                  :key="s"
                  class="org-tag"
                  :class="{ 'org-tag--active': selectedStatus === s }"
                  @tap="selectedStatus = s"
                >
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selectedStatus === s }">{{ s }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="filter-footer">
          <view class="filter-footer-btn filter-footer-clear" @tap="selectedStatus = '全部'">
            <text class="filter-footer-clear-text">清空选择</text>
          </view>
          <view class="filter-footer-btn filter-footer-submit" @tap="onFilterConfirm">
            <text class="filter-footer-submit-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <!-- 删除确认弹窗 -->
    <nut-popup v-model:visible="showDeletePopup" position="center" :style="{ borderRadius: '24rpx', width: '510rpx' }" :z-index="2100">
      <view class="delete-popup">
        <text class="delete-popup-title">删除营销任务</text>
        <text class="delete-popup-desc">请确认是否删除该任务</text>
        <view class="delete-popup-actions">
          <view class="delete-popup-btn delete-popup-btn--cancel" @tap="showDeletePopup = false">
            <text class="delete-popup-btn-text--cancel">取消</text>
          </view>
          <view class="delete-popup-btn delete-popup-btn--confirm" @tap="onDeleteConfirm">
            <text class="delete-popup-btn-text--confirm">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import { getTaskList, deleteTask, TASK_STATUS_MAP, TASK_STATUS_BADGE_MAP, type TaskListItem } from '@/api/automation'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'

const keyword = ref('')
const loading = ref(false)
const taskList = ref<TaskListItem[]>([])
const page = ref(1)
const pageSize = 20
const hasMore = ref(true)

const showFilter = ref(false)
const selectedStatus = ref('全部')
const statusOptions = ['全部', '待开始', '进行中', '已完成', '已取消']

const statusValueMap: Record<string, string> = {
  '待开始': 'pending',
  '进行中': 'running',
  '已完成': 'completed',
  '已取消': 'cancelled',
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return dateStr.replace(/T/, ' ').replace(/\..*/, '').slice(0, 16)
}

function formatChannels(channels: { name: string }[]): string {
  if (!channels || channels.length === 0) return '-'
  return channels.map(c => c.name).join(' | ')
}

function getBadgeType(status: string): string {
  return TASK_STATUS_BADGE_MAP[status] || 'pending'
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
    if (keyword.value) params.name = keyword.value
    if (selectedStatus.value !== '全部') {
      params.statuses = [statusValueMap[selectedStatus.value]]
    }
    const res = await getTaskList(params)
    if (reset) {
      taskList.value = res.items || []
    } else {
      taskList.value = [...taskList.value, ...(res.items || [])]
    }
    hasMore.value = taskList.value.length < res.total
  } catch {
    // 错误已在 request 层统一处理
  } finally {
    loading.value = false
  }
}

function onSearch() { fetchList(true) }
function onLoadMore() {
  if (!hasMore.value || loading.value) return
  page.value++
  fetchList(false)
}

function onFilterConfirm() {
  showFilter.value = false
  fetchList(true)
}

function onView(item: TaskListItem) {
  Taro.navigateTo({ url: '/subpackages/ops/content/detail/index?id=' + item.id })
}

const showDeletePopup = ref(false)
const deleteTarget = ref<TaskListItem | null>(null)

function onDelete(item: TaskListItem) {
  deleteTarget.value = item
  showDeletePopup.value = true
}

async function onDeleteConfirm() {
  showDeletePopup.value = false
  if (!deleteTarget.value) return
  try {
    await deleteTask(deleteTarget.value.id, deleteTarget.value.companyId)
    Taro.showToast({ title: '已删除', icon: 'success' })
    fetchList(true)
  } catch {
    // 错误已在 request 层统一处理
  }
}

const goAdd = () => {
  Taro.navigateTo({ url: '/subpackages/ops/content/add/index' })
}

fetchList(true)
</script>

<style>
.page {
  min-height: 100vh;
  background: #F5F7F9;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 104rpx 0 12rpx;
}
.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #25293B;
}

.leads-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 16rpx 20rpx;
}
.leads-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 68rpx;
  background: #FFFFFF;
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

.task-list {
  padding: 16rpx 20rpx 200rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  box-sizing: border-box;
}

.task-loading,
.task-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.task-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.task-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 28rpx;
}

.task-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
}
.task-card-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}
.task-card-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rpx 12rpx;
  height: 40rpx;
  border-radius: 6rpx;
}
.task-card-badge--pending {
  background: #FFF4E5;
}
.task-card-badge--active {
  background: #EDFAF5;
}
.task-card-badge--done {
  background: #EDFAF5;
}
.task-card-badge--gray {
  background: #F5F5F5;
}
.task-card-badge-text {
  font-size: 24rpx;
  color: #FF9500;
  line-height: 36rpx;
}
.task-card-badge--active .task-card-badge-text {
  color: #37AE7E;
}
.task-card-badge--done .task-card-badge-text {
  color: #37AE7E;
}
.task-card-badge--gray .task-card-badge-text {
  color: #9292A5;
}

.task-card-body {
  background: #F9FAFB;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.task-card-row {
  display: flex;
  gap: 20rpx;
}
.task-card-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.task-card-field--fixed {
  flex: none;
  width: 314rpx;
}
.task-card-label {
  font-size: 26rpx;
  color: #62687D;
}
.task-card-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.task-card-actions {
  display: flex;
  gap: 24rpx;
}
.task-card-btn {
  flex: 1;
  height: 64rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task-card-btn--delete {
  background: #FFF0F0;
  border: 2rpx solid #FFD8D8;
}
.task-card-btn--edit {
  background: #EDFAF5;
  border: 2rpx solid #B1E9D3;
}
.task-card-btn-text {
  font-size: 28rpx;
  color: #F53F3F;
}
.task-card-btn--edit .task-card-btn-text {
  color: #37AE7E;
}

.task-load-more {
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
}
.filter-header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #1A1D24;
}
.filter-footer {
  display: flex;
  gap: 28rpx;
  padding: 20rpx 40rpx 0;
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

.filter-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.filter-sidebar {
  width: 220rpx;
  background: #F6F7FB;
  flex-shrink: 0;
  height: 100%;
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
  white-space: nowrap;
}
.filter-sidebar-text--active {
  color: #37AE7E;
}
.filter-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24rpx;
}
.org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}
.org-tag {
  width: calc(50% - 12rpx);
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  text-align: center;
  box-sizing: border-box;
}
.org-tag--active {
  background: #EDFAF5;
}
.org-tag-text {
  font-size: 26rpx;
  color: #62687D;
}
.org-tag-text--active {
  color: #37AE7E;
}

.delete-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 40rpx;
}
.delete-popup-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #1A1D24;
  text-align: center;
  width: 100%;
}
.delete-popup-desc {
  font-size: 30rpx;
  color: #62687D;
  text-align: center;
  width: 398rpx;
}
.delete-popup-actions {
  display: flex;
  gap: 32rpx;
  align-self: stretch;
  margin-top: 6rpx;
}
.delete-popup-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.delete-popup-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}
.delete-popup-btn-text--cancel {
  font-size: 32rpx;
  color: #37AE7E;
}
.delete-popup-btn--confirm {
  background: #37AE7E;
}
.delete-popup-btn-text--confirm {
  font-size: 32rpx;
  color: #FFFFFF;
}
</style>
