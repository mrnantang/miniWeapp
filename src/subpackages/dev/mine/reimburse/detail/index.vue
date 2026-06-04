<template>
  <view class="rd-page">
    <view class="rd-bg" :class="'rd-bg--' + approvalStatus" />
    <view class="rd-nav-bar">
      <view class="rd-nav-back" @tap="goBack">
        <image class="rd-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="rd-nav-title">报销详情</text>
      <view class="rd-nav-right" />
    </view>
    <view style="height: 153rpx;width: 100%;" />
    <scroll-view class="rd-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="rd-status-card">
        <text class="rd-status-no">报销编号</text>
        <view class="rd-status-badge">{{ detail.reimbursementNo }}</view>
      </view>

      <view v-for="(item, idx) in detail.items" :key="item.id || idx" class="rd-card">
        <text class="rd-card-title">报销{{ itemLabel(idx) }}</text>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">费用承担部门</text>
          <text class="rd-value">{{ item.expenseDepartmentName || '-' }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">报销类型</text>
          <text class="rd-value">{{ item.reimbursementType }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">关联客户</text>
          <text class="rd-value">{{ item.customerName || '-' }}</text>
        </view>
        <view v-if="item.startMileage || item.endMileage" class="rd-divider" />
        <view v-if="item.startMileage || item.endMileage" class="rd-field">
          <text class="rd-label">开始公里数</text>
          <text class="rd-value">{{ item.startMileage ?? '-' }}</text>
        </view>
        <view v-if="item.startMileage || item.endMileage" class="rd-divider" />
        <view v-if="item.startMileage || item.endMileage" class="rd-field">
          <text class="rd-label">结束公里数</text>
          <text class="rd-value">{{ item.endMileage ?? '-' }}</text>
        </view>
        <view v-if="item.startMileage || item.endMileage" class="rd-divider" />
        <view v-if="item.startMileage || item.endMileage" class="rd-upload-field">
          <text class="rd-label">开始公里数图片</text>
          <view class="rd-upload-list">
            <image v-for="att in getAttachments(item, 'mileage_start')" :key="att.id" class="rd-upload-thumb" :src="att.fileUrl" mode="aspectFill" />
          </view>
        </view>
        <view v-if="item.startMileage || item.endMileage" class="rd-divider" />
        <view v-if="item.startMileage || item.endMileage" class="rd-upload-field">
          <text class="rd-label">结束公里数图片</text>
          <view class="rd-upload-list">
            <image v-for="att in getAttachments(item, 'mileage_end')" :key="att.id" class="rd-upload-thumb" :src="att.fileUrl" mode="aspectFill" />
          </view>
        </view>
        <view class="rd-divider" />
        <view class="rd-field">
          <text class="rd-label">报销金额</text>
          <text class="rd-value rd-value--price">{{ formatAmount(item.amount) }}</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-upload-field">
          <text class="rd-label">上传支付凭证</text>
          <view class="rd-upload-list">
            <image v-for="att in getAttachments(item, 'payment_voucher')" :key="att.id" class="rd-upload-thumb" :src="att.fileUrl" mode="aspectFill" />
          </view>
        </view>
        <view class="rd-divider" />
        <view class="rd-upload-field">
          <text class="rd-label">上传发票</text>
          <view class="rd-upload-list">
            <image v-for="att in getAttachments(item, 'invoice')" :key="att.id" class="rd-upload-thumb" :src="att.fileUrl" mode="aspectFill" />
          </view>
        </view>
      </view>

      <view class="rd-approval-card">
        <view class="rd-approval-header">
          <text class="rd-approval-title">审批记录</text>
        </view>
        <view class="rd-divider" />
        <view class="rd-timeline">
          <view v-for="(node, nIdx) in approvalNodes" :key="nIdx" class="rd-timeline-item">
            <view class="rd-timeline-dot-col">
              <view class="rd-timeline-line" :class="node.topLineClass" />
              <view class="rd-timeline-dot" :class="node.dotClass" />
              <view class="rd-timeline-line" :class="node.bottomLineClass" />
            </view>
            <view class="rd-timeline-content" :class="{ 'rd-timeline-content--dim': node.isDim }">
              <text class="rd-timeline-text">{{ node.nodeName }}</text>
              <view v-for="(step, sIdx) in node.steps" :key="sIdx" class="rd-approval-box">
                <view v-if="step.approvalRule" class="rd-ap-field">
                  <text class="rd-ap-label">审批原则</text>
                  <text class="rd-ap-value">{{ step.approvalRule === 'all' ? '全部审批通过即通过' : '任一通过即通过' }}</text>
                </view>
                <view v-if="sIdx > 0 || step.approvalRule" class="rd-ap-dash" />
                <view class="rd-ap-field">
                  <text class="rd-ap-label">审批人</text>
                  <text class="rd-ap-value">{{ step.operatorName }}</text>
                </view>
                <view class="rd-ap-field">
                  <text class="rd-ap-label">审批状态</text>
                  <text class="rd-ap-value" :class="{ 'rd-ap-value--reject': step.status === 'reject' }">
                    {{ APPROVAL_STATUS_MAP[step.status] || step.status }}
                  </text>
                </view>
                <view v-if="step.status === 'reject' && step.comment" class="rd-ap-field">
                  <text class="rd-ap-label">驳回原因</text>
                  <text class="rd-ap-value">{{ step.comment }}</text>
                </view>
                <view class="rd-ap-field">
                  <text class="rd-ap-label">审批时间</text>
                  <text class="rd-ap-value">{{ formatDate(step.operatedAt) }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="rd-actions">
      <view v-if="detail.canCancel" class="rd-btn rd-btn--cancel" @tap="onCancel">撤销申请</view>
      <view v-if="detail.canEdit" class="rd-btn rd-btn--submit" @tap="onEdit">编辑</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import { getReimburseDetail, cancelReimburse, type ReimbursementDetailResponse, type ReimbursementItem, type AttachmentItem } from '@/api/reimburse'
import iconBack from '@/assets/dev/icon-back.png'

const labelMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

const APPROVAL_STATUS_MAP: Record<string, string> = {
  submit: '提交',
  approve: '审批通过',
  reject: '审批驳回',
  cancel: '撤销',
  resubmit: '重新提交',
}

const detail = ref<ReimbursementDetailResponse>({
  id: 0,
  reimbursementNo: '',
  companyId: 0,
  companyName: '',
  departmentId: 0,
  departmentName: '',
  companyDepartmentName: '',
  applicantId: 0,
  applicantName: '',
  customerDisplayName: '',
  reimbursementTypesDisplay: '',
  itemCount: 0,
  totalAmount: 0,
  status: '',
  submittedAt: '',
  createdAt: '',
  latestRejectReason: '',
  canApprove: false,
  canCancel: false,
  canEdit: false,
  items: [],
  attachments: [],
  approvalHistory: [],
})

const approvalStatus = computed(() => {
  const s = detail.value.status
  if (s === 'approval_rejected') return 'rejected'
  if (s === 'approval_passed') return 'approved'
  return 'pending'
})

// 将审批历史按 nodeNo 分组
const approvalNodes = computed(() => {
  const history = detail.value.approvalHistory || []
  const groupMap: Record<number, { nodeName: string; steps: typeof history }> = {}
  for (const step of history) {
    if (!groupMap[step.nodeNo]) {
      groupMap[step.nodeNo] = { nodeName: step.nodeName, steps: [] }
    }
    groupMap[step.nodeNo].steps.push(step)
  }
  const nodes = Object.entries(groupMap)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([nodeNo, group], idx, arr) => {
      const first = idx === 0
      const last = idx === arr.length - 1
      const hasApproval = group.steps.some(s => s.status === 'approve' || s.status === 'reject')
      return {
        nodeName: group.nodeName,
        steps: group.steps,
        isDim: !hasApproval && !first,
        topLineClass: first ? 'rd-timeline-line--top' : 'rd-timeline-line--fill',
        dotClass: hasApproval ? 'rd-timeline-dot--solid' : 'rd-timeline-dot--empty',
        bottomLineClass: last ? 'rd-timeline-line--none' : 'rd-timeline-line--fill',
      }
    })
  // 添加发起审批节点
  nodes.push({
    nodeName: '发起审批',
    steps: [],
    isDim: nodes.length > 0,
    topLineClass: nodes.length > 0 ? 'rd-timeline-line--fill' : 'rd-timeline-line--top',
    dotClass: 'rd-timeline-dot--empty',
    bottomLineClass: 'rd-timeline-line--none',
  })
  return nodes
})

function formatAmount(cent: number): string {
  if (cent === undefined || cent === null) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return dateStr.replace(/T/, ' ').replace(/\..*/, '').slice(0, 19)
}

function itemLabel(idx: number): string {
  return labelMap[idx] || String(idx + 1)
}

function getAttachments(item: ReimbursementItem, attType: string): AttachmentItem[] {
  return (item.attachments || []).filter(a => a.attachmentType === attType)
}

const goBack = () => {
  Taro.navigateBack()
}

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  if (!id) return
  try {
    const res = await getReimburseDetail(id)
    detail.value = res
  } catch {
    // 错误已在 request 层统一处理
  }
}

async function onCancel() {
  try {
    const res = await Taro.showModal({ title: '提示', content: '确定要撤销该报销单吗？' })
    if (!res.confirm) return
    await cancelReimburse(detail.value.id)
    Taro.showToast({ title: '已撤销', icon: 'success' })
    fetchDetail()
  } catch {
    // 用户取消或请求失败
  }
}

function onEdit() {
  Taro.navigateTo({ url: '/subpackages/dev/mine/reimburse/add/index?id=' + detail.value.id })
}

fetchDetail()
</script>

<style>
.rd-page {
  min-height: 100vh;
  background: #F5F7F9;
  position: relative;
}

.rd-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 780rpx;
  pointer-events: none;
}

.rd-bg--pending,
.rd-bg--approved {
  background: linear-gradient(180deg, #EAFFF7 0%, rgba(234, 255, 247, 0) 100%);
}

.rd-bg--rejected {
  background: linear-gradient(180deg, #FFEDED 0%, rgba(255, 237, 237, 0) 100%);
}

.rd-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
  position: absolute;
  width: 90%;
  z-index: 1;
}

.rd-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.rd-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.rd-nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}

.rd-nav-right {
  width: 60rpx;
}

.rd-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.rd-status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.rd-status-no {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
}

.rd-status-badge {
  color: var(---1, #1A1D24);
  text-align: right;
  font-family: "PingFang SC";
  font-size: 32rpx;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.rd-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.rd-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
}

.rd-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.rd-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-upload-field {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.rd-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.rd-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.rd-value--price {
  font-weight: 600;
}

.rd-upload-list {
  display: flex;
  gap: 12rpx;
}

.rd-upload-thumb {
  width: 128rpx;
  height: 128rpx;
  background: #F5F7F9;
  border: 1rpx solid #E4E9EF;
  border-radius: 8rpx;
}

.rd-approval-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.rd-approval-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-approval-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.rd-timeline {
  display: flex;
  flex-direction: column;
}

.rd-timeline-item {
  display: flex;
  gap: 12rpx;
}

.rd-timeline-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.rd-timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.rd-timeline-dot--solid {
  background: #37AE7E;
}

.rd-timeline-dot--empty {
  border: 2rpx solid #E5E6EB;
  background: transparent;
}

.rd-timeline-line {
  width: 2rpx;
  flex: 1;
  min-height: 16rpx;
}

.rd-timeline-line--fill {
  background: #E5E6EB;
}

.rd-timeline-line--top {
  background: #E5E6EB;
  min-height: 4rpx;
  flex: 0 0 8rpx;
}

.rd-timeline-line--none {
  background: transparent;
}

.rd-timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.rd-timeline-content--dim {
  opacity: 0.5;
}

.rd-timeline-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.rd-approval-box {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 20rpx 24rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
}

.rd-ap-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rd-ap-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.rd-ap-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}

.rd-ap-value--reject {
  color: #F53F3F;
}

.rd-ap-dash {
  height: 1rpx;
  background: transparent;
  border-top: 2rpx dashed #ECEBEB;
  margin: 4rpx 0;
}

.rd-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  position: relative;
  z-index: 1;
}

.rd-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.rd-btn--cancel {
  background: #FFE6E6;
  border: 1rpx solid #F53F3F;
  color: #F53F3F;
}

.rd-btn--submit {
  background: #EFFDF7;
  border: 1rpx solid #5CC79C;
  color: #5CC79C;
}
</style>
