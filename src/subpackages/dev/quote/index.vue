<template>
  <view class="q-page">
    <view class="q-nav-bar">
      <view class="q-nav-back" @tap="goBack">
        <image class="q-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="q-nav-title">我要报价</text>
      <view class="q-nav-right" />
    </view>

    <scroll-view class="q-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="q-card">
        <view class="q-field" @tap="onSelectTemplate">
          <text class="q-field-label">报价模板</text>
          <view class="q-field-right">
            <text class="q-field-value">金刚钻F1自动喷枪报价方案书</text>
            <image class="q-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">模板编号</text>
          <text class="q-field-value">QT-0019012</text>
        </view>
      </view>

      <view class="q-card">
        <view class="q-field" @tap="onSelectBuyer">
          <text class="q-field-label">需方信息</text>
          <view class="q-field-right">
            <text class="q-field-value">张先生</text>
            <image class="q-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">单位全称</text>
          <input class="q-input" v-model="form.company" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">地址</text>
          <input class="q-input" v-model="form.address" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">联系人</text>
          <text class="q-field-value">孙大星</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">手机号</text>
          <text class="q-field-value">15877720098</text>
        </view>
      </view>

      <view class="q-card">
        <view class="q-field">
          <text class="q-field-label">报价单号</text>
          <text class="q-field-placeholder">自动生成，无需输入</text>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">报价名称</text>
          <input class="q-input" v-model="form.name" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">报价时效</text>
          <view class="q-field-row">
            <input class="q-input" v-model="form.validity" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="q-suffix">月</text>
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">保修时限</text>
          <view class="q-field-row">
            <input class="q-input" v-model="form.warranty" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="q-suffix">年</text>
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">交货期限</text>
          <view class="q-field-row">
            <input class="q-input" v-model="form.delivery" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="q-suffix">天</text>
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">签约完成后付款金额</text>
          <view class="q-field-row">
            <input class="q-input" v-model="form.payAfterSign" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="q-suffix">元</text>
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">货物打包后付款金额</text>
          <view class="q-field-row">
            <input class="q-input" v-model="form.payAfterPack" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="q-suffix">元</text>
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">安装调试后付款金额</text>
          <view class="q-field-row">
            <input class="q-input" v-model="form.payAfterInstall" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="q-suffix">元</text>
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">验收完成后付款金额</text>
          <view class="q-field-row">
            <input class="q-input" v-model="form.payAfterCheck" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
            <text class="q-suffix">元</text>
          </view>
        </view>
      </view>

      <view class="q-card">
        <view class="q-field" @tap="onSelectOpportunity">
          <text class="q-field-label">商机名称</text>
          <view class="q-field-right">
            <text class="q-field-value">金石科技高端机采购书</text>
            <image class="q-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="q-divider" />
        <view class="q-field">
          <text class="q-field-label">商机编号</text>
          <text class="q-field-value">SJ-102891021</text>
        </view>
      </view>

      <view class="q-card">
        <view class="q-section-head">
          <text class="q-section-title">产品明细</text>
          <view class="q-add-row" @tap="onAddProduct">
            <image class="q-add-icon" :src="iconPlus" mode="aspectFit" />
            <text class="q-add-text">添加产品</text>
          </view>
        </view>
        <view class="q-divider" />
        <scroll-view class="q-table-scroll" scroll-x :enhanced="true" :show-scrollbar="false">
          <view class="q-table">
            <view class="q-tr q-tr--head">
              <view class="q-th" style="width:72rpx">序号</view>
              <view class="q-th" style="width:280rpx">产品名称</view>
              <view class="q-th" style="width:318rpx">型号</view>
              <view class="q-th" style="width:160rpx">单位</view>
              <view class="q-th" style="width:160rpx">数量</view>
              <view class="q-th" style="width:160rpx">折扣率</view>
              <view class="q-th" style="width:160rpx">税率</view>
              <view class="q-th" style="width:118rpx">单价</view>
              <view class="q-th" style="width:120rpx">小计</view>
              <view class="q-th" style="width:82rpx">操作</view>
            </view>
            <view class="q-tr">
              <view class="q-td" style="width:72rpx">01</view>
              <view class="q-td" style="width:280rpx">E7 手动喷枪</view>
              <view class="q-td" style="width:318rpx">E7</view>
              <view class="q-td" style="width:160rpx">台</view>
              <view class="q-td" style="width:160rpx">2</view>
              <view class="q-td" style="width:160rpx">-</view>
              <view class="q-td" style="width:160rpx">7%</view>
              <view class="q-td" style="width:118rpx">￥1,654</view>
              <view class="q-td q-td--bold" style="width:120rpx">￥3,001</view>
              <view class="q-td" style="width:82rpx">
                <image class="q-delete-icon" :src="iconDelete" mode="aspectFit" />
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="q-divider" />
        <view class="q-total-row">
          <text class="q-total-label">优惠后总价</text>
          <text class="q-total-value">15,150</text>
          <text class="q-total-unit">元</text>
        </view>
      </view>

      <view class="q-card">
        <view class="q-field">
          <text class="q-field-label">折前总额(不含税)</text>
          <text class="q-field-value q-field-value--amount">￥17,450</text>
        </view>
        <view class="q-field">
          <text class="q-field-label">折后总额(不含税)</text>
          <text class="q-field-value q-field-value--amount">￥15,999</text>
        </view>
        <view class="q-field">
          <text class="q-field-label">税费总额</text>
          <text class="q-field-value q-field-value--amount">￥1,000</text>
        </view>
        <view class="q-field">
          <text class="q-field-label">应收总额</text>
          <text class="q-field-value q-field-value--total">￥15,150</text>
        </view>
      </view>
    </scroll-view>

    <view class="q-actions">
      <view class="q-btn q-btn--preview" @tap="onPreview">预览</view>
      <view class="q-btn q-btn--submit" @tap="onSubmit">提交报价单</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import iconBack from '@/assets/dev/icon-back.png'
import rightArrow from '@/assets/dev/rightArror.png'
import iconPlus from '@/assets/dev/icon-add.png'
import iconDelete from '@/assets/dev/delete.png'

const form = reactive({
  name: '',
  company: '',
  address: '',
  validity: '',
  warranty: '',
  delivery: '',
  payAfterSign: '',
  payAfterPack: '',
  payAfterInstall: '',
  payAfterCheck: '',
  discount: '',
  freight: '',
  otherFee: '',
  remark: '',
})

const goBack = () => {
  Taro.navigateBack()
}

const onSelectBuyer = () => {
  Taro.showToast({ title: '选择需方', icon: 'none' })
}

const onSelectOpportunity = () => {
  Taro.showToast({ title: '选择商机', icon: 'none' })
}

const onAddProduct = () => {
  Taro.showToast({ title: '添加产品', icon: 'none' })
}

const onPreview = () => {
  Taro.showToast({ title: '预览', icon: 'none' })
}

const onSubmit = () => {
  Taro.showToast({ title: '提交成功', icon: 'none' })
}
</script>

<style>
.q-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.q-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx;
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
  height: calc(100vh - 153rpx - 120rpx);
  padding: 24rpx 40rpx;
  box-sizing: border-box;
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

.q-field-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  justify-content: flex-end;
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

.q-field-placeholder {
  font-size: 28rpx;
  color: #BBBEC2;
  text-align: right;
}

.q-input {
  flex: 1;
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
}

.q-field-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  justify-content: flex-end;
}

.q-suffix {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.q-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
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

.q-add-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.q-add-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.q-add-text {
  font-size: 28rpx;
  color: #37AE7E;
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
  min-width: 1630rpx;
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

.q-tr:last-child .q-th,
.q-tr:last-child .q-td {
  border-bottom: none;
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

.q-td:last-child,
.q-th:last-child {
  border-right: none;
}

.q-td--bold {
  font-weight: 600;
}

.q-delete-icon {
  width: 32rpx;
  height: 32rpx;
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

.q-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #FFFFFF;
}

.q-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.q-btn--preview {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  color: #5CC79C;
}

.q-btn--submit {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
  color: #FFFFFF;
}
</style>
