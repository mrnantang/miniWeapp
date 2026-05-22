<template>
  <view class="detail-page">
    <!-- 自定义导航栏 -->
    <NavBar title="线索详情">
      <!-- <template #right>
        <view class="nav-edit-btn" @tap="onEdit">
          <image class="nav-edit-icon" :src="iconEdit" mode="aspectFit" />
          <text class="nav-edit-text">编辑</text>
        </view>
      </template> -->
    </NavBar>

    <!-- 加载/空状态 -->
    <view v-if="!lead && !loading" class="empty-page">
      <text class="empty-text">线索不存在</text>
    </view>
    <view v-if="loading" class="empty-page">
      <text class="empty-text">加载中...</text>
    </view>

    <!-- 主内容 -->
    <scroll-view v-if="lead" class="detail-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 卡片1：线索基础信息 -->
      <view class="info-card">
        <!-- 标题行 -->
        <view class="card-header">
          <text class="card-header-title">线索基础信息</text>
          <view class="card-header-right" @tap="onEdit">
            <image class="card-edit-icon" :src="iconEdit" mode="aspectFit" />
            <text class="card-edit-text">编辑</text>
          </view>
        </view>
        <view class="card-divider" />

        <!-- 字段行 -->
        <view v-for="field in infoFields" :key="field.label">
          <view class="info-row">
            <text class="info-label">{{ field.label }}</text>
            <view class="info-value-wrap">
              <!-- 状态字段有圆点指示器 -->
              <view v-if="field.isStatus" class="status-dot" :class="'status-dot--' + lead.status" />
              <text class="info-value" :class="field.valueClass">{{ field.value(lead) }}</text>
            </view>
          </view>
          <view v-if="field.divider" class="row-divider" />
        </view>
      </view>

      <!-- 卡片2：重复线索信息 -->
      <view v-if="duplicateLeads.length" class="info-card">
        <view class="card-header">
          <text class="card-header-title">重复线索信息</text>
          <view class="card-toggle" @tap="showDuplicates = !showDuplicates">
            <text class="card-toggle-icon">{{ showDuplicates ? '▼' : '▶' }}</text>
          </view>
        </view>
        <view v-if="showDuplicates" class="duplicate-list">
          <view v-for="(dup, idx) in duplicateLeads" :key="idx" class="duplicate-item">
            <view class="info-row">
              <text class="info-label">企业名称</text>
              <text class="info-value">{{ dup.customerName || dup.companyName || '-' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">联系电话</text>
              <text class="info-value">{{ dup.phone || '-' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 卡片3：时间轴 -->
      <view class="info-card timeline-card">
        <!-- Tab 行 -->
        <view class="tab-row">
          <view
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="{ 'tab-item--active': activeTab === tab.key }"
            @tap="activeTab = tab.key"
          >
            <text class="tab-item-text" :class="{ 'tab-item-text--active': activeTab === tab.key }">{{ tab.label }}</text>
          </view>
        </view>
        <view class="card-divider" />

        <!-- 时间轴列表 -->
        <view class="timeline">
          <view v-if="!currentRecords.length" class="timeline-empty">暂无记录</view>

          <view v-for="(item, idx) in currentRecords" :key="idx" class="timeline-item">
            <view class="timeline-left">
              <view class="timeline-trail timeline-trail--top" />
              <view class="timeline-dot" />
              <view v-if="idx < currentRecords.length - 1" class="timeline-trail timeline-trail--bottom" />
            </view>
            <view class="timeline-content" :class="{ 'timeline-content--last': idx === currentRecords.length - 1 }">
              <view class="timeline-date-row">
                <text class="timeline-date">{{ item.time }}</text>
                <text v-if="item.tag" class="timeline-tag">{{ item.tag }}</text>
              </view>
              <view class="timeline-field">
                <text class="timeline-field-label">{{ fieldLabels.operator }}：</text>
                <text class="timeline-field-value">{{ item.operator }}</text>
              </view>
              <view v-if="activeTab === 'follow' && item.method" class="timeline-field">
                <text class="timeline-field-label">跟进方式：</text>
                <text class="timeline-field-value">{{ item.method }}</text>
              </view>
              <view v-if="activeTab === 'follow' && item.content" class="timeline-field">
                <text class="timeline-field-label">跟进内容：</text>
                <text class="timeline-field-value">{{ item.content }}</text>
              </view>
              <view v-if="item.extraLabel" class="timeline-field">
                <text class="timeline-field-label">{{ item.extraLabel }}：</text>
                <text class="timeline-field-value">{{ item.extraValue || '-' }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 添加跟进记录按钮 -->
        <view v-if="activeTab === 'follow'" class="add-follow-btn" @tap="onAddFollow">
          <text class="add-follow-btn-text">添加跟进记录</text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-spacer" />
    </scroll-view>

    <!-- 底部固定操作栏 -->
    <view v-if="lead" class="bottom-bar">
      <view class="bottom-row">
        <view class="btn-outline" @tap="onStatusChange('invalid')">
          <text class="btn-outline-text">无效</text>
        </view>
        <view class="btn-outline" @tap="onStatusChange('pending')">
          <text class="btn-outline-text">待定</text>
        </view>
      </view>
      <view class="bottom-row">
        <view class="btn-solid" @tap="onStatusChange('valid')">
          <text class="btn-solid-text">有效</text>
        </view>
        <view class="btn-solid" @tap="onAssign">
          <text class="btn-solid-text">分配</text>
        </view>
      </view>
    </view>

    <!-- 无效原因弹窗 -->
    <view v-if="showInvalidModal" class="modal-mask" @tap="showInvalidModal = false">
      <view class="modal-card" @tap.stop>
        <text class="modal-title">请输入无效原因</text>
        <input class="modal-input" v-model="invalidReason" placeholder="请输入原因" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        <view class="modal-btns">
          <view class="modal-btn modal-btn--cancel" @tap="showInvalidModal = false">
            <text class="modal-btn-text">取消</text>
          </view>
          <view class="modal-btn modal-btn--confirm" @tap="confirmInvalid">
            <text class="modal-btn-text modal-btn-text--confirm">确定</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加跟进记录弹窗 -->
    <view v-if="showFollowModal" class="modal-mask" @tap="showFollowModal = false">
      <view class="modal-card" @tap.stop>
        <text class="modal-title">添加跟进记录</text>
        <input class="modal-input" v-model="followContent" placeholder="请输入跟进内容" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        <view class="modal-btns">
          <view class="modal-btn modal-btn--cancel" @tap="showFollowModal = false">
            <text class="modal-btn-text">取消</text>
          </view>
          <view class="modal-btn modal-btn--confirm" @tap="confirmFollow">
            <text class="modal-btn-text modal-btn-text--confirm">确定</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getLeadDetail, getFollowRecords, updateLeadStatus, addFollowRecord, getAssignmentLogs, getLeadRecords, type LeadItem, type FollowRecordItem } from '@/api/lead'
import iconEdit from '@/assets/dev/edit.png'

// ====== 常量 ======
const STATUS_LABEL: Record<string, string> = {
  pending: '待定',
  valid: '有效',
  invalid: '无效',
  duplicate: '重复',
}

// ====== 状态 ======
const leadId = ref(0)
const lead = ref<LeadItem | null>(null)
const loading = ref(true)

const activeTab = ref<'follow' | 'assign' | 'log'>('follow')
const tabs = [
  { key: 'follow' as const, label: '跟进记录' },
  { key: 'assign' as const, label: '分配记录' },
  { key: 'log' as const, label: '线索记录' },
]

const followRecords = ref<TimelineRecord[]>([])
const assignRecords = ref<TimelineRecord[]>([])
const logRecords = ref<TimelineRecord[]>([])
const duplicateLeads = ref<DuplicateLeadSummary[]>([])
const showDuplicates = ref(true)

const showInvalidModal = ref(false)
const invalidReason = ref('')
const pendingStatus = ref('')

const showFollowModal = ref(false)
const followContent = ref('')

// ====== 本地类型 ======
interface TimelineRecord {
  id: number
  time: string
  tag?: string
  operator: string
  method?: string
  content?: string
  extraLabel?: string
  extraValue?: string
}

interface DuplicateLeadSummary {
  id: number
  leadNo?: string
  customerName?: string
  companyName?: string
  phone?: string
  status?: string
}

// ====== 字段配置 ======
interface InfoField {
  label: string
  value: (lead: LeadItem) => string
  valueClass?: string
  isStatus?: boolean
  divider: boolean
}

const infoFields: InfoField[] = [
  { label: '公司', value: (l) => l.companyName || l.customerName || '-', divider: true },
  { label: '部门来源', value: (l) => l.sourceDepartment || '-', divider: true },
  { label: '线索编号', value: (l) => l.leadNo || '-', divider: true },
  { label: '渠道来源', value: (l) => l.channelName || '-', divider: true },
  { label: '负责人', value: (l) => l.ownerUserName || '-', divider: true },
  { label: '客户名称', value: (l) => l.customerName || '-', divider: true },
  { label: '行业类型', value: (l) => l.customerIndustryLabel || '-', divider: true },
  { label: '线索等级', value: (l) => l.leadLevel ? `${l.leadLevel}级线索` : '-', divider: true },
  { label: '联系人', value: (l) => l.contactName || '-', divider: true },
  { label: '联系电话', value: (l) => l.phone || '-', divider: true },
  { label: '微信号', value: (l) => l.wechat || '-', divider: true },
  { label: 'wechat', value: (l) => l.whatsapp || '-', divider: true },
  { label: '邮箱', value: (l) => l.email || '-', divider: true },
  { label: '省/市/区', value: (l) => [l.provinceName, l.cityName, l.districtName].filter(Boolean).join('/') || '-', divider: true },
  { label: '线索状态', value: (l) => STATUS_LABEL[l.status] || l.status || '-', isStatus: true, divider: true },
  { label: '跟进人', value: (l) => l.followerUserName || '-', divider: true },
  { label: '距离回收时间', value: (l) => l.recycleRemainingTime || '-', divider: true },
  { label: '备注', value: (l) => l.remark || '-', divider: false },
]

// ====== 计算属性 ======
const currentRecords = computed(() => {
  switch (activeTab.value) {
    case 'follow': return followRecords.value
    case 'assign': return assignRecords.value
    case 'log': return logRecords.value
    default: return []
  }
})

const fieldLabels = computed(() => {
  switch (activeTab.value) {
    case 'assign': return { operator: '分配人' }
    case 'log': return { operator: '领取人' }
    default: return { operator: '跟进人' }
  }
})

function mapFollowToTimeline(item: FollowRecordItem): TimelineRecord {
  return {
    id: item.id,
    time: item.followedAt || item.createdAt || '',
    operator: item.followerUserName || '',
    method: item.followType || '',
    content: item.content || '',
  }
}

async function fetchFollowRecords(leadId: number): Promise<TimelineRecord[]> {
  try {
    const records = await getFollowRecords(leadId)
    return records.map(mapFollowToTimeline)
  } catch {
    return []
  }
}

async function fetchAssignRecords(leadId: number): Promise<TimelineRecord[]> {
  try {
    const records = await getAssignmentLogs(leadId)
    return records.map((r): TimelineRecord => ({
      id: r.id,
      time: r.createdAt || '',
      tag: `(${r.action || '线索分配'})`,
      operator: r.operatorUserName || '',
      extraLabel: '被分配销售',
      extraValue: r.targetUserName || '',
    }))
  } catch {
    return []
  }
}

async function fetchLogRecords(leadId: number) {
  try {
    const records = await getLeadRecords(leadId)
    return records.map((r) => ({
      id: r.id,
      time: r.occurredAt || '',
      tag: `(${r.action || '领取时间'})`,
      operator: r.receiverUserName || '-',
    }))
  } catch {
    return []
  }
}

async function fetchDuplicateLeads(_leadId: number): Promise<DuplicateLeadSummary[]> {
  return []
}

// ====== 数据获取 ======
async function fetchDetail() {
  loading.value = true
  try {
    lead.value = await getLeadDetail(leadId.value)
    const id = leadId.value
    // 并行获取关联数据
    const [follows, assigns, logs, dups] = await Promise.all([
      fetchFollowRecords(id),
      fetchAssignRecords(id),
      fetchLogRecords(id),
      fetchDuplicateLeads(id),
    ])
    followRecords.value = follows
    assignRecords.value = assigns
    logRecords.value = logs
    duplicateLeads.value = dups
  } catch {
    lead.value = null
  } finally {
    loading.value = false
  }
}

// ====== 操作 ======
function onEdit() {
  Taro.navigateTo({ url: `/subpackages/dev/leads/edit/index?id=${leadId.value}` })
}

function onStatusChange(status: string) {
  if (status === 'invalid') {
    pendingStatus.value = status
    invalidReason.value = ''
    showInvalidModal.value = true
    return
  }
  doUpdateStatus(status)
}

async function confirmInvalid() {
  if (!invalidReason.value.trim()) {
    Taro.showToast({ title: '请输入无效原因', icon: 'none' })
    return
  }
  showInvalidModal.value = false
  await doUpdateStatus(pendingStatus.value, invalidReason.value.trim())
}

async function doUpdateStatus(status: string, reason?: string) {
  try {
    await updateLeadStatus(leadId.value, { status, invalidReason: reason })
    Taro.showToast({ title: '状态更新成功', icon: 'success' })
    fetchDetail()
  } catch (e) {
    Taro.showToast({ title: (e as Error).message || '更新失败', icon: 'none' })
  }
}

function onAssign() {
  Taro.showToast({ title: '功能开发中', icon: 'none' })
}

function onAddFollow() {
  followContent.value = ''
  showFollowModal.value = true
}

async function confirmFollow() {
  if (!followContent.value.trim()) {
    Taro.showToast({ title: '请输入跟进内容', icon: 'none' })
    return
  }
  try {
    await addFollowRecord(leadId.value, { content: followContent.value.trim() })
    Taro.showToast({ title: '添加成功', icon: 'success' })
    showFollowModal.value = false
    fetchDetail()
  } catch (e) {
    Taro.showToast({ title: (e as Error).message || '添加失败', icon: 'none' })
  }
}

// ====== 生命周期 ======
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
  display: flex;
  flex-direction: column;
}

/* 导航栏右侧编辑 */
.nav-edit-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.nav-edit-icon {
  width: 32rpx;
  height: 32rpx;
}
.nav-edit-text {
  font-size: 28rpx;
  color: #37AE7E;
}

/* 滚动区域 */
.detail-scroll {
  flex: 1;
  padding: 24rpx 40rpx;
  box-sizing: border-box;
  margin-bottom: 200rpx;
}

/* ====== 通用卡片 ====== */
.info-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

/* 卡片标题行 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-header-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}
.card-header-right {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.card-edit-icon {
  width: 32rpx;
  height: 32rpx;
}
.card-edit-text {
  font-size: 28rpx;
  color: #37AE7E;
}
.card-divider {
  height: 1rpx;
  background: #F4F4F4;
  margin: 24rpx 0;
}

/* ====== 信息行 ====== */
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40rpx;
  padding: 20rpx 0;
}
.info-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}
.info-value-wrap {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.info-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}
.row-divider {
  height: 1rpx;
  background: #F4F4F4;
}

/* 状态圆点 */
.status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot--pending { background: #3BDBFF; }
.status-dot--valid { background: #37AE7E; }
.status-dot--invalid { background: #F53F3F; }
.status-dot--duplicate { background: #9292A5; }

/* ====== 重复线索 ====== */
.card-toggle {
  width: 36rpx;
  height: 36rpx;
  background: #EDFAF5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-toggle-icon {
  font-size: 20rpx;
  color: #37AE7E;
}
.duplicate-list {
  margin-top: 24rpx;
}
.duplicate-item {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 28rpx;
}
.duplicate-item + .duplicate-item {
  margin-top: 24rpx;
}
.duplicate-item .info-row {
  padding: 14rpx 0;
}
.duplicate-item .info-row + .info-row {
  border-top: 1rpx solid #F4F4F4;
}
.duplicate-item .info-label {
  font-size: 30rpx;
}
.duplicate-item .info-value {
  font-size: 30rpx;
}

/* ====== 时间轴 Tab ====== */
.timeline-card {
  padding-bottom: 28rpx;
}
.tab-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid transparent;
}
.tab-item--active {
  border-bottom-color: #37AE7E;
}
.tab-item-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #62687D;
}
.tab-item-text--active {
  color: #23252C;
}

/* ====== 时间轴列表 ====== */
.timeline {
  display: flex;
  flex-direction: column;
  margin-top: 24rpx;
}
.timeline-empty {
  text-align: center;
  padding: 60rpx 0;
  font-size: 28rpx;
  color: #BBBEC2;
}
.timeline-item {
  display: flex;
}
.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12rpx;
  flex-shrink: 0;
}
.timeline-trail {
  width: 2rpx;
  background: #E5E6EB;
  flex: 1;
}
.timeline-trail--top {
  min-height: 8rpx;
  max-height: 8rpx;
}
.timeline-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #37AE7E;
  flex-shrink: 0;
}
.timeline-trail--bottom {
  min-height: 40rpx;
}

/* 最后一项不显示底部连线 */
.timeline-item:last-child .timeline-trail--bottom {
  display: none;
}

.timeline-content {
  flex: 1;
  padding: 0 0 40rpx 12rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.timeline-content--last {
  padding-bottom: 0;
}
.timeline-date-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.timeline-date {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}
.timeline-tag {
  font-size: 30rpx;
  font-weight: 500;
  color: #62687D;
}
.timeline-field {
  display: flex;
  align-items: center;
}
.timeline-field-label {
  font-size: 28rpx;
  color: #62687D;
}
.timeline-field-value {
  font-size: 28rpx;
  color: #62687D;
}

/* 添加跟进记录按钮 */
.add-follow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  background: #EDFAF5;
  border: 1rpx solid #B1E9D3;
  border-radius: 8rpx;
  margin-top: 28rpx;
}
.add-follow-btn-text {
  font-size: 28rpx;
  color: #37AE7E;
}

/* ====== 底部占位 ====== */
.bottom-spacer {
  height: 160rpx;
}

/* ====== 底部操作栏 ====== */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F5F7F9;
  padding: 16rpx 40rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 16rpx);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.bottom-row {
  display: flex;
  gap: 28rpx;
}

/* outline 按钮 */
.btn-outline {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  background: #EDFAF5;
  border: 2rpx solid #5CC79C;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-outline-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
}

/* 实心按钮 */
.btn-solid {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  background: #37AE7E;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-solid-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}

/* ====== 空/加载 ====== */
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

/* ====== 无效原因弹窗 ====== */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-card {
  width: 560rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
.modal-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
  text-align: center;
}
.modal-input {
  height: 72rpx;
  background: #F6F7FB;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #1A1D24;
  box-sizing: border-box;
}
.modal-btns {
  display: flex;
  gap: 20rpx;
}
.modal-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-btn--cancel {
  background: #F6F7FB;
}
.modal-btn--confirm {
  background: #37AE7E;
}
.modal-btn-text {
  font-size: 28rpx;
  color: #62687D;
}
.modal-btn-text--confirm {
  color: #FFFFFF;
}
</style>
