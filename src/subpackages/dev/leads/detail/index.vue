<template>
  <view class="detail-page">
    <scroll-view class="page-scroll" scroll-y :enhanced="true" :show-scrollbar="false" v-if="lead">
      <!-- 基本信息 -->
      <view class="section">
        <view class="section-title">基本信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">线索编号</text>
            <text class="info-value">{{ lead.leadNo || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">企业名称</text>
            <text class="info-value">{{ lead.customerName || lead.companyName || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">线索状态</text>
            <text class="info-value info-value--status">{{ statusLabel(lead.status) }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">线索等级</text>
            <text class="info-value">{{ lead.leadLevel || '-' }}级</text>
          </view>
        </view>
      </view>

      <!-- 联系信息 -->
      <view class="section">
        <view class="section-title">联系信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">联系人</text>
            <text class="info-value">{{ lead.contactName || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text class="info-value info-value--phone">{{ lead.phone || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">微信号</text>
            <text class="info-value">{{ lead.wechat || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">WhatsApp</text>
            <text class="info-value">{{ lead.whatsapp || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">邮箱</text>
            <text class="info-value">{{ lead.email || '-' }}</text>
          </view>
        </view>
      </view>

      <!-- 业务信息 -->
      <view class="section">
        <view class="section-title">业务信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">客户行业</text>
            <text class="info-value">{{ lead.customerIndustryLabel || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">渠道来源</text>
            <text class="info-value">{{ lead.channelName || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">所在地区</text>
            <text class="info-value">{{ regionDisplay(lead) || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">来源部门</text>
            <text class="info-value">{{ lead.sourceDepartment || '-' }}</text>
          </view>
        </view>
      </view>

      <!-- 负责人/跟进人 -->
      <view class="section">
        <view class="section-title">跟进信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">负责人</text>
            <text class="info-value">{{ lead.ownerUserName || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">跟进人</text>
            <text class="info-value">{{ lead.followerUserName || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">最近跟进</text>
            <text class="info-value">{{ lead.lastFollowedAt || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">下次跟进</text>
            <text class="info-value">{{ lead.nextFollowAt || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">分配时间</text>
            <text class="info-value">{{ lead.assignedAt || '-' }}</text>
          </view>
          <view class="info-row" v-if="lead.recycleDueAt">
            <text class="info-label">回收时间</text>
            <text class="info-value info-value--warn">{{ lead.recycleDueAt }}</text>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="section" v-if="lead.remark">
        <view class="section-title">备注</view>
        <view class="info-card">
          <text class="remark-text">{{ lead.remark }}</text>
        </view>
      </view>

      <!-- 操作区域 -->
      <view class="action-section">
        <!-- 更新状态 -->
        <view class="action-card">
          <view class="action-card-title">更新线索状态</view>
          <view class="action-card-body">
            <view class="status-tags">
              <view
                v-for="s in statusOptions"
                :key="s.value"
                class="status-tag"
                :class="{ 'status-tag--active': updateStatus === s.value }"
                @tap="updateStatus = s.value"
              >
                <text class="status-tag-text" :class="{ 'status-tag-text--active': updateStatus === s.value }">{{ s.label }}</text>
              </view>
            </view>
            <view class="status-reason" v-if="updateStatus === 'invalid'">
              <input class="form-input" v-model="invalidReason" placeholder="请输入无效原因" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            </view>
            <view class="action-btn" :class="{ 'action-btn--loading': statusUpdating }" @tap="onUpdateStatus">
              <text class="action-btn-text">{{ statusUpdating ? '更新中...' : '更新状态' }}</text>
            </view>
          </view>
        </view>

        <!-- 添加跟进记录 -->
        <view class="action-card">
          <view class="action-card-title">添加跟进记录</view>
          <view class="action-card-body">
            <textarea class="follow-textarea" v-model="followContent" placeholder="请输入跟进内容" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <view class="follow-extra">
              <input class="form-input follow-input" v-model="followType" placeholder="跟进方式（如：电话/拜访）" placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <input class="form-input follow-input" v-model="followResult" placeholder="跟进结果" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            </view>
            <view class="action-btn" :class="{ 'action-btn--loading': followAdding }" @tap="onAddFollow">
              <text class="action-btn-text">{{ followAdding ? '添加中...' : '添加跟进记录' }}</text>
            </view>
          </view>
        </view>

        <!-- 转为客户与商机 -->
        <view class="action-card">
          <view class="action-btn action-btn--primary" :class="{ 'action-btn--loading': converting }" @tap="onConvert">
            <text class="action-btn-text">{{ converting ? '转换中...' : '转为客户与商机' }}</text>
          </view>
        </view>
      </view>

      <view class="bottom-space" />
    </scroll-view>

    <view v-if="!lead && !loading" class="empty-page">
      <text class="empty-text">线索不存在</text>
    </view>
    <view v-if="loading" class="empty-page">
      <text class="empty-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getLeadDetail, updateLeadStatus, addFollowRecord, createCustomerAndOpportunity, type LeadItem } from '@/api/lead'

const STATUS_LABEL: Record<string, string> = {
  pending: '待处理',
  valid: '有效',
  invalid: '无效',
  duplicate: '重复',
}

const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '有效', value: 'valid' },
  { label: '无效', value: 'invalid' },
  { label: '重复', value: 'duplicate' },
]

const leadId = ref(0)
const lead = ref<LeadItem | null>(null)
const loading = ref(true)

const updateStatus = ref('')
const invalidReason = ref('')
const statusUpdating = ref(false)

const followContent = ref('')
const followType = ref('')
const followResult = ref('')
const followAdding = ref(false)

const converting = ref(false)

function statusLabel(status: string): string {
  return STATUS_LABEL[status] || status || '-'
}

function regionDisplay(item: LeadItem): string {
  const parts = [item.provinceName, item.cityName, item.districtName].filter(Boolean)
  return parts.join('/')
}

async function fetchDetail() {
  loading.value = true
  try {
    lead.value = await getLeadDetail(leadId.value)
  } catch {
    lead.value = null
  } finally {
    loading.value = false
  }
}

async function onUpdateStatus() {
  if (!updateStatus.value) {
    Taro.showToast({ title: '请选择状态', icon: 'none' })
    return
  }
  if (updateStatus.value === 'invalid' && !invalidReason.value.trim()) {
    Taro.showToast({ title: '请输入无效原因', icon: 'none' })
    return
  }
  if (statusUpdating.value) return

  statusUpdating.value = true
  try {
    await updateLeadStatus(leadId.value, {
      status: updateStatus.value,
      invalidReason: updateStatus.value === 'invalid' ? invalidReason.value.trim() : undefined,
    })
    Taro.showToast({ title: '状态更新成功', icon: 'success' })
    updateStatus.value = ''
    invalidReason.value = ''
    fetchDetail()
  } catch (e) {
    Taro.showToast({ title: (e as Error).message || '更新失败', icon: 'none' })
  } finally {
    statusUpdating.value = false
  }
}

async function onAddFollow() {
  if (!followContent.value.trim()) {
    Taro.showToast({ title: '请输入跟进内容', icon: 'none' })
    return
  }
  if (followAdding.value) return

  followAdding.value = true
  try {
    await addFollowRecord(leadId.value, {
      content: followContent.value.trim(),
      followType: followType.value.trim() || undefined,
      result: followResult.value.trim() || undefined,
    })
    Taro.showToast({ title: '跟进记录添加成功', icon: 'success' })
    followContent.value = ''
    followType.value = ''
    followResult.value = ''
  } catch (e) {
    Taro.showToast({ title: (e as Error).message || '添加失败', icon: 'none' })
  } finally {
    followAdding.value = false
  }
}

async function onConvert() {
  if (converting.value) return

  const res = await new Promise<boolean>((resolve) => {
    Taro.showModal({
      title: '确认操作',
      content: '确定将该线索转为客户并创建商机？',
      success: (r) => resolve(r.confirm),
    })
  })
  if (!res) return

  converting.value = true
  try {
    await createCustomerAndOpportunity(leadId.value)
    Taro.showToast({ title: '转换成功', icon: 'success' })
    fetchDetail()
  } catch (e) {
    Taro.showToast({ title: (e as Error).message || '转换失败', icon: 'none' })
  } finally {
    converting.value = false
  }
}

onMounted(() => {
  const pages = Taro.getCurrentPages()
  const current = pages[pages.length - 1]
  const id = current?.options?.id
  if (id) {
    leadId.value = Number(id)
    fetchDetail()
  } else {
    loading.value = false
  }
})
</script>

<style>
.detail-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.page-scroll {
  height: 100vh;
}

.section {
  margin: 24rpx 40rpx 0;
}

.section-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #9292A5;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.info-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}
.info-row + .info-row {
  border-top: 1rpx solid #F4F4F4;
}

.info-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.info-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}
.info-value--phone {
  color: #37AE7E;
}
.info-value--status {
  color: #15C2E9;
  font-weight: 500;
}
.info-value--warn {
  color: #E37318;
}

.remark-text {
  font-size: 28rpx;
  color: #1A1D24;
  line-height: 44rpx;
}

.action-section {
  margin: 24rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.action-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
}

.action-card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1D24;
  margin-bottom: 24rpx;
}

.action-card-body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.status-tag {
  padding: 12rpx 24rpx;
  background: #F6F7FB;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
}
.status-tag--active {
  background: #EDFAF5;
  border-color: #37AE7E;
}

.status-tag-text {
  font-size: 26rpx;
  color: #62687D;
}
.status-tag-text--active {
  color: #37AE7E;
  font-weight: 500;
}

.status-reason {
  margin-top: -8rpx;
}

.follow-textarea {
  width: 100%;
  min-height: 160rpx;
  background: #F6F7FB;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #1A1D24;
  box-sizing: border-box;
}

.follow-extra {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.follow-input {
  height: 72rpx;
  background: #F6F7FB;
  border-radius: 8rpx;
  padding: 0 20rpx;
}

.form-input {
  width: 100%;
  height: 72rpx;
  background: #F6F7FB;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #1A1D24;
  box-sizing: border-box;
}

.action-btn {
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}
.action-btn--primary {
  background: #37AE7E;
  border-color: #37AE7E;
}
.action-btn--loading {
  opacity: 0.7;
}

.action-btn-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #37AE7E;
}
.action-btn--primary .action-btn-text {
  color: #FFFFFF;
}

.bottom-space {
  height: 80rpx;
}

.empty-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.empty-text {
  font-size: 28rpx;
  color: #9292A5;
}
</style>
