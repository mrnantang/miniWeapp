<template>
  <view class="ct-page">
    <NavBar title="新建合同" />
    <scroll-view class="ct-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="ct-card">
        <view class="ct-field" @tap="onSelectTemplate">
          <text class="ct-label">合同模板</text>
          <view class="ct-field-right">
            <text class="ct-value">E7 手动购销合同模板</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">合同模板编号</text>
          <text class="ct-value">HT-1000</text>
        </view>
      </view>

      <view class="ct-card">
        <view class="ct-field" @tap="onSelectBuyer">
          <text class="ct-label ct-label--title">需方信息</text>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">单位全称</text>
          <input class="ct-input" v-model="form.buyerCompany" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">联系人</text>
          <input class="ct-input" v-model="form.buyerContact" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">联系电话</text>
          <input class="ct-input" v-model="form.buyerPhone" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" type="number" />
        </view>
        <view class="ct-divider" />
        <view class="ct-field" @tap="onSelectBuyerRegion">
          <text class="ct-label">省/市/区</text>
          <view class="ct-field-right">
            <text class="ct-placeholder">请选择</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">地址</text>
          <input class="ct-input" v-model="form.buyerAddress" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
      </view>

      <view class="ct-card">
        <view class="ct-field" @tap="onSelectSupplier">
          <text class="ct-label ct-label--title">供方信息</text>
          <view class="ct-field-right">
            <text class="ct-placeholder">请选择</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
      </view>

      <view class="ct-card">
        <view class="ct-field">
          <text class="ct-label ct-label--title">收货信息</text>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">收件人</text>
          <input class="ct-input" v-model="form.receiver" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">收件手机号</text>
          <input class="ct-input" v-model="form.receiverPhone" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" type="number" />
        </view>
        <view class="ct-divider" />
        <view class="ct-field" @tap="onSelectRegion">
          <text class="ct-label">收货省市区</text>
          <view class="ct-field-right">
            <text class="ct-placeholder">请选择</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">收货详细地址</text>
          <input class="ct-input" v-model="form.receiverAddress" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
      </view>

      <view class="ct-card">
        <text class="ct-label ct-label--title">合同信息</text>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">合同编号</text>
          <text class="ct-placeholder">自动生成，无需输入</text>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">合同名称</text>
          <input class="ct-input" v-model="form.contractName" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">安装时长</text>
          <view class="ct-field-row">
            <input class="ct-input" v-model="form.installDays" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
            <text class="ct-suffix">天</text>
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">保修期限</text>
          <view class="ct-field-row">
            <input class="ct-input" v-model="form.warranty" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
            <text class="ct-suffix">月</text>
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field" @tap="onSelectTaxIncluded">
          <text class="ct-label">是否含税</text>
          <view class="ct-field-right">
            <text class="ct-value">是</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">税点</text>
          <view class="ct-field-row">
            <input class="ct-input" v-model="form.taxRate" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
            <text class="ct-suffix">%</text>
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field" @tap="onSelectPaymentMethod">
          <text class="ct-label">付款方式</text>
          <view class="ct-field-right">
            <text class="ct-placeholder">请输入</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">支付方式</text>
          <text class="ct-value">分期支付</text>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">分付周期</text>
          <text class="ct-value">4</text>
        </view>
         <view v-for="(period, idx) in periods" :key="idx" class="ct-period-card">
          <view class="ct-period-head">
            <text class="ct-period-title">{{ period.title }}</text>
          </view>
          <view class="ct-period-body">
            <view class="ct-period-field">
              <text class="ct-label">支付比例</text>
              <view class="ct-field-row">
                <input class="ct-input" v-model="period.ratio" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
                <text class="ct-suffix">%</text>
              </view>
            </view>
            <view class="ct-period-field">
              <text class="ct-label">支付金额</text>
              <view class="ct-field-row">
                <input class="ct-input" v-model="period.amount" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
                <text class="ct-suffix">元</text>
              </view>
            </view>
            <view class="ct-period-field">
              <text class="ct-label">应收款节点</text>
              <view class="ct-field-row">
                <input class="ct-input" v-model="period.deadline" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
                 <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <nut-popup v-model:visible="showTemplatePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
      <view class="ct-tmpl-popup">
        <view class="ct-pay-header">
          <text class="ct-pay-cancel" @tap="showTemplatePopup = false">取消</text>
          <text class="ct-pay-title">选择合同模板</text>
          <text class="ct-pay-confirm" @tap="onTemplateConfirm">确认</text>
        </view>
        <view class="ct-tmpl-body">
          <view
            v-for="tpl in templateOptions"
            :key="tpl"
            class="ct-tmpl-card"
            :class="{ 'ct-tmpl-card--active': selectedTemplate === tpl }"
            @tap="selectedTemplate = tpl"
          >
            <text class="ct-tmpl-text">{{ tpl }}</text>
            <view class="ct-tmpl-checkbox" :class="{ 'ct-tmpl-checkbox--checked': selectedTemplate === tpl }">
              <view v-if="selectedTemplate === tpl" class="ct-tmpl-checkbox-dot" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showSupplierPopup" position="center" :style="{ borderRadius: '16rpx' }" :z-index="2100">
      <view class="ct-supplier-card">
        <text class="ct-supplier-title">供方信息</text>
        <view class="ct-supplier-divider" />
        <view class="ct-supplier-field" @tap="onSelectSupplierCompany">
          <text class="ct-supplier-label">供方</text>
          <view class="ct-supplier-right">
            <text class="ct-supplier-value">德贝尔总公司</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-supplier-divider" />
        <view class="ct-supplier-field" @tap="onSelectAccountType">
          <text class="ct-supplier-label">收款公户/私户</text>
          <view class="ct-supplier-right">
            <text class="ct-supplier-value">私户</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-supplier-divider" />
        <view class="ct-supplier-field">
          <text class="ct-supplier-label">收款账户名称</text>
          <text class="ct-supplier-value">孙星星</text>
        </view>
        <view class="ct-supplier-divider" />
        <view class="ct-supplier-field">
          <text class="ct-supplier-label">收款私户账户</text>
          <text class="ct-supplier-value">21892781378271381</text>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showPaymentPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
      <view class="ct-pay-popup">
        <view class="ct-pay-header">
          <text class="ct-pay-cancel" @tap="showPaymentPopup = false">取消</text>
          <text class="ct-pay-title">付款方式</text>
          <text class="ct-pay-confirm" @tap="onPaymentConfirm">确认</text>
        </view>
        <view class="ct-pay-body">
          <template v-for="(item, idx) in paymentOptions" :key="item">
            <view class="ct-pay-row" @tap="selectPayment(item)">
              <text class="ct-pay-row-text">{{ item }}</text>
              <view class="ct-pay-checkbox" :class="{ 'ct-pay-checkbox--checked': selectedPayment === item }">
                <view v-if="selectedPayment === item" class="ct-pay-checkbox-dot" />
              </view>
            </view>
            <view v-if="idx < paymentOptions.length - 1" class="ct-pay-divider" />
          </template>
        </view>
      </view>
    </nut-popup>

    <view class="ct-actions">
      <view class="ct-btn ct-btn--preview" @tap="onPreview">预览合同</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import rightArrow from '@/assets/dev/rightArror.png'

const form = reactive({
  buyerCompany: '',
  buyerContact: '',
  buyerPhone: '',
  buyerAddress: '',
  receiver: '',
  receiverPhone: '',
  receiverAddress: '',
  contractName: '',
  installDays: '',
  warranty: '',
  taxRate: '',
})

const periods = ref([
  { title: '一期', ratio: '', amount: '', deadline: '' },
  { title: '二期', ratio: '', amount: '', deadline: '' },
  { title: '三期', ratio: '', amount: '', deadline: '' },
  { title: '四期', ratio: '', amount: '', deadline: '' },
])

const showSupplierPopup = ref(false)
const showPaymentPopup = ref(false)
const showTemplatePopup = ref(false)
const selectedPayment = ref('先发货后付款')
const paymentOptions = ['先发货后付款', '分期支付']
const selectedTemplate = ref('E7 手动购销合同模板')
const templateOptions = ['E7 手动购销合同模板', '智能枪购销合同模板']

const onSelectTemplate = () => {
  showTemplatePopup.value = true
}

const onSelectBuyer = () => {
  Taro.showToast({ title: '选择需方', icon: 'none' })
}

const onSelectBuyerRegion = () => {
  Taro.showToast({ title: '选择省市区', icon: 'none' })
}

const onTemplateConfirm = () => {
  showTemplatePopup.value = false
}

const onSelectSupplier = () => {
  showSupplierPopup.value = true
}

const onSelectRegion = () => {
  Taro.showToast({ title: '选择省市区', icon: 'none' })
}

const onSelectTaxIncluded = () => {
  Taro.showToast({ title: '选择是否含税', icon: 'none' })
}

const onSelectPaymentMethod = () => {
  showPaymentPopup.value = true
}

const selectPayment = (item) => {
  selectedPayment.value = item
}

const onPaymentConfirm = () => {
  showPaymentPopup.value = false
  Taro.showToast({ title: '已选择' + selectedPayment.value, icon: 'none' })
}

const onSelectSupplierCompany = () => {
  Taro.showToast({ title: '选择供方公司', icon: 'none' })
}

const onSelectAccountType = () => {
  Taro.showToast({ title: '选择账户类型', icon: 'none' })
}

const onPreview = () => {
  Taro.showToast({ title: '预览合同', icon: 'none' })
}
</script>

<style>
.ct-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.ct-scroll {
  height: calc(100vh - 153rpx - 120rpx);
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.ct-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.ct-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ct-field-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  justify-content: flex-end;
}

.ct-field-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  justify-content: flex-end;
}

.ct-label {
  font-size: 30rpx;
  color: #505361;
  flex-shrink: 0;
  margin-right: 12rpx;
}

.ct-label--title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.ct-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
}

.ct-placeholder {
  font-size: 30rpx;
  color: #BBBEC2;
  text-align: right;
}

.ct-input {
  flex: 1;
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
}

.ct-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.ct-suffix {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.ct-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.ct-period-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 28rpx;
}

.ct-period-head {
  display: flex;
  align-items: center;
}

.ct-period-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #23252C;
}

.ct-period-body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.ct-period-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ct-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #FFFFFF;
}

.ct-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.ct-btn--preview {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  color: #5CC79C;
}

.ct-supplier-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  width: 670rpx;
  box-sizing: border-box;
}

.ct-supplier-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.ct-tmpl-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48rpx;
  padding: 40rpx 0 0;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
}

.ct-tmpl-body {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 32rpx;
  padding: 0 40rpx;
}

.ct-tmpl-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 28rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
}

.ct-tmpl-card--active {
  background: #EDFAF5;
  border-color: #37AE7E;
  border-radius: 6rpx;
}

.ct-tmpl-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
  flex: 1;
}

.ct-tmpl-checkbox {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 2rpx solid #E5E6EB;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
}

.ct-tmpl-checkbox--checked {
  background: #37AE7E;
  border-color: #37AE7E;
}

.ct-tmpl-checkbox-dot {
  width: 14rpx;
  height: 10rpx;
  border-left: 3rpx solid #FFFFFF;
  border-bottom: 3rpx solid #FFFFFF;
  transform: rotate(-45deg);
  margin-top: -3rpx;
}

.ct-supplier-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.ct-supplier-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ct-supplier-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}

.ct-supplier-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  justify-content: flex-end;
}

.ct-supplier-value {
  font-size: 30rpx;
  color: #62687D;
  text-align: right;
}

.ct-pay-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48rpx;
  padding: 40rpx 0 0;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
}

.ct-pay-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  width: 670rpx;
}

.ct-pay-cancel {
  font-size: 34rpx;
  color: #828593;
  flex-shrink: 0;
}

.ct-pay-title {
  flex: 1;
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.ct-pay-confirm {
  font-size: 34rpx;
  color: #37AE7E;
  flex-shrink: 0;
}

.ct-pay-body {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 0;
  padding: 0 40rpx;
}

.ct-pay-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  padding: 24rpx 0;
}

.ct-pay-row-text {
  font-size: 30rpx;
  color: #1A1D24;
}

.ct-pay-checkbox {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #E5E6EB;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
}

.ct-pay-checkbox--checked {
  background: #37AE7E;
  border-color: #37AE7E;
}

.ct-pay-checkbox-dot {
  width: 18rpx;
  height: 14rpx;
  border-left: 4rpx solid #FFFFFF;
  border-bottom: 4rpx solid #FFFFFF;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

.ct-pay-divider {
  height: 1rpx;
  background: #F4F4F4;
}
</style>
