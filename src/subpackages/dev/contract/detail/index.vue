<template>
  <view class="cdt-page">
    <view class="cdt-bg" :class="'cdt-bg--' + (detail.approvalStatus || 'pending')" />
    <view class="cdt-nav-bar">
      <view class="cdt-nav-back" @tap="goBack">
        <image class="cdt-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="cdt-nav-title">合同详情</text>
      <view class="cdt-nav-right" />
    </view>
    <view style="height: 153rpx;width: 100%;" />
    <scroll-view class="cdt-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="cdt-card">
        <text class="cdt-section-title">审批记录</text>
        <view class="cdt-divider" />
        <view v-if="approvalNodes.length" class="cdt-approval-timeline">
          <view v-for="(node, nIdx) in approvalNodes" :key="nIdx" class="cdt-at-item">
            <view class="cdt-at-left">
              <view class="cdt-timeline-line" :class="node.topLineClass" />
              <view class="cdt-timeline-dot" :class="node.dotClass" />
              <view class="cdt-timeline-line" :class="node.bottomLineClass" />
            </view>
            <view class="cdt-at-content" :class="{ 'cdt-at-content--dim': node.isDim }">
              <text class="cdt-at-title">{{ node.nodeName }}</text>
              <view v-if="node.approverNames" class="cdt-at-field">
                <text class="cdt-at-label">可审批人</text>
                <text class="cdt-at-value">{{ node.approverNames }}</text>
              </view>
              <view v-if="node.approvalRuleText" class="cdt-at-field">
                <text class="cdt-at-label">审批原则</text>
                <text class="cdt-at-value">{{ node.approvalRuleText }}</text>
              </view>
              <view v-for="(box, bIdx) in node.approverBoxes" :key="bIdx" class="cdt-at-card">
                <view class="cdt-at-field">
                  <text class="cdt-at-label">审批人</text>
                  <text class="cdt-at-value">{{ box.name }}</text>
                </view>
                <view class="cdt-at-field">
                  <text class="cdt-at-label">审批状态</text>
                  <text class="cdt-at-value" :class="{ 'cdt-at-value--reject': box.isRejected }">{{ box.statusLabel }}</text>
                </view>
                <view v-if="box.isRejected && box.comment" class="cdt-at-field">
                  <text class="cdt-at-label">驳回原因</text>
                  <text class="cdt-at-value">{{ box.comment }}</text>
                </view>
                <view v-if="box.operatedAt" class="cdt-at-field">
                  <text class="cdt-at-label">审批时间</text>
                  <text class="cdt-at-value">{{ box.operatedAt }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="cdt-at-card">
          <text class="cdt-at-card-text">暂无审批记录</text>
        </view>
      </view>

      <view class="cdt-card">
        <text class="cdt-section-title">需方信息</text>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">需方</text><text class="cdt-value">{{ buyer['buyer.party'] || buyer.party || buyer.fullName || buyer.companyName || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">地址</text><text class="cdt-value">{{ buyer.address || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">联系人</text><text class="cdt-value">{{ buyer.contactName || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">手机号</text><text class="cdt-value">{{ buyer['buyer.phone'] || buyer.phone || buyer.contactPhone || '-' }}</text></view>
      </view>

      <view class="cdt-card">
        <text class="cdt-section-title">供方信息</text>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">供方</text><text class="cdt-value">{{ seller.party || seller.fullName || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">收款公户/私户</text><text class="cdt-value">{{ seller.accountType === 'public' ? '公户' : seller.accountType === 'private' ? '私户' : seller.accountType || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">收款账户名称</text><text class="cdt-value">{{ seller.accountName || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">收款公户账户</text><text class="cdt-value">{{ seller.publicAccount || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">开户行</text><text class="cdt-value">{{ seller.bankName || '-' }}</text></view>
      </view>

      <view class="cdt-card">
        <view class="cdt-section-head">
          <text class="cdt-section-title">合同信息</text>
          <text class="cdt-section-subtitle">{{ detail.templateName || '-' }}</text>
        </view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">合同编号</text><text class="cdt-value">{{ detail.contractNo || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">合同名称</text><text class="cdt-value">{{ detail.name || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">关联商机</text><text class="cdt-value">{{ detail.opportunityName || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">关联报价</text><text class="cdt-value">{{ detail.quotationName || '-' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">交货期限</text><view class="cdt-row-inline"><text class="cdt-value">{{ summary.deliveryPeriodDays || '-' }}</text><text class="cdt-suffix">天</text></view></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">保修期限</text><view class="cdt-row-inline"><text class="cdt-value">{{ summary.warrantyPeriodYears || '-' }}</text><text class="cdt-suffix">年</text></view></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">是否含税</text><text class="cdt-value">{{ summary.includeTax ? '是' : '否' }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">税点</text><view class="cdt-row-inline"><text class="cdt-value">{{ summary.taxRate ?? '-' }}</text><text class="cdt-suffix">%</text></view></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">报价有效期</text><view class="cdt-row-inline"><text class="cdt-value">{{ summary.quotationValidityMonths || '-' }}</text><text class="cdt-suffix">月</text></view></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">付款方式</text><text class="cdt-value">{{ paymentMethodLabel }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">支付方式</text><text class="cdt-value">{{ paymentTypeLabel }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">分付周期</text><text class="cdt-value">{{ summary.installmentPeriods || '-' }}</text></view>
      </view>

      <view class="cdt-card">
        <view class="cdt-section-head">
          <text class="cdt-section-title">产品明细</text>
        </view>
        <view class="cdt-divider" />
        <view v-if="detail.items && detail.items.length">
          <view v-for="(item, idx) in detail.items" :key="idx">
            <view class="cdt-row">
              <text class="cdt-label">{{ item.productName || '-' }}</text>
              <text class="cdt-value">{{ item.quantity }} x ￥{{ (item.unitPrice / 100).toLocaleString() }}</text>
            </view>
            <view v-if="idx < detail.items.length - 1" class="cdt-divider" />
          </view>
        </view>
        <view v-else class="cdt-row"><text class="cdt-value">暂无产品</text></view>
      </view>

      <view class="cdt-card">
        <text class="cdt-section-title">金额汇总</text>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">产品总额</text><text class="cdt-value q-field-value--amount">{{ formatAmount(summary.totalAmount || summary.grossAmountExcludingTax) }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">折前总额(不含税)</text><text class="cdt-value q-field-value--amount">{{ formatAmount(summary.grossAmountExcludingTax) }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">折后总额(不含税)</text><text class="cdt-value q-field-value--amount">{{ formatAmount(summary.discountedAmountExcludingTax) }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">税额</text><text class="cdt-value q-field-value--amount">{{ formatAmount(summary.taxAmount) }}</text></view>
        <view class="cdt-divider" />
        <view class="cdt-row"><text class="cdt-label">应收总额</text><text class="cdt-value q-field-value--total">{{ formatAmount(summary.receivableAmount || summary.discountedAmount) }}</text></view>
      </view>

      <view v-if="summary.installmentStages && summary.installmentStages.length" class="cdt-card">
        <text class="cdt-section-title">分期信息</text>
        <view class="cdt-divider" />
        <view v-for="(stage, idx) in summary.installmentStages" :key="idx" class="cdt-period-card">
          <text class="cdt-period-title">{{ stage.title || '第' + padNum(Number(idx) + 1) + '期' }}</text>
          <view class="cdt-period-body">
            <view class="cdt-period-row">
              <text class="cdt-period-label">支付比例</text>
              <view class="cdt-period-value-row"><text class="cdt-period-value">{{ stage.ratio ?? stage.ratioPercent ?? '-' }}</text><text class="cdt-period-suffix">%</text></view>
            </view>
            <view class="cdt-period-row">
              <text class="cdt-period-label">支付金额</text>
              <view class="cdt-period-value-row"><text class="cdt-period-value">{{ formatAmount(stage.amount) }}</text></view>
            </view>
            <view class="cdt-period-row">
              <text class="cdt-period-label">应收款节点</text>
              <text class="cdt-period-value">{{ stage.deadline || stage.node || '-' }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="cdt-bottom-spacer" />
    </scroll-view>

    <view v-if="detail.approvalStatus === 'approved'" class="cdt-actions">
      <view class="cdt-btn cdt-btn--primary" @tap="onPreview">预览</view>
      <view class="cdt-btn cdt-btn--primary" @tap="onShare">分享给客户</view>
      <view class="cdt-btn cdt-btn--gradient" @tap="onUpload">上传回签</view>
    </view>
    <view v-else class="cdt-actions">
      <view class="cdt-btn cdt-btn--danger" @tap="onCancel">取消合同</view>
      <view class="cdt-btn cdt-btn--primary" @tap="onPreview">预览</view>
      <view class="cdt-btn cdt-btn--primary" @tap="onEdit">编辑</view>
    </view>

    <!-- 上传回签弹窗 -->
    <nut-popup v-model:visible="showUploadPopup" position="center"
      :style="{ borderRadius: '24rpx', width: '582rpx', padding: '40rpx' }"
      :z-index="2100" portal-disable>
      <view class="cdt-upload-popup">
        <text class="cdt-upload-title">上传回签</text>
        <view class="cdt-upload-area" @tap="onChooseFile">
          <view v-if="uploading" class="cdt-upload-tip">上传中...</view>
          <template v-else-if="submittedFile">
            <text class="cdt-upload-done">上传完成</text>
            <text class="cdt-upload-name">{{ submittedFile.fileName }}</text>
          </template>
          <template v-else>
            <text class="cdt-upload-plus">+</text>
            <text class="cdt-upload-text">点击上传</text>
          </template>
        </view>
        <view class="cdt-upload-btns">
          <view class="cdt-upload-btn cdt-upload-btn--cancel" @tap="showUploadPopup = false">取消</view>
          <view class="cdt-upload-btn cdt-upload-btn--confirm"
            :class="{ 'cdt-upload-btn--active': submittedFile }"
            @tap="onConfirmSignBack">确认</view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getContractDetail, cancelContract, shareContract, signBackContract, CONTRACT_STATUS_MAP, CONTRACT_STATUS_BADGE_MAP } from '@/api/contract'
import { uploadFile } from '@/api/material'
import { getToken } from '@/utils/storage'

declare const TARO_APP_API_BASE: string
import iconBack from '@/assets/dev/icon-back.png'

const statusLabels: Record<string, string> = {
  pending: '待审批', approved: '审批通过', rejected: '审批驳回',
}

const detail = reactive<Record<string, any>>({
  id: 0,
  contractNo: '',
  contractName: '',
  displayStatus: '',
  approvalStatus: '',
  shareToken: '',
  shareUrl: '',
  canEdit: false,
  canCancel: false,
  approvalFlow: null,
  approvalHistory: [],
  buyerSnapshot: {},
  supplierSnapshot: {},
  tokenValues: {},
  tokenSchema: [],
  paymentPeriods: [],
})

const buyer = computed(() => detail.buyerSnapshot || {})
const seller = computed(() => detail.sellerSnapshot || {})
const summary = computed(() => detail.summarySnapshot || {})

const paymentMethodLabel = computed(() => {
  const v = summary.value.paymentMethod
  const map: Record<string, string> = { pay_before_delivery: '先付款后发货', pay_after_delivery: '先发货后付款' }
  return map[v] || v || '-'
})

const paymentTypeLabel = computed(() => {
  const v = summary.value.paymentType
  const map: Record<string, string> = { full: '全额支付', installment: '分期支付' }
  return map[v] || v || '-'
})

function formatAmount(cent?: number): string {
  if (!cent && cent !== 0) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}


// 审批节点
const approvalNodes = computed(() => {
  const flow = detail.approvalFlow
  const nodes = flow?.nodes || []
  return nodes.map((node: any, idx: number, arr: any[]) => {
    const first = idx === 0; const last = idx === arr.length - 1
    const approvers = node.approvers || []
    const hasApproval = approvers.some((a: any) => a.status === 'approved' || a.status === 'rejected')
    const approverNames = approvers.map((a: any) => a.name || '').filter(Boolean).join(' | ')
    const ruleText = node.approvalRule === 'all_pass' ? '全部审批通过即通过' : node.approvalRule === 'any_pass' ? '一人审批通过即通过' : node.approvalRule === 'pass_2' ? '两人审批通过即通过' : node.approvalRule || ''
    return {
      nodeName: node.nodeName || node.name || '-',
      approverNames,
      approvalRuleText: ruleText,
      approverBoxes: approvers.map((a: any) => ({
        name: a.name || '-',
        statusLabel: statusLabels[a.status] || a.status || '待审批',
        isRejected: a.status === 'rejected',
        comment: a.comment || '',
        operatedAt: a.operatedAt || a.approvedAt || '',
      })),
      isDim: !hasApproval && !first,
      topLineClass: first ? 'cdt-timeline-line--top' : 'cdt-timeline-line--fill',
      dotClass: hasApproval ? 'cdt-timeline-dot--solid' : 'cdt-timeline-dot--empty',
      bottomLineClass: last ? 'cdt-timeline-line--none' : 'cdt-timeline-line--fill',
    }
  })
})

function padNum(n: number | string): string { const v = Number(n); return v < 10 ? '0' + v : String(v) }

const goBack = () => Taro.navigateBack()

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  if (!id) return
  try {
    const res = await getContractDetail(id) as Record<string, any>
    Object.assign(detail, res)
  } catch (e) {
    console.error('fetchDetail error:', e)
  }
}

const onCancel = async () => {
  try {
    const res = await Taro.showModal({ title: '提示', content: '确定要取消该合同吗？' })
    if (!res.confirm) return
    await cancelContract(detail.id)
    Taro.showToast({ title: '已取消', icon: 'success' })
    // 本地更新状态避免接口尚未同步
    detail.approvalStatus = 'cancelled'
    detail.displayStatus = 'cancelled'
  } catch { /*  */ }
}

const onPreview = () => {
  if (!detail.id) {
    Taro.showToast({ title: '合同信息异常', icon: 'none' })
    return
  }
  const pdfUrl = `${TARO_APP_API_BASE}/sales/contracts/${detail.id}/preview`
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

const onEdit = () => {
  Taro.navigateTo({ url: '/subpackages/dev/contract/index?id=' + detail.id + '&customerId=' + detail.customerId })
}
const onShare = async () => {
  try {
    const res = await shareContract(detail.id) as Record<string, any>
    const url = res.shareUrl || ''
    await Taro.setClipboardData({ data: url })
    Taro.showToast({ title: '已复制分享链接', icon: 'success' })
    fetchDetail()
  } catch { /*  */ }
}
// 上传回签
const showUploadPopup = ref(false)
const uploading = ref(false)
const submittedFile = ref<{ url: string; fileName: string } | null>(null)

async function onChooseFile() {
  try {
    const res = await Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })
    const filePath = res.tempFilePaths[0]
    uploading.value = true
    const uploadRes = await uploadFile(filePath, 'contract-sign')
    submittedFile.value = { url: uploadRes.url, fileName: uploadRes.fileName }
  } catch (e) {
    if ((e as any)?.errMsg?.includes('cancel')) return
    Taro.showToast({ title: '上传失败', icon: 'none' })
  } finally {
    uploading.value = false
  }
}

async function onConfirmSignBack() {
  if (!submittedFile.value) {
    Taro.showToast({ title: '请先上传文件', icon: 'none' })
    return
  }
  try {
    await signBackContract(detail.id, submittedFile.value)
    Taro.showToast({ title: '回签成功', icon: 'success' })
    showUploadPopup.value = false
    fetchDetail()
  } catch { /* */ }
}

function onUpload() {
  submittedFile.value = null
  showUploadPopup.value = true
}

onMounted(() => fetchDetail())
</script>

<style>
.cdt-page {
  min-height: 100vh;
  background: #F5F7F9;
  position: relative;
}

.cdt-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 780rpx;
  pointer-events: none;
}

.cdt-bg--pending,
.cdt-bg--approved {
  background: linear-gradient(180deg, #EAFFF7 0%, rgba(234, 255, 247, 0) 100%);
}

.cdt-bg--rejected {
  background: linear-gradient(180deg, #FFEDED 0%, rgba(255, 237, 237, 0) 100%);
}

.cdt-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
  position: absolute;
  width: 90%;
  z-index: 1;
}

.cdt-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.cdt-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.cdt-nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}

.cdt-nav-right {
  width: 60rpx;
}

.cdt-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.cdt-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.cdt-section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.cdt-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cdt-section-subtitle {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.cdt-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.cdt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cdt-row-inline {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.cdt-label {
  font-size: 30rpx;
  color: #505361;
  flex-shrink: 0;
  margin-right: 12rpx;
}

.cdt-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.cdt-suffix {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cdt-approval-timeline {
  display: flex;
  flex-direction: column;
}

.cdt-at-item {
  display: flex;
  gap: 12rpx;
}

.cdt-at-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.cdt-at-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.cdt-timeline-dot {
  width: 16rpx; height: 16rpx; border-radius: 50%; flex-shrink: 0;
}
.cdt-timeline-dot--solid { background: #37AE7E; }
.cdt-timeline-dot--empty { border: 2rpx solid #E5E6EB; background: transparent; }

.cdt-timeline-line { width: 2rpx; flex: 1; min-height: 16rpx; }
.cdt-timeline-line--fill { background: #E5E6EB; }
.cdt-timeline-line--top { background: #E5E6EB; min-height: 4rpx; flex: 0 0 8rpx; }
.cdt-timeline-line--none { background: transparent; }

.cdt-at-content--dim { opacity: 0.5; }

.cdt-at-field { display: flex; align-items: center; justify-content: space-between; }
.cdt-at-label { font-size: 28rpx; color: #62687D; flex-shrink: 0; }
.cdt-at-value { font-size: 28rpx; color: #1A1D24; text-align: right; flex: 1; margin-left: 24rpx; }
.cdt-at-value--reject { color: #F53F3F; }

.cdt-at-dot--gray {
  background: #E5E6EB;
}

.cdt-at-line {
  width: 2rpx;
  flex: 1;
  background: #E5E6EB;
  min-height: 20rpx;
}

.cdt-at-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-bottom: 40rpx;
}

.cdt-at-item:last-child .cdt-at-content {
  padding-bottom: 0;
}

.cdt-at-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.cdt-at-card {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
}

.cdt-at-card-text {
  font-size: 28rpx;
  color: #62687D;
}

.cdt-period-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 28rpx;
}

.cdt-period-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #23252C;
}

.cdt-period-body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.cdt-period-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cdt-period-label {
  font-size: 28rpx;
  color: #505361;
}

.cdt-period-value-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.cdt-period-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}

.cdt-period-suffix {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cdt-bottom-spacer {
  height: 40rpx;
}

.cdt-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #F5F7F9;
  position: relative;
  z-index: 1;
}

.cdt-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.cdt-btn--danger {
  background: #FFE6E6;
  border: 2rpx solid #F53F3F;
  color: #F53F3F;
}

.cdt-btn--primary {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  color: #5CC79C;
}

.cdt-btn--gradient {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
  color: #FFFFFF;
  border: none;
}

/* 上传回签弹窗 */
.cdt-upload-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
  background: #FFFFFF;
}

.cdt-upload-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.cdt-upload-area {
  width: 238rpx;
  height: 238rpx;
  background: #FAFAFA;
  border: 2rpx dashed #ECEBEB;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.cdt-upload-plus {
  font-size: 36rpx;
  color: #62687D;
  line-height: 1;
}

.cdt-upload-text {
  font-size: 30rpx;
  color: #62687D;
}

.cdt-upload-tip {
  font-size: 28rpx;
  color: #9292A5;
}

.cdt-upload-done {
  font-size: 28rpx;
  color: #37AE7E;
}

.cdt-upload-name {
  font-size: 24rpx;
  color: #9292A5;
  text-align: center;
  word-break: break-all;
  padding: 0 8rpx;
}

.cdt-upload-btns {
  display: flex;
  gap: 32rpx;
  width: 100%;
}

.cdt-upload-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.cdt-upload-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
  color: #37AE7E;
}

.cdt-upload-btn--confirm {
  background: #BBBEC2;
  color: #FFFFFF;
}

.cdt-upload-btn--active {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
}
</style>
