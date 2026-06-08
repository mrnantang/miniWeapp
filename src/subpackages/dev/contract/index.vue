<template>
  <view class="ct-page">
    <NavBar title="新建合同" />
    <scroll-view class="ct-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="ct-card">
        <view class="ct-field" @tap="onSelectTemplate">
          <text class="ct-label">合同模板</text>
          <view class="ct-field-right">
            <text :class="form.templateName ? 'ct-value' : 'ct-placeholder'">{{ form.templateName || '请选择模板' }}</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-divider" />
        <view class="ct-field">
          <text class="ct-label">合同模板编号</text>
          <text class="ct-value">{{ form.templateNo || '-' }}</text>
        </view>
      </view>

      <!-- 动态字段卡片：按 category 分组 -->
      <view v-for="group in fieldGroups" :key="group.category" class="ct-card">
        <text class="ct-label ct-label--title">{{ group.category }}</text>
        <view class="ct-divider" />
        <template v-for="(field, fi) in group.fields" :key="field.key">
          <view class="ct-field">
            <text class="ct-label">{{ field.label }}</text>
            <input class="ct-input" v-model="formData[field.key]" :placeholder="'请输入'"
              placeholder-style="color:#BBBEC2;font-size:30rpx" />
          </view>
          <view v-if="fi < group.fields.length - 1" class="ct-divider" />
        </template>
      </view>

      <!-- 供方信息 -->
  <!--     <view class="ct-card">
        <view class="ct-field" @tap="onSelectSupplier">
          <text class="ct-label ct-label--title">供方信息</text>
          <view class="ct-field-right">
            <text class="ct-placeholder">请选择</text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
      </view> -->
    </scroll-view>

    <nut-popup v-model:visible="showTemplatePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" portal-disable safe-area-inset-bottom>
      <view class="ct-popup">
        <view class="q-popup-header">
          <text class="ct-pay-cancel" @tap="showTemplatePopup = false">取消</text>
          <text class="q-popup-title">选择合同模板</text>
          <text class="q-popup-confirm" @tap="onTemplateConfirm">确认</text>
        </view>
        <scroll-view class="ct-tmpl-list" scroll-y :enhanced="true" :show-scrollbar="false">
          <view v-if="templateLoading" class="q-popup-tip">加载中...</view>
          <view v-else-if="templateList.length === 0" class="q-popup-tip">暂无模板</view>
          <template v-else v-for="item in templateList" :key="item.id">
            <view class="ct-tmpl-card" :class="{ 'ct-tmpl-card--active': selectedTemplateId === item.id }" @tap="selectedTemplateId = item.id">
              <view class="ct-tmpl-info">
                <text class="ct-tmpl-name">{{ item.name }}</text>
                <text class="ct-tmpl-no">{{ item.templateNo }}</text>
              </view>
              <view class="ct-tmpl-checkbox" :class="{ 'ct-tmpl-checkbox--checked': selectedTemplateId === item.id }">
                <view v-if="selectedTemplateId === item.id" class="ct-tmpl-checkbox-dot" />
              </view>
            </view>
            <view class="ct-divider" />
          </template>
        </scroll-view>
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
      <view class="ct-btn ct-btn--submit" @tap="onSubmit">生成合同</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getContractTemplates, getContractTemplateDetail, createContract, type ContractTemplateItem, type ContractTokenField } from '@/api/contract'
import rightArrow from '@/assets/dev/rightArror.png'

// 固定字段
const form = reactive({
  templateId: 0,
  templateName: '',
  templateNo: '',
})

const customerId = ref(0)

onMounted(() => {
  const instance = Taro.getCurrentInstance()
  customerId.value = Number(instance.router?.params?.customerId) || 0
})

// 动态字段值
const formData = reactive<Record<string, string>>({})

// 模板弹窗
const showTemplatePopup = ref(false)
const templateLoading = ref(false)
const templateList = ref<ContractTemplateItem[]>([])
const selectedTemplateId = ref(0)

// 模板详情
const tokenSchema = ref<ContractTokenField[]>([])

// 按 category 分组
const fieldGroups = computed(() => {
  const groups: Array<{ category: string; fields: ContractTokenField[] }> = []
  const seen = new Set<string>()
  for (const f of tokenSchema.value) {
    const cat = f.category || '其他'
    if (!seen.has(cat)) {
      seen.add(cat)
      groups.push({ category: cat, fields: [] })
    }
    const g = groups.find(g => g.category === cat)!
    g.fields.push(f)
  }
  return groups
})

async function onSelectTemplate() {
  showTemplatePopup.value = true
  if (templateList.value.length > 0) return
  templateLoading.value = true
  try {
    const res = await getContractTemplates({ page: 1, pageSize: 100 })
    templateList.value = res.items || []
  } catch { /*  */ }
  finally { templateLoading.value = false }
}

async function onTemplateConfirm() {
  if (!selectedTemplateId.value) {
    Taro.showToast({ title: '请选择模板', icon: 'none' })
    return
  }
  showTemplatePopup.value = false
  try {
    const detail = await getContractTemplateDetail(selectedTemplateId.value)
    form.templateId = detail.id
    form.templateName = detail.name
    form.templateNo = detail.templateNo
    tokenSchema.value = detail.tokenSchema || []
    // 初始化 formData 默认值
    for (const f of detail.tokenSchema || []) {
      formData[f.key] = f.defaultValue || ''
    }
  } catch { /*  */ }
}

const showSupplierPopup = ref(false)
const showPaymentPopup = ref(false)
const selectedPayment = ref('先发货后付款')
const paymentOptions = ['先发货后付款', '分期支付']

const onSelectBuyer = () => Taro.showToast({ title: '选择需方', icon: 'none' })
const onSelectSupplier = () => showSupplierPopup.value = true
const onSelectRegion = () => Taro.showToast({ title: '选择省市区', icon: 'none' })
const onSelectTaxIncluded = () => Taro.showToast({ title: '选择是否含税', icon: 'none' })
const onSelectPaymentMethod = () => showPaymentPopup.value = true

const selectPayment = (item: string) => { selectedPayment.value = item }
const onPaymentConfirm = () => {
  showPaymentPopup.value = false
  Taro.showToast({ title: '已选择' + selectedPayment.value, icon: 'none' })
}
const onSelectSupplierCompany = () => Taro.showToast({ title: '选择供方公司', icon: 'none' })
const onSelectAccountType = () => Taro.showToast({ title: '选择账户类型', icon: 'none' })

async function onSubmit() {
  if (!form.templateId) {
    Taro.showToast({ title: '请选择合同模板', icon: 'none' })
    return
  }
  try {
    await createContract({
      customerId: customerId.value || undefined,
      templateId: form.templateId,
      ...formData,
    })
    Taro.showToast({ title: '创建成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  } catch { /*  */ }
}

const onPreview = () => Taro.showToast({ title: '预览合同', icon: 'none' })
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

.ct-btn--submit {
  background: linear-gradient(270deg, rgba(102, 220, 166, 1) 0%, rgba(88, 188, 150, 1) 100%);
  color: #FFFFFF;
}

/* 模板列表弹窗 */
.ct-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;

}

.ct-tmpl-list {
  flex: 1;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.ct-tmpl-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.ct-tmpl-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.ct-tmpl-no {
  font-size: 24rpx;
  color: #9292A5;
}

.q-popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  padding: 24rpx 40rpx;
  flex-shrink: 0;
}

.q-popup-title {
  flex: 1;
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.q-popup-confirm {
  font-size: 34rpx;
  color: #37AE7E;
  flex-shrink: 0;
}

.q-popup-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  font-size: 28rpx;
  color: #9292A5;
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
