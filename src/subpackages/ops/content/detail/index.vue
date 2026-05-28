<template>
  <view class="detail-page">
    <navBar title="查看营销任务" />
    <scroll-view class="page-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="form-card">
        <view class="form-row">
          <text class="form-label">营销任务编号</text>
          <text class="form-value">{{ detail.taskNo || '-' }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">营销任务名称</text>
          <text class="form-value">{{ detail.name || '-' }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">受众客户</text>
          <text class="form-value">{{ audienceLabel }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">营销渠道</text>
          <text class="form-value">{{ formatChannels(detail.channels) }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">是否循环推送</text>
          <text class="form-value">{{ detail.isRecurring ? '是' : '否' }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">循环间隔</text>
          <text class="form-value">{{ detail.isRecurring ? detail.recurrenceIntervalDays + '天' : '无循环' }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">任务开始时间</text>
          <text class="form-value">{{ formatDate(detail.startAt) }}</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">任务状态</text>
          <text class="form-value">{{ TASK_STATUS_MAP[detail.status] || detail.status }}</text>
        </view>
      </view>

      <view class="editor-card">
        <view class="editor-header">
          <text class="editor-title">营销内容</text>
        </view>
        <view v-if="detail.contentHtml" class="editor-preview">
          <rich-text :nodes="detail.contentHtml" />
        </view>
        <view v-else class="editor-preview">
          <image class="editor-image" src="https://via.placeholder.com/670x878" mode="widthFix" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import navBar from '@/components/NavBar.vue'
import { getTaskDetail, TASK_STATUS_MAP, type TaskDetailResponse } from '@/api/automation'

const detail = ref<TaskDetailResponse>({
  id: 0,
  taskNo: '',
  name: '',
  status: '',
  isRecurring: false,
  recurrenceIntervalDays: 0,
  startAt: '',
  lastRunAt: '',
  nextRunAt: '',
  audienceType: '',
  contentHtml: '',
  channels: [],
  materials: [],
  runs: [],
  companyId: 0,
  departmentId: 0,
  createdAt: '',
  updatedAt: '',
})

const audienceLabel = computed(() => {
  const map: Record<string, string> = {
    all_customers: '所有客户',
    inactive_over_30_days: '一个月以上未联系客户',
  }
  return map[detail.value.audienceType] || detail.value.audienceType || '所有客户'
})

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return dateStr.replace(/T/, ' ').replace(/\..*/, '').slice(0, 16)
}

function formatChannels(channels: { name: string }[]): string {
  if (!channels || channels.length === 0) return '-'
  return channels.map(c => c.name).join(' | ')
}

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  if (!id) return
  try {
    const res = await getTaskDetail(id)
    detail.value = res
  } catch {
    // 错误已在 request 层统一处理
  }
}

fetchDetail()
</script>

<style>
.detail-page {
  min-height: 100vh;
  background: #F5F7F9;
}
.page-scroll {
  padding: 20rpx 0;
}

.form-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin: 20rpx;
  display: flex;
  flex-direction: column;
}
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
  padding: 28rpx 0;
}
.form-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}
.form-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}
.form-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.editor-card {
  background: #FFFFFF;
  border-radius: 16rpx 16rpx 0 0;
  margin: 0 20rpx 20rpx;
  overflow: hidden;
}
.editor-header {
  padding: 32rpx 40rpx 0;
}
.editor-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}
.editor-material {
  font-size: 28rpx;
  color: #37AE7E;
}
.editor-preview {
  margin: 20rpx 40rpx 40rpx;
  border: 2rpx solid #EBEBEB;
  border-radius: 8rpx;
  overflow: hidden;
  padding: 16rpx;
  min-height: 200rpx;
}
.editor-image {
  width: 100%;
  display: block;
}
</style>
