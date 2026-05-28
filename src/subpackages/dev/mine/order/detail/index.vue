<template>
  <view class="order-detail-page">
    <NavBar title="我的订单" />
    <scroll-view class="order-detail-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <!-- 订单信息 -->
      <view class="order-detail-card">
        <view class="od-field od-field--first">
          <text class="od-label" style="color: #1A1D24;">订单号</text>
          <text class="od-value">{{ orderDetail.orderNo }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">关联合同</text>
          <text class="od-value">{{ orderDetail.contractName || '-' }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">客户名称</text>
          <text class="od-value">{{ orderDetail.customerName }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">订单金额</text>
          <text class="od-value od-value--price">{{ formatAmount(orderDetail.receivableAmount) }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">订单状态</text>
          <view class="od-status-row">
            <view class="od-status-dot" :class="'od-status-dot--' + getBadgeType(orderDetail.orderStatus)" />
            <text class="od-status-text">{{ ORDER_STATUS_MAP[orderDetail.orderStatus] || orderDetail.orderStatus }}</text>
          </view>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">订单生成日期</text>
          <text class="od-value">{{ formatDate(orderDetail.createdAt) }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">所属销售</text>
          <text class="od-value">{{ orderDetail.salespersonName || '-' }}</text>
        </view>
      </view>

      <!-- 收件信息 -->
      <view class="order-detail-card">
        <view class="od-field od-field--first">
          <text class="od-label" style="color: #1A1D24;">收件信息</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">收件人</text>
          <text class="od-value">{{ orderDetail.recipientName || '-' }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">手机号</text>
          <text class="od-value">{{ orderDetail.phone || '-' }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">收件地址</text>
          <text class="od-value">{{ orderDetail.recipientAddress || '-' }}</text>
        </view>
      </view>

      <!-- 产品明细 -->
      <view class="order-detail-card">
        <view class="od-section-header">
          <text class="od-section-title">产品明细</text>
        </view>
        <scroll-view class="od-table-scroll" scroll-x="true">
          <view class="od-table">
            <view class="od-table-header">
              <view class="od-th od-th--seq">序号</view>
              <view class="od-th od-th--name">产品名称</view>
              <view class="od-th od-th--model">型号</view>
              <view class="od-th od-th--unit">单位</view>
              <view class="od-th od-th--qty">数量</view>
              <view class="od-th od-th--discount">折扣率</view>
              <view class="od-th od-th--tax">税率</view>
              <view class="od-th od-th--price">单价</view>
              <view class="od-th od-th--subtotal">小计</view>
              <view class="od-th od-th--action">操作</view>
            </view>
            <view v-for="(row, idx) in orderDetail.items" :key="idx" class="od-table-row">
              <view class="od-td od-td--seq">{{ row.lineNo || idx + 1 }}</view>
              <view class="od-td od-td--name">{{ row.productName }}</view>
              <view class="od-td od-td--model">{{ row.productModel || '-' }}</view>
              <view class="od-td od-td--unit">{{ row.unit || '-' }}</view>
              <view class="od-td od-td--qty">{{ row.quantity }}</view>
              <view class="od-td od-td--discount">{{ row.discountRate ? row.discountRate + '%' : '-' }}</view>
              <view class="od-td od-td--tax">{{ row.taxRate ? row.taxRate + '%' : '-' }}</view>
              <view class="od-td od-td--price">{{ formatAmount(row.unitPrice) }}</view>
              <view class="od-td od-td--subtotal">{{ formatAmount(row.subtotalAmount) }}</view>
              <view class="od-td od-td--action">
                <image class="od-delete-icon" :src="iconDelete" mode="aspectFit" />
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="od-divider" />
        <view class="od-total-bar">
          <text class="od-total-label">优惠后总价</text>
          <text class="od-total-value">{{ formatAmountRaw(orderDetail.discountedAmount) }}</text>
          <text class="od-total-unit">元</text>
        </view>
      </view>

      <!-- 金额汇总 -->
      <view class="order-detail-card">
        <view class="od-summary-row">
          <text class="od-summary-label">折前总额(不含税)</text>
          <text class="od-summary-value">￥{{ formatAmountRaw(orderDetail.totalAmount) }}</text>
        </view>
        <view class="od-summary-row">
          <text class="od-summary-label">折后总额(不含税)</text>
          <text class="od-summary-value">￥{{ formatAmountRaw(orderDetail.discountedAmount) }}</text>
        </view>
        <view class="od-summary-row">
          <text class="od-summary-label">税费总额</text>
          <text class="od-summary-value">￥{{ formatAmountRaw(orderDetail.taxAmount) }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-summary-row">
          <text class="od-summary-label">应收总额</text>
          <view class="od-summary-total">
            <text class="od-summary-total-sign">￥</text>
            <text class="od-summary-total-amount">{{ formatAmountRaw(orderDetail.receivableAmount) }}</text>
            <text class="od-summary-total-unit">元</text>
          </view>
        </view>
      </view>

      <!-- 物流/退款 Tabs -->
      <view class="order-detail-card">
        <view class="od-tabs">
          <view class="od-tab" :class="{ 'od-tab--active': activeTab === 'logistics' }" @tap="activeTab = 'logistics'">
            <text class="od-tab-text" :class="{ 'od-tab-text--active': activeTab === 'logistics' }">物流信息</text>
            <view v-if="activeTab === 'logistics'" class="od-tab-underline" />
          </view>
          <view class="od-tab" :class="{ 'od-tab--active': activeTab === 'refund' }" @tap="activeTab = 'refund'">
            <text class="od-tab-text" :class="{ 'od-tab-text--active': activeTab === 'refund' }">退款信息</text>
            <view v-if="activeTab === 'refund'" class="od-tab-underline" />
          </view>
        </view>

        <!-- 物流信息：一期不做 -->
        <!--
        <view v-if="activeTab === 'logistics'">
          <view v-if="hasLogistics" class="od-logistics">
            <view class="od-logistics-field">
              <text class="od-logistics-label">物流公司</text>
              <text class="od-logistics-value">京东快递</text>
            </view>
            <view class="od-logistics-field">
              <text class="od-logistics-label">物流单号</text>
              <text class="od-logistics-value">218278317823712</text>
            </view>
            <view class="od-logistics-field">
              <text class="od-logistics-label">发货类型</text>
              <text class="od-logistics-value">部门发货</text>
            </view>
            <view class="od-logistics-field">
              <text class="od-logistics-label">发货时间</text>
              <text class="od-logistics-value">2025.01.19 12:00:59</text>
            </view>
            <view class="od-logistics-field">
              <text class="od-logistics-label">最新物流状态</text>
              <text class="od-logistics-value">已签收</text>
            </view>
            <view class="od-logistics-btn" @tap="showLogisticsPopup = true">查看物流</view>
          </view>
          <view v-else class="od-empty">
            <image class="od-empty-icon" :src="iconEmpty" mode="aspectFit" />
            <text class="od-empty-text">暂无数据</text>
          </view>
        </view>
        -->
        <view v-if="activeTab === 'logistics'">
          <view class="od-empty">
            <image class="od-empty-icon" :src="iconEmpty" mode="aspectFit" />
            <text class="od-empty-text">暂未开放</text>
          </view>
        </view>

        <!-- 退款信息 -->
        <view v-if="activeTab === 'refund'">
          <view v-if="orderDetail.refunds && orderDetail.refunds.length > 0">
            <view v-for="(refund, rIdx) in orderDetail.refunds" :key="refund.id">
              <view v-if="rIdx > 0" class="od-refund-separator" />
              <view class="od-refund">
                <view class="od-refund-field">
                  <text class="od-refund-label">退款编号</text>
                  <text class="od-refund-value">{{ refund.refundNo }}</text>
                </view>
                <view class="od-refund-divider" />
                <view class="od-refund-field">
                  <text class="od-refund-label">部分/全额退款</text>
                  <text class="od-refund-value">{{ REFUND_TYPE_MAP[refund.refundType] || refund.refundType }}</text>
                </view>
                <view class="od-refund-divider" />
                <view class="od-refund-field">
                  <text class="od-refund-label">是否需要退货</text>
                  <text class="od-refund-value">{{ RETURN_REQUIREMENT_MAP[refund.returnRequirement] || refund.returnRequirement }}</text>
                </view>
                <view class="od-refund-divider" />
                <view class="od-refund-field">
                  <text class="od-refund-label">退款金额</text>
                  <text class="od-refund-value od-refund-value--price">{{ formatAmount(refund.refundAmount) }}</text>
                </view>
                <view class="od-refund-divider" />
                <view class="od-refund-field">
                  <text class="od-refund-label">退款状态</text>
                  <text class="od-refund-value">{{ REFUND_STATUS_MAP[refund.refundStatus] || refund.refundStatus }}</text>
                </view>
                <view class="od-refund-divider" />
                <view class="od-refund-field">
                  <text class="od-refund-label">退款渠道</text>
                  <text class="od-refund-value">{{ REFUND_CHANNEL_MAP[refund.refundChannel] || refund.refundChannel }}</text>
                </view>
                <view v-if="refund.bankName" class="od-refund-divider" />
                <view v-if="refund.bankName" class="od-refund-field">
                  <text class="od-refund-label">银行名称</text>
                  <text class="od-refund-value">{{ refund.bankName }}</text>
                </view>
                <view v-if="refund.bankAccountNo" class="od-refund-divider" />
                <view v-if="refund.bankAccountNo" class="od-refund-field">
                  <text class="od-refund-label">银行卡号</text>
                  <text class="od-refund-value">{{ refund.bankAccountNo }}</text>
                </view>
                <view class="od-refund-divider" />
                <view class="od-refund-field">
                  <text class="od-refund-label">退款原因</text>
                  <text class="od-refund-value">{{ refund.reason || '-' }}</text>
                </view>
                <view class="od-refund-actions">
                  <view v-if="refund.refundStatus === 'pending_approval'" class="od-refund-btn od-refund-btn--cancel" @tap="onCancelRefund(refund)">取消退款</view>
                  <view v-if="refund.refundStatus === 'approval_rejected'" class="od-refund-btn od-refund-btn--edit" @tap="onEditRefund(refund)">重新编辑</view>
                </view>
              </view>
            </view>
          </view>
          <view v-else class="od-empty">
            <image class="od-empty-icon" :src="iconEmpty" mode="aspectFit" />
            <text class="od-empty-text">暂无退款记录</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import {
  getOrderDetail,
  cancelRefund,
  type OrderDetailResponse,
  type RefundRecord,
  ORDER_STATUS_MAP,
  ORDER_STATUS_BADGE_MAP,
  REFUND_STATUS_MAP,
  REFUND_TYPE_MAP,
  REFUND_CHANNEL_MAP,
  RETURN_REQUIREMENT_MAP,
} from '@/api/order'
import iconDelete from '@/assets/dev/delete.png'
import iconEmpty from '@/assets/dev/icon-empty.svg'

const activeTab = ref('logistics')

const orderDetail = ref<OrderDetailResponse>({
  id: 0,
  orderNo: '',
  contractName: '',
  customerName: '',
  orderStatus: '',
  totalAmount: 0,
  discountedAmount: 0,
  taxAmount: 0,
  receivableAmount: 0,
  refundedAmount: 0,
  currencyCode: '',
  recipientName: '',
  phone: '',
  recipientAddress: '',
  salespersonName: '',
  createdAt: '',
  items: [],
  shipments: [],
  refunds: [],
})

function formatAmount(cent: number): string {
  if (cent === undefined || cent === null) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatAmountRaw(cent: number): string {
  if (cent === undefined || cent === null) return '0'
  return (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return dateStr.replace(/T/, ' ').replace(/\..*/, '').slice(0, 19)
}

function getBadgeType(status: string): string {
  return ORDER_STATUS_BADGE_MAP[status] || 'gray'
}

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  if (!id) return
  try {
    const res = await getOrderDetail(id)
    orderDetail.value = res
  } catch {
    // 错误已在 request 层统一处理
  }
}

async function onCancelRefund(refund: RefundRecord) {
  try {
    await Taro.showModal({
      title: '提示',
      content: '确定要取消该退款申请吗？',
    })
    await cancelRefund(refund.id)
    Taro.showToast({ title: '已取消', icon: 'success' })
    fetchDetail()
  } catch {
    // 用户取消或请求失败
  }
}

function onEditRefund(_refund: RefundRecord) {
  // 一期预留：跳转编辑退款页面
  Taro.showToast({ title: '重新编辑功能开发中', icon: 'none' })
}

fetchDetail()
</script>

<style>
.order-detail-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.order-detail-scroll {
  padding: 24rpx 40rpx 40rpx;
  box-sizing: border-box;
}

.order-detail-card {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.od-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.od-field--first .od-label {
  font-size: 32rpx;
  font-weight: 600;
}

.od-field--first .od-value {
  font-size: 32rpx;
  font-weight: 500;
}

.od-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.od-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}

.od-value--price {
  font-weight: 600;
}

.od-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.od-status-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.od-status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #E6A23C;
}

.od-status-dot--yellow {
  background: #FFAE17;
}

.od-status-dot--green {
  background: #37AE7E;
}

.od-status-dot--red {
  background: #F56C6C;
}

.od-status-dot--gray {
  background: #9292A5;
}

.od-status-text {
  font-size: 28rpx;
  color: #1A1D24;
}

.od-tabs {
  display: flex;
  justify-content: space-between;
  border-bottom: 1rpx solid #E5E6EB;
}

.od-tab {
  width: 50%;
  text-align: center;
  position: relative;
  padding: 0 0 28rpx;
}

.od-tab-text {
  font-size: 30rpx;
  color: #62687D;
}

.od-tab-text--active {
  color: #1A1D24;
  font-weight: 500;
}

.od-tab-underline {
  position: absolute;
  bottom: -1rpx;
  left: 0;
  right: 0;
  height: 4rpx;
  background: #37AE7E;
  border-radius: 2rpx;
}

.od-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx 0;
}

.od-empty-icon {
  width: 96rpx;
  height: 96rpx;
}

.od-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.od-refund {
  display: flex;
  flex-direction: column;
}

.od-refund-separator {
  height: 1rpx;
  background: #E5E6EB;
  margin: 20rpx 0;
}

.od-refund-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
}

.od-refund-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.od-refund-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}

.od-refund-value--price {
  font-weight: 600;
}

.od-refund-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.od-refund-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding-top: 16rpx;
}

.od-refund-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 0;
  border-radius: 8rpx;
  font-size: 28rpx;
  flex: 1;
}

.od-refund-btn--cancel {
  background: #FFF4F4;
  border: 1rpx solid #FFE8E8;
  color: #F53F3F;
}

.od-refund-btn--edit {
  background: #EDFAF5;
  border: 1rpx solid #B1E9D3;
  color: #37AE7E;
}

.od-section-header {
  font-size: 32rpx;
  padding-bottom: 0;
}

.od-section-title {
  font-weight: 600;
  color: #1A1D24;
}

.od-table-scroll {
  width: 100%;
  white-space: nowrap;
}

.od-table {
  display: inline-block;
}

.od-table-header {
  display: flex;
  background: #F9F9F9;
  border-top: 1rpx solid #EDEDED;
  border-bottom: 1rpx solid #EDEDED;
}

.od-table-row {
  display: flex;
  border-bottom: 1rpx solid #EDEDED;
}

.od-table-row:last-child {
  border-bottom: none;
}

.od-th, .od-td {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 6rpx;
  text-align: center;
}

.od-th {
  font-size: 28rpx;
  color: #62687D;
}

.od-td {
  font-size: 24rpx;
  color: #1A1D24;
}

.od-th--seq, .od-td--seq { width: 72rpx; }
.od-th--name, .od-td--name { width: 280rpx; }
.od-th--model, .od-td--model { width: 318rpx; }
.od-th--unit, .od-td--unit { width: 100rpx; }
.od-th--qty, .od-td--qty { width: 100rpx; }
.od-th--discount, .od-td--discount { width: 120rpx; }
.od-th--tax, .od-td--tax { width: 100rpx; }
.od-th--price, .od-td--price { width: 118rpx; }
.od-th--subtotal, .od-td--subtotal { width: 120rpx; }
.od-th--action, .od-td--action { width: 82rpx; }

.od-th--seq, .od-th--name, .od-th--model,
.od-td--seq, .od-td--name, .od-td--model {
  font-size: 28rpx;
}

.od-td--subtotal {
  font-weight: 600;
}

.od-delete-icon {
  width: 28rpx;
  height: 28rpx;
  display: block;
}

.od-total-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6rpx;
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border-radius: 6rpx;
  margin-top: -1rpx;
}

.od-total-label {
  font-size: 30rpx;
  color: #505361;
}

.od-total-value {
  font-size: 30rpx;
  color: #1A1D24;
}

.od-total-unit {
  font-size: 28rpx;
  color: #62687D;
}

.od-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.od-summary-label {
  font-size: 30rpx;
  color: #505361;
}

.od-summary-value {
  font-size: 30rpx;
  font-weight: 700;
  font-family: Alimama ShuHeiTi, PingFang SC, sans-serif;
  color: #1A1D24;
}

.od-summary-total {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.od-summary-total-sign {
  font-size: 28rpx;
  font-weight: 700;
  font-family: Alimama ShuHeiTi, PingFang SC, sans-serif;
  color: #EB3F29;
}

.od-summary-total-amount {
  font-size: 36rpx;
  font-weight: 700;
  font-family: Alimama ShuHeiTi, PingFang SC, sans-serif;
  color: #EB3F29;
}

.od-summary-total-unit {
  font-size: 28rpx;
  color: #62687D;
}
</style>
