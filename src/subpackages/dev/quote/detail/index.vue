<template>
  <view class="q-page">
    <view class="q-bg" :class="'q-bg--' + approvalStatus" />
    <view class="q-nav-bar">
      <view class="q-nav-back" @tap="goBack">
        <image class="q-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="q-nav-title">报价单详情</text>
      <view class="q-nav-right" />
    </view>

    <!-- 审批记录卡片 -->
    <view v-if="approvalNodes.length" class="q-approval-card">
      <view class="q-approval-header">
        <text class="q-approval-title">审批记录</text>
      </view>
      <view class="q-divider" style="margin:32rpx 0;"/>
      <view class="q-timeline">
        <view v-for="(node, nIdx) in approvalNodes" :key="nIdx" class="q-timeline-item">
          <view class="q-timeline-dot-col">
            <view class="q-timeline-line" :class="node.topLineClass" />
            <view class="q-timeline-dot" :class="node.dotClass" />
            <view class="q-timeline-line" :class="node.bottomLineClass" />
          </view>
          <view class="q-timeline-content" :class="{ 'q-timeline-content--dim': node.isDim }">
            <text class="q-timeline-text">{{ node.nodeName }}</text>
            <!-- 可审批人 -->
            <view v-if="node.approverNames" class="q-ap-field">
              <text class="q-ap-label">可审批人</text>
              <text class="q-ap-value">{{ node.approverNames }}</text>
            </view>
            <!-- 审批原则 -->
            <view v-if="node.approvalRuleText" class="q-ap-field">
              <text class="q-ap-label">审批原则</text>
              <text class="q-ap-value">{{ node.approvalRuleText }}</text>
            </view>
            <!-- 每个审批人独立的框 -->
            <view v-for="(box, bIdx) in node.approverBoxes" :key="bIdx" class="q-approval-box">
              <view class="q-ap-field">
                <text class="q-ap-label">审批人</text>
                <text class="q-ap-value">{{ box.name }}</text>
              </view>
              <view class="q-ap-field">
                <text class="q-ap-label">审批状态</text>
                <text class="q-ap-value" :class="{ 'q-ap-value--reject': box.isRejected }">{{ box.statusLabel }}</text>
              </view>
              <view v-if="box.isRejected && box.comment" class="q-ap-field">
                <text class="q-ap-label">驳回原因</text>
                <text class="q-ap-value">{{ box.comment }}</text>
              </view>
              <view v-if="box.operatedAt" class="q-ap-field">
                <text class="q-ap-label">审批时间</text>
                <text class="q-ap-value">{{ box.operatedAt }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <scroll-view class="q-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <!-- Card 1: 报价模板 -->
      <view class="q-card">
        <view class="q-field">
          <text class="q-field-label">报价模板</text>
          <text class="q-field-value">{{ detail.templateName || '-' }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">模板编号</text>
          <text class="q-field-value">{{ detail.templateNo || '-' }}</text>
        </view>
      </view>

      <!-- Card 2: 需方信息 -->
      <view class="q-card">
        <view class="q-field">
          <text class="q-field-label">需方信息</text>
          <text class="q-field-value">{{ buyerName }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">联系人</text>
          <text class="q-field-value">{{ buyerSnapshot.contactName || '-' }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">手机号</text>
          <text class="q-field-value">{{ buyerSnapshot.phone || '-' }}</text>
        </view>
      </view>

      <!-- Card 3: 报价信息 -->
      <view class="q-card">
        <view class="q-field">
          <text class="q-field-label">关联商机</text>
          <text class="q-field-value">{{ detail.opportunityName || '-' }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">报价单号</text>
          <text class="q-field-value">{{ detail.quotationNo || '-' }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">报价名称</text>
          <text class="q-field-value">{{ detail.name || '-' }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">报价时效</text>
          <text class="q-field-value">{{ summarySnapshot.validity || '-' }} 月</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">保修时限</text>
          <text class="q-field-value">{{ summarySnapshot.warranty || '-' }} 年</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">交货期限</text>
          <text class="q-field-value">{{ summarySnapshot.delivery || '-' }} 天</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">签约完成后付款金额</text>
          <text class="q-field-value">{{ paymentTerms.payAfterSign || '-' }} 元</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">货物打包后付款金额</text>
          <text class="q-field-value">{{ paymentTerms.payAfterPack || '-' }} 元</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">安装调试后付款金额</text>
          <text class="q-field-value">{{ paymentTerms.payAfterInstall || '-' }} 元</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">验收完成后付款金额</text>
          <text class="q-field-value">{{ paymentTerms.payAfterCheck || '-' }} 元</text>
        </view>
      </view>

      <!-- Card 4: 产品明细 -->
      <view v-if="detail.items && detail.items.length" class="q-card">
        <view class="q-section-head">
          <text class="q-section-title">产品明细</text>
        </view>
        <view class="q-divider" />
        <scroll-view class="q-table-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
          <view class="q-table">
            <view class="q-tr q-tr--head">
              <view class="q-th" style="width:72rpx">序号</view>
              <view class="q-th" style="width:280rpx">产品名称</view>
              <view class="q-th" style="width:318rpx">型号</view>
              <view class="q-th" style="width:160rpx">数量</view>
              <view class="q-th" style="width:160rpx">单价</view>
              <view class="q-th" style="width:200rpx">小计</view>
            </view>
            <view v-for="(item, idx) in detail.items" :key="idx" class="q-tr">
              <view class="q-td" style="width:72rpx">{{ padNum(idx + 1) }}</view>
              <view class="q-td" style="width:280rpx">{{ item.productName || '-' }}</view>
              <view class="q-td" style="width:318rpx">{{ item.modelName || '-' }}</view>
              <view class="q-td" style="width:160rpx">{{ item.quantity }}</view>
              <view class="q-td" style="width:160rpx">{{ formatAmount(item.unitPrice) }}</view>
              <view class="q-td q-td--bold" style="width:200rpx">{{ formatAmount(item.amount) }}</view>
            </view>
          </view>
        </scroll-view>
        <view class="q-divider" />
        <view class="q-total-row">
          <text class="q-total-label">优惠后总价</text>
          <text class="q-total-value">{{ formatAmount(detail.discountedAmount || detail.totalAmount) }}</text>
          <text class="q-total-unit">元</text>
        </view>
      </view>

      <!-- Card 5: 金额汇总 -->
      <view class="q-card">
        <view class="q-field">
          <text class="q-field-label">产品总额</text>
          <text class="q-field-value q-field-value--amount">{{ formatAmount(detail.totalAmount) }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">税点</text>
          <text class="q-field-value">{{ summarySnapshot.taxRate || '-' }}%</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">税额</text>
          <text class="q-field-value q-field-value--amount">{{ summarySnapshot.taxAmount ? formatAmount(summarySnapshot.taxAmount) : '-' }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">应收总额</text>
          <text class="q-field-value q-field-value--total">{{ formatAmount(detail.discountedAmount || detail.totalAmount) }}</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">优惠后总价</text>
          <text class="q-field-value q-field-value--amount">{{ formatAmount(detail.discountedAmount || detail.totalAmount) }}</text>
        </view>
      </view>

      <view class="q-bottom-spacer" />
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="q-actions">
      <view class="q-btn q-btn--cancel" @tap="onCancel">
        <text class="q-btn-text q-btn-text--cancel">撤销报价</text>
      </view>
      <view class="q-btn q-btn--preview" @tap="onPreview">
        <text class="q-btn-text q-btn-text--preview">预览</text>
      </view>
      <view v-if="detail.canEdit" class="q-btn q-btn--edit" @tap="onEdit">
        <text class="q-btn-text q-btn-text--edit">编辑</text>
      </view>
      <view v-if="!detail.canEdit" class="q-btn q-btn--created" @tap="onEdit">
        <text class="q-btn-text q-btn-text--created">新建合同</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'

declare const TARO_APP_API_BASE: string
import { getQuotationDetail, revokeQuotation, type QuotationLineItem } from '@/api/quote'
import { getToken } from '@/utils/storage'
import iconBack from '@/assets/dev/icon-back.png'

const detail = reactive({
  id: 0, name: '', quotationNo: '', totalAmount: 0, discountedAmount: 0,
  approvalStatus: '', bizStatus: '', customerId: 0, customerName: '',
  opportunityName: '', validUntil: '', canEdit: false, canApprove: false,
  templateName: '', templateNo: '', templateVersion: 0,
  items: [] as QuotationLineItem[],
  approvalFlow: null as Record<string, any> | null,
  approvalHistory: [] as Record<string, any>[],
  buyerSnapshot: {} as Record<string, any>,
  summarySnapshot: {} as Record<string, any>,
  paymentTerms: {} as Record<string, any>,
  renderedHtml: '',
})

const buyerSnapshot = computed(() => detail.buyerSnapshot || {})
const summarySnapshot = computed(() => detail.summarySnapshot || {})
const paymentTerms = computed(() => detail.paymentTerms || {})
const buyerName = computed(() => buyerSnapshot.value.name || buyerSnapshot.value.contactName || '-')

const approvalStatus = computed(() => {
  const s = detail.approvalStatus
  if (s === 'rejected' || s === 'approval_rejected') return 'rejected'
  if (s === 'approved' || s === 'approval_passed' || s === 'approved_finished') return 'approved'
  return 'pending'
})

const statusLabels: Record<string, string> = {
  pending: '待审批', approved: '审批通过', rejected: '审批驳回',
}

const approvalNodes = computed(() => {
  const flow = detail.approvalFlow
  const nodes = flow?.nodes || []
  const result = nodes.map((node: Record<string, any>, idx: number, arr: any[]) => {
    const first = idx === 0
    const last = idx === arr.length - 1
    const approvers: any[] = node.approvers || []
    const hasApproval = approvers.some((a: any) => a.status === 'approved' || a.status === 'rejected')
    // 可审批人名称列表
    const approverNames = approvers.map((a: any) => a.name || a.approverName || '').filter(Boolean).join(' | ')
    // 审批原则
    const ruleText = node.approvalRule === 'all' ? '全部审批通过即通过' : node.approvalRule === 'any' ? '一人审批通过即通过' : ''
    // 每个审批人独立框
    const approverBoxes = approvers.map((a: any) => ({
      name: a.name || a.approverName || '-',
      statusLabel: statusLabels[a.status || a.approvalStatus] || a.status || '待审批',
      isRejected: a.status === 'rejected' || a.approvalStatus === 'rejected',
      comment: a.comment || a.rejectReason || '',
      operatedAt: a.operatedAt || a.approvedAt || '',
    }))
    return {
      nodeName: node.nodeName || node.name || '-',
      approverNames,
      approvalRuleText: ruleText,
      approverBoxes,
      isDim: !hasApproval && !first,
      topLineClass: first ? 'q-timeline-line--top' : 'q-timeline-line--fill',
      dotClass: hasApproval ? 'q-timeline-dot--solid' : 'q-timeline-dot--empty',
      bottomLineClass: last ? 'q-timeline-line--none' : 'q-timeline-line--fill',
    }
  })
  return result
})

function padNum(n: number): string {
  return n < 10 ? '0' + n : String(n)
}

function formatTime(val?: string): string {
  if (!val) return '-'
  return val.replace('T', ' ').slice(0, 10)
}

function formatAmount(cent?: number): string {
  if (!cent && cent !== 0) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const goBack = () => Taro.navigateBack()

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  if (!id) return
  try {
    const res = await getQuotationDetail(id) as Record<string, any>
    Object.assign(detail, res)
  } catch {
    // 错误已在 request 层处理
  }
}

async function onCancel() {
  try {
    const res = await Taro.showModal({ title: '提示', content: '确定要撤销该报价吗？' })
    if (!res.confirm) return
    await revokeQuotation(detail.id)
    Taro.showToast({ title: '已撤销', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  } catch {
    // 用户取消或请求失败
  }
}

function onPreview() {
  if (!detail.id) {
    Taro.showToast({ title: '报价单信息异常', icon: 'none' })
    return
  }
  const pdfUrl = `${TARO_APP_API_BASE}/quotations/${detail.id}/preview`
  Taro.downloadFile({
    url: pdfUrl,
    header: { Authorization: `Bearer ${getToken()}` },
    success(res) {
      if (res.statusCode === 200) {
        Taro.openDocument({
          filePath: res.tempFilePath,
          fileType: 'pdf',
          showMenu: true,
        })
      } else {
        Taro.showToast({ title: '预览失败', icon: 'none' })
      }
    },
    fail: () => {
      Taro.showToast({ title: '下载失败', icon: 'none' })
    },
  })
}

function onEdit() {
  Taro.navigateTo({ url: '/subpackages/dev/quote/index?id=' + detail.id })
}

onMounted(() => {
  fetchDetail()
})
</script>

<style>
.q-page {
  min-height: 100vh;
  background: #F5F7F9;
  display: flex;
  flex-direction: column;
  position: relative;
}

.q-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 780rpx;
  pointer-events: none;
}

.q-bg--pending,
.q-bg--approved {
  background: linear-gradient(180deg, #EAFFF7 0%, rgba(234, 255, 247, 0) 100%);
}

.q-bg--rejected {
  background: linear-gradient(180deg, #FFEDED 0%, rgba(255, 237, 237, 0) 100%);
}

.q-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.q-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.q-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.q-nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #25293B;
}

.q-nav-right {
  width: 60rpx;
}

.q-scroll {
  flex: 1;
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.q-bottom-spacer {
  height: 20rpx;
}

.q-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.q-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.q-field-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
  margin-right: 12rpx;
}

.q-field-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}

.q-field-value--amount {
  font-weight: 500;
}

.q-field-value--total {
  font-size: 36rpx;
  font-weight: 700;
  color: #EB3F29;
}

.q-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.q-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.q-section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.q-table-scroll {
  width: 100%;
  overflow: hidden;
}

.q-table {
  display: flex;
  flex-direction: column;
  border: 1rpx solid #EDEDED;
  border-radius: 4rpx;
  min-width: 1200rpx;
}

.q-tr {
  display: flex;
  flex-direction: row;
}

.q-tr--head {
  background: #F9F9F9;
}

.q-th {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx;
  font-size: 24rpx;
  color: #62687D;
  border-right: 1rpx solid #EDEDED;
  border-bottom: 1rpx solid #EDEDED;
  box-sizing: border-box;
  flex-shrink: 0;
}

.q-td {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx;
  font-size: 24rpx;
  color: #1A1D24;
  border-right: 1rpx solid #EDEDED;
  border-bottom: 1rpx solid #EDEDED;
  box-sizing: border-box;
  flex-shrink: 0;
}

.q-tr:last-child .q-th,
.q-tr:last-child .q-td {
  border-bottom: none;
}

.q-td:last-child,
.q-th:last-child {
  border-right: none;
}

.q-td--bold {
  font-weight: 600;
}

.q-total-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  justify-content: flex-end;
}

.q-total-label {
  font-size: 28rpx;
  color: #505361;
}

.q-total-value {
  font-size: 28rpx;
  color: #9292A5;
}

.q-total-unit {
  font-size: 28rpx;
  color: #62687D;
}

/* 审批记录 */
.q-approval-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin: 24rpx 40rpx;
  z-index: 2;
}

.q-approval-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.q-approval-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.q-timeline {
  display: flex;
  flex-direction: column;
}

.q-timeline-item {
  display: flex;
  gap: 12rpx;
}

.q-timeline-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.q-timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.q-timeline-dot--solid {
  background: #37AE7E;
}

.q-timeline-dot--empty {
  border: 2rpx solid #E5E6EB;
  background: transparent;
}

.q-timeline-line {
  width: 2rpx;
  flex: 1;
  min-height: 16rpx;
}

.q-timeline-line--fill {
  background: #E5E6EB;
}

.q-timeline-line--top {
  background: #E5E6EB;
  min-height: 4rpx;
  flex: 0 0 8rpx;
}

.q-timeline-line--none {
  background: transparent;
}

.q-timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.q-timeline-content--dim {
  opacity: 0.5;
}

.q-timeline-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.q-approval-box {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 20rpx 24rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
}

.q-ap-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.q-ap-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.q-ap-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}

.q-ap-value--reject {
  color: #F53F3F;
}

.q-ap-dash {
  height: 1rpx;
  background: transparent;
  border-top: 2rpx dashed #ECEBEB;
  margin: 4rpx 0;
}

/* 底部操作栏 */
.q-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 16rpx 40rpx 48rpx;
  flex-shrink: 0;
}

.q-btn {
  flex: 1;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  text-align: center;
}

.q-btn--cancel {
  background: #FFE6E6;
  border: 1rpx solid #F53F3F;
}

.q-btn--preview {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.q-btn--edit {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}
.q-btn--created {
  background: #37AE7E;
  border: 2rpx solid #37AE7E;
}

.q-btn-text {
  font-size: 32rpx;
  font-weight: 500;
}

.q-btn-text--cancel {
  color: #F53F3F;
}

.q-btn-text--preview {
  color: #5CC79C;
}

.q-btn-text--edit {
  color: #5CC79C;
}
.q-btn-text--created {
  color: #FFFFFF;
}
</style>
