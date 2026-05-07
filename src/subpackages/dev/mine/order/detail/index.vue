<template>
  <view class="order-detail-page">
    <NavBar title="我的订单" />
    <scroll-view class="order-detail-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="order-detail-card">
        <view class="od-field od-field--first">
          <text class="od-label" style="color: #1A1D24;">订单号</text>
          <text class="od-value">{{ orderInfo.orderNo }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">公司/部门</text>
          <text class="od-value">{{ orderInfo.dept }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">关联合同</text>
          <text class="od-value">{{ orderInfo.contract }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">客户名称</text>
          <text class="od-value">{{ orderInfo.customer }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">订单金额</text>
          <text class="od-value od-value--price">{{ orderInfo.amount }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">订单状态</text>
          <view class="od-status-row">
            <view class="od-status-dot" :class="'od-status-dot--' + orderInfo.badgeType" />
            <text class="od-status-text">{{ orderInfo.badge }}</text>
          </view>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">订单生成日期</text>
          <text class="od-value">{{ orderInfo.date }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">所属销售</text>
          <text class="od-value">{{ orderInfo.sales }}</text>
        </view>
      </view>
      <view class="order-detail-card">
        <view class="od-field od-field--first">
          <text class="od-label" style="color: #1A1D24;">收件信息</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">收件人</text>
          <text class="od-value">{{ orderInfo.recipient }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">手机号</text>
          <text class="od-value">{{ orderInfo.phone }}</text>
        </view>
        <view class="od-divider" />
        <view class="od-field">
          <text class="od-label">收件地址</text>
          <text class="od-value">{{ orderInfo.address }}</text>
        </view>
      </view>
      <view class="order-detail-card">
        <view class="od-section-header">
          <text class="od-section-title">产品明细</text>
        </view>
        <scroll-view class="od-table-scroll" scroll-x>
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
            <view v-for="(row, idx) in productRows" :key="idx" class="od-table-row">
              <view class="od-td od-td--seq">{{ idx + 1 }}</view>
              <view class="od-td od-td--name">{{ row.name }}</view>
              <view class="od-td od-td--model">{{ row.model }}</view>
              <view class="od-td od-td--unit">{{ row.unit }}</view>
              <view class="od-td od-td--qty">{{ row.qty }}</view>
              <view class="od-td od-td--discount">{{ row.discount }}</view>
              <view class="od-td od-td--tax">{{ row.tax }}</view>
              <view class="od-td od-td--price">{{ row.price }}</view>
              <view class="od-td od-td--subtotal">{{ row.subtotal }}</view>
              <view class="od-td od-td--action">
                <image class="od-delete-icon" :src="iconDelete" mode="aspectFit" />
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="od-divider" />
        <view class="od-total-bar">
          <text class="od-total-label">优惠后总价</text>
          <text class="od-total-value">15,150</text>
          <text class="od-total-unit">元</text>
        </view>
      </view>

      <view class="order-detail-card">
        <view class="od-summary-row">
          <text class="od-summary-label">折前总额(不含税)</text>
          <text class="od-summary-value">￥17,450</text>
        </view>
        <view class="od-summary-row">
          <text class="od-summary-label">折后总额(不含税)</text>
          <text class="od-summary-value">￥15,999</text>
        </view>
        <view class="od-summary-row">
          <text class="od-summary-label">税费总额</text>
          <text class="od-summary-value">￥1,000</text>
        </view>
        <view class="od-divider" />
        <view class="od-summary-row">
          <text class="od-summary-label">应收总额</text>
          <view class="od-summary-total">
            <text class="od-summary-total-sign">￥</text>
            <text class="od-summary-total-amount">15,150</text>
            <text class="od-summary-total-unit">元</text>
          </view>
        </view>
      </view>
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
        <view v-else class="od-refund">
          <view class="od-refund-field">
            <text class="od-refund-label">退款编号</text>
            <text class="od-refund-value">tTK-982819</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">部分/全额退款</text>
            <text class="od-refund-value">部分退款</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">是否需要退货</text>
            <text class="od-refund-value">否</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">退款金额</text>
            <text class="od-refund-value od-refund-value--price">￥6,000</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">退款状态</text>
            <text class="od-refund-value">待审批</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">退款渠道</text>
            <text class="od-refund-value">银行</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">银行名称</text>
            <text class="od-refund-value">汇丰银行</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">银行卡号</text>
            <text class="od-refund-value">21762871827812981</text>
          </view>
          <view class="od-refund-divider" />
          <view class="od-refund-field">
            <text class="od-refund-label">退款原因</text>
            <text class="od-refund-value">客户计划有变</text>
          </view>
          <view class="od-refund-actions">
            <view class="od-refund-btn od-refund-btn--cancel">取消退款</view>
            <view class="od-refund-btn od-refund-btn--edit">重新编辑</view>
          </view>
        </view>
      </view>

    </scroll-view>

    <nut-popup v-model:visible="showLogisticsPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100">
      <view class="logistics-popup">
        <view class="logistics-popup-header">
          <text class="logistics-popup-title">查看物流</text>
          <text class="logistics-popup-close" @tap="showLogisticsPopup = false">✕</text>
        </view>
        <scroll-view class="logistics-popup-body" scroll-y>
          <nut-steps direction="vertical" :current="logisticsSteps.length" progress-dot>
            <nut-step v-for="(item, idx) in logisticsSteps" :key="idx" :title="item.desc" :content="item.time"/>
          </nut-steps>
        </scroll-view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import iconDelete from '@/assets/dev/delete.png'
import iconEmpty from '@/assets/dev/icon-empty.svg'

const showLogisticsPopup = ref(false)
const activeTab = ref('logistics')
const hasLogistics = ref(true)

const logisticsSteps = ref([
  { desc: '上海市]已签收，签收人是姚明，感谢使用天天快递，期待再次为您服务', time: '2017-12-20 14:08:54' },
  { desc: '[上海市]快件已经到达上海-应急代派', time: '2017-12-20 14:08:54' },
  { desc: '[上海市]快件已经到达ZY上海杨浦集散仓A', time: '2017-12-20 14:08:54' },
  { desc: '[上海市]快件已经到达 上海嘉定转运中心', time: '2017-12-20 14:08:54' },
  { desc: '[上海转运中心]，正发往【上海嘉定转运中心]', time: '2017-12-20 14:08:54' },
  { desc: '包裹正在等待揽收', time: '2017-12-20 14:08:54' },
  { desc: '您的订单已出库', time: '2017-12-20 14:08:54' },
  { desc: '您的订单开始处理', time: '2017-12-20 14:08:54' },
])

const orderInfo = ref({
  orderNo: '0029928912199001',
  dept: '德贝尔总公司/销售总部/销售一部',
  contract: '超凡智慧投资标准喷粉枪合同',
  customer: '超凡智慧投资',
  amount: '￥160,000',
  badge: '待发货',
  badgeType: 'yellow',
  date: '2024/01/23',
  sales: '张子曦',
  recipient: '张先生',
  phone: '15899207728',
  address: '广东省深圳市龙华区人民广场',
})

const productRows = ref([
  { name: 'V12智能数控喷粉枪', model: 'V12', unit: '台', qty: '5', discount: '-', tax: '13%', price: '680.00', subtotal: '3,400.00' },
  { name: 'E7静电自动喷粉枪', model: 'E7', unit: '台', qty: '3', discount: '-', tax: '13%', price: '580.00', subtotal: '1,740.00' },
])
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

.od-logistics {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 28rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
}

.od-logistics-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.od-logistics-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.od-logistics-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}

.od-logistics-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 114rpx;
  background: #EDFAF5;
  border: 1rpx solid #B1E9D3;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #37AE7E;
  align-self: stretch;
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

.logistics-popup {
  padding: 40rpx 0 0;
  background: #FFFFFF;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.logistics-popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 0 40rpx 40rpx;
  position: relative;
}

.logistics-popup-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  line-height: 44rpx;
}

.logistics-popup-close {
  position: absolute;
  right: 40rpx;
  top: 0;
  font-size: 28rpx;
  color: #9292A5;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logistics-popup-body {
  padding: 0 40rpx 40rpx;
  max-height: calc(70vh - 120rpx);
}

.logistics-popup .nut-steps {
  padding: 0;
}

.logistics-popup .nut-steps .nut-step {
  min-height: auto;
}

.logistics-popup .nut-steps .nut-step .nut-step-title {
  font-size: 32rpx;
  color: #62687D;
  line-height: 48rpx;
}

.logistics-popup .nut-steps .nut-step:first-child .nut-step-title {
  color: #1A1D24;
}

.logistics-popup .nut-steps .nut-step .nut-step-content {
  font-size: 28rpx;
  color: #BBBEC2;
  line-height: 40rpx;
}

.logistics-popup .nut-steps .nut-step:first-child .nut-step-content {
  color: #62687D;
}
</style>
