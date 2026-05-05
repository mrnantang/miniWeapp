<template>
  <view class="detail-page">
    <scroll-view class="detail-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="detail-card">
        <view class="detail-card-head">
          <text class="detail-card-title">{{ detail.name }}</text>
          <view class="detail-edit-btn" @tap="toggleEdit">
            <text class="detail-edit-text">{{ isEditing ? '完成' : '编辑' }}</text>
          </view>
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">商机编号</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.oppNo }}</text>
          <input v-else class="detail-input" v-model="detail.oppNo" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">关联客户</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.customer }}</text>
          <input v-else class="detail-input" v-model="detail.customer" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">预计销售金额</text>
          <text v-if="!isEditing" class="detail-value">¥{{ detail.amount }}</text>
          <input v-else class="detail-input" v-model="detail.amount" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">预计成交日期</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.signDate }}</text>
          <input v-else class="detail-input" v-model="detail.signDate" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">商机状态</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.status }}</text>
          <input v-else class="detail-input" v-model="detail.status" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">需求产品</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.product }}</text>
          <input v-else class="detail-input" v-model="detail.product" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">负责人</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.owner }}</text>
          <input v-else class="detail-input" v-model="detail.owner" />
        </view>
      </view>

      <view class="detail-card">
        <view class="detail-card-head">
          <text class="detail-card-title">客户跟进记录</text>
          <view class="detail-tabs">
            <text class="detail-tab" :class="{ 'detail-tab--active': followTab === 'follow' }" @tap="followTab = 'follow'">跟进</text>
            <view class="detail-tab-sep" />
            <text class="detail-tab" :class="{ 'detail-tab--active': followTab === 'visit' }" @tap="followTab = 'visit'">拜访</text>
          </view>
        </view>
        <view class="detail-divider" />

        <view v-if="followTab === 'follow'" class="timeline">
          <view v-for="(item, idx) in followRecords" :key="idx" class="timeline-item">
            <view class="timeline-left">
              <view class="timeline-dot" />
              <view v-if="idx < followRecords.length - 1" class="timeline-line" />
            </view>
            <view class="timeline-content">
              <view class="timeline-head">
                <view class="timeline-head-left">
                  <text class="timeline-date">{{ item.time }}</text>
                  <text class="timeline-tag">({{ item.tag }})</text>
                </view>
                <view class="timeline-actions">
                  <text class="timeline-action-text" @tap="editRecord(idx)">编辑</text>
                  <text class="timeline-action-text timeline-action-text--delete" @tap="deleteRecord(idx)">删除</text>
                </view>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进人：</text>
                <text class="timeline-info-text">{{ item.follower }}</text>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进方式：</text>
                <text class="timeline-info-text">{{ item.method }}</text>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进内容：</text>
                <text class="timeline-info-text">{{ item.content }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="followTab === 'visit'" class="timeline">
          <view v-for="(item, idx) in visitRecords" :key="idx" class="timeline-item">
            <view class="timeline-left">
              <view class="timeline-dot" />
              <view v-if="idx < visitRecords.length - 1" class="timeline-line" />
            </view>
            <view class="timeline-content">
              <view class="timeline-head">
                <view class="timeline-head-left">
                  <text class="timeline-date">{{ item.time }}</text>
                  <text class="timeline-tag">({{ item.tag }})</text>
                </view>
                <view class="timeline-actions">
                  <text class="timeline-action-text" @tap="editVisitRecord(idx)">编辑</text>
                  <text class="timeline-action-text timeline-action-text--delete" @tap="deleteVisitRecord(idx)">删除</text>
                </view>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进人：</text>
                <text class="timeline-info-text">{{ item.follower }}</text>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进方式：</text>
                <text class="timeline-info-text">{{ item.method }}</text>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进内容：</text>
                <text class="timeline-info-text">{{ item.content }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="detail-bottom-spacer" />
    </scroll-view>

    <view class="detail-bottom-bar">
      <view class="detail-bottom-btn detail-bottom-btn--danger" @tap="onFail">
        <text class="detail-bottom-btn-text detail-bottom-btn-text--danger">转化失败</text>
      </view>
      <view class="detail-bottom-btn detail-bottom-btn--primary" @tap="onAddFollow">
        <text class="detail-bottom-btn-text detail-bottom-btn-text--primary">新增跟进记录</text>
      </view>
      <view class="detail-bottom-btn detail-bottom-btn--primary" @tap="onCheckIn">
        <text class="detail-bottom-btn-text detail-bottom-btn-text--primary">签到打卡</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'

const isEditing = ref(false)
const followTab = ref('follow')

const detail = reactive({
  name: '金石科技高端机采购书',
  oppNo: 'XJ-281782',
  customer: '金石科技',
  amount: '128102.91',
  signDate: '2024/01/23',
  status: '接触中',
  product: '自动喷粉枪',
  owner: '张文',
})

const followRecords = ref([
  { time: '2025.01.23 12:00:59', tag: '签约中', follower: '孙大星', method: '电话', content: '客户有意向，但未表明哪款产品' },
  { time: '2025.01.21 12:00:59', tag: '商务谈判', follower: '孙大星', method: '电话', content: '客户有意向，但未表明哪款产品' },
  { time: '2025.01.15 12:00:59', tag: '方案/报价', follower: '孙大星', method: '电话', content: '客户有意向，但未表明哪款产品' },
])

const visitRecords = ref([
  { time: '2025.01.20 10:30:00', tag: '上门拜访', follower: '张文', method: '面谈', content: '实地考察客户工厂，了解产线需求' },
])

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const editRecord = (idx) => {
  Taro.showToast({ title: '编辑跟进记录', icon: 'none' })
}

const deleteRecord = (idx) => {
  Taro.showModal({
    title: '提示',
    content: '确定删除该跟进记录吗？',
    success: (res) => {
      if (res.confirm) {
        followRecords.value.splice(idx, 1)
      }
    },
  })
}

const editVisitRecord = (idx) => {
  Taro.showToast({ title: '编辑拜访记录', icon: 'none' })
}

const deleteVisitRecord = (idx) => {
  Taro.showModal({
    title: '提示',
    content: '确定删除该拜访记录吗？',
    success: (res) => {
      if (res.confirm) {
        visitRecords.value.splice(idx, 1)
      }
    },
  })
}

const onFail = () => {
  Taro.showToast({ title: '转化失败', icon: 'none' })
}

const onAddFollow = () => {
  Taro.showToast({ title: '新增跟进记录', icon: 'none' })
}

const onCheckIn = () => {
  Taro.showToast({ title: '签到打卡', icon: 'none' })
}
</script>

<style>
.detail-page {
  min-height: 100vh;
  background: #F5F7F9;
  display: flex;
  flex-direction: column;
}

.detail-scroll {
  flex: 1;
  padding: 24rpx 40rpx;
}

.detail-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.detail-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
}

.detail-edit-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-edit-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #37AE7E;
}

.detail-divider {
  height: 1rpx;
  background: #E5E6EB;
  margin: 24rpx 0;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-label {
  font-size: 26rpx;
  font-weight: 400;
  color: #62687D;
  flex-shrink: 0;
}

.detail-value {
  font-size: 26rpx;
  font-weight: 400;
  color: #1A1D24;
  text-align: right;
}

.detail-input {
  font-size: 26rpx;
  font-weight: 400;
  color: #1A1D24;
  text-align: right;
  height: 44rpx;
  width: 300rpx;
}

.detail-tabs {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.detail-tab {
  font-size: 26rpx;
  font-weight: 500;
  color: #9292A5;
}

.detail-tab--active {
  color: #37AE7E;
}

.detail-tab-sep {
  width: 2rpx;
  height: 24rpx;
  background: #E5E6EB;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rpx;
  flex-shrink: 0;
  padding-top: 8rpx;
}

.timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #37AE7E;
  flex-shrink: 0;
}

.timeline-line {
  width: 2rpx;
  flex: 1;
  min-height: 80rpx;
  background: #E5E6EB;
  margin-top: 8rpx;
}

.timeline-content {
  flex: 1;
  padding-bottom: 32rpx;
  padding-left: 16rpx;
}

.timeline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.timeline-head-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.timeline-date {
  font-size: 24rpx;
  font-weight: 500;
  color: #1A1D24;
}

.timeline-tag {
  font-size: 24rpx;
  font-weight: 400;
  color: #62687D;
}

.timeline-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.timeline-action-text {
  font-size: 24rpx;
  font-weight: 400;
  color: #37AE7E;
}

.timeline-action-text--delete {
  color: #F53F3F;
}

.timeline-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.timeline-info-label {
  font-size: 24rpx;
  font-weight: 400;
  color: #62687D;
  flex-shrink: 0;
}

.timeline-info-text {
  font-size: 24rpx;
  font-weight: 400;
  color: #62687D;
}

.detail-bottom-spacer {
  height: 140rpx;
}

.detail-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 20rpx 40rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #F5F7F9;
}

.detail-bottom-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-bottom-btn--danger {
  background: #FFE6E6;
  border: 2rpx solid #F53F3F;
}

.detail-bottom-btn--primary {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.detail-bottom-btn-text {
  font-size: 32rpx;
  font-weight: 500;
}

.detail-bottom-btn-text--danger {
  color: #F53F3F;
}

.detail-bottom-btn-text--primary {
  color: #5CC79C;
}
</style>
