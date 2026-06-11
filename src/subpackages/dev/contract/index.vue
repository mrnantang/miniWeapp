<template>
  <view class="ct-page">
    <NavBar :title="editId ? '编辑合同' : '新建合同'" />
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
        <text class="ct-label ct-label--title">{{ group.category  === 'buyer' ? '需方信息' : group.category === 'seller' ? '供方信息' : '合同信息' }}</text>
        <view class="ct-divider" />
        <template v-for="(field, fi) in group.fields" :key="field.key">
          <view class="ct-field">
            <text class="ct-label">{{ field.label }}</text>
            <!-- 日期字段：用日期选择器 -->
            <template v-if="isDateField(field.key)">
              <view class="ct-field-right" @tap="onOpenDatePicker(field.key)">
                <text :class="formData[field.key] ? 'ct-value' : 'ct-placeholder'">{{ formData[field.key] || '请选择日期' }}</text>
                <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
              </view>
            </template>
            <!-- 普通字段：用 input -->
            <input v-else class="ct-input" v-model="formData[field.key]" :placeholder="'请输入'"
              placeholder-style="color:#BBBEC2;font-size:30rpx" />
          </view>
          <view v-if="fi < group.fields.length - 1" class="ct-divider" />
        </template>
      </view>
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
                <text class="ct-tmpl-no">模板编号：{{ item.templateNo }}</text>
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

    <!-- 日期选择弹窗 -->
    <nut-popup v-model:visible="showDatePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100">
      <view class="ct-date-popup">
        <view class="q-popup-header">
          <text class="ct-pay-cancel" @tap="showDatePopup = false">取消</text>
          <text class="q-popup-title">选择日期</text>
          <text class="q-popup-confirm" @tap="onDateConfirm">确定</text>
        </view>
        <picker-view class="ct-date-picker-body" :value="pickerValue" @change="onPickerChange">
          <picker-view-column>
            <view v-for="y in years" :key="y" class="ct-picker-item">{{ y }}年</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="m in months" :key="m" class="ct-picker-item">{{ m }}月</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="d in days" :key="d" class="ct-picker-item">{{ d }}日</view>
          </picker-view-column>
        </picker-view>
      </view>
    </nut-popup>

    <view class="ct-actions">
      <view class="ct-btn ct-btn--preview" @tap="onPreview">预览合同</view>
      <view class="ct-btn ct-btn--submit" @tap="onSubmit">{{ editId ? '保存合同' : '生成合同' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getToken } from '@/utils/storage'

declare const TARO_APP_API_BASE: string
import { getContractTemplates, getContractTemplateDetail, createContract, updateContract, getContractDetail, type ContractTemplateItem, type ContractTokenField } from '@/api/contract'
import rightArrow from '@/assets/dev/rightArror.png'

// 固定字段
const form = reactive({
  templateId: 0,
  templateName: '',
  templateNo: '',
})

const customerId = ref(0)
const editId = ref(0)

onMounted(async () => {
  const instance = Taro.getCurrentInstance()
  customerId.value = Number(instance.router?.params?.customerId) || 0
  const id = Number(instance.router?.params?.id)
  if (!id) return
  editId.value = id
  try {
    const res = await getContractDetail(id) as Record<string, any>
    form.templateId = res.templateId || 0
    form.templateName = res.templateName || ''
    form.templateNo = res.templateNo || ''
    // 加载模板 tokenSchema
    if (res.templateId) {
      const detail = await getContractTemplateDetail(res.templateId)
      tokenSchema.value = detail.tokenSchema || []
    }
    // 从 buyerSnapshot / sellerSnapshot / summarySnapshot 合并填充 formData
    // 接口返回的 snapshot key 不带前缀，tokenSchema 的 key 带前缀（buyer./seller./item.），需要补回
    const buyerRaw = res.buyerSnapshot || {}
    const sellerRaw = res.sellerSnapshot || {}
    const summaryRaw = res.summarySnapshot || {}
    const all: Record<string, string> = {}
    for (const k of Object.keys(buyerRaw)) { all['buyer.' + k] = buyerRaw[k] }
    for (const k of Object.keys(sellerRaw)) { all['seller.' + k] = sellerRaw[k] }
    for (const k of Object.keys(summaryRaw)) { all[k] = summaryRaw[k] }
    // 从 items 反填 item.* 字段
    const itemArr = res.items || []
    if (itemArr.length > 0) {
      const it = itemArr[0]
      all['item.productName'] = it.productName || ''
      all['item.brandName'] = it.brandName || ''
      all['item.model'] = it.model || ''
      all['item.quantity'] = String(it.quantity || '')
      // 后端返回分，表单输入期望元：除以100
      all['item.unitPrice'] = it.unitPrice ? String(it.unitPrice / 100) : ''
      all['item.amount'] = it.amount ? String(it.amount / 100) : ''
      all['item.unit'] = it.unit || ''
      all['item.remark'] = it.remark || ''
    }
    for (const f of tokenSchema.value) {
      formData[f.key] = all[f.key] ?? ''
    }
  } catch { /*  */ }
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
const templateContentHtml = ref('')

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
  // 先清空旧数据再加载新模板
  tokenSchema.value = []
  Object.keys(formData).forEach(k => delete formData[k])
  try {
    const detail = await getContractTemplateDetail(selectedTemplateId.value)
    form.templateId = detail.id
    form.templateName = detail.name
    form.templateNo = detail.templateNo
    tokenSchema.value = detail.tokenSchema || []
    templateContentHtml.value = detail.contentHtml || ''
    // 初始化 formData 默认值
    for (const f of detail.tokenSchema || []) {
      formData[f.key] = f.defaultValue || ''
    }
  } catch { /*  */ }
}

async function onSubmit() {
  if (!form.templateId) {
    Taro.showToast({ title: '请选择合同模板', icon: 'none' })
    return
  }
  try {
    // 按 category 分组到对应 snapshot，同时提取 items
    // 注意：token key 带前缀（如 buyer.party、seller.fullName、item.productName），
    // 接口要求 snapshot 对象的 key 不带前缀
    const buyerSnapshot: Record<string, string> = {}
    const sellerSnapshot: Record<string, string> = {}
    const summarySnapshot: Record<string, string> = {}
    const itemProps: Record<string, string> = {}

    for (const f of tokenSchema.value) {
      const val = formData[f.key] || ''
      if (f.key.startsWith('buyer.')) {
        buyerSnapshot[f.key.replace('buyer.', '')] = val
      } else if (f.key.startsWith('seller.')) {
        sellerSnapshot[f.key.replace('seller.', '')] = val
      } else if (f.key.startsWith('item.')) {
        itemProps[f.key.replace('item.', '')] = val
      } else {
        summarySnapshot[f.key] = val
      }
    }

    // 构建 items 数组（amount=0 由后端自动计算）
    const items: Record<string, any>[] = []
    if (Object.keys(itemProps).length > 0) {
      items.push({
        productName: itemProps.productName || '',
        brandName: itemProps.brandName || '',
        model: itemProps.model || '',
        quantity: Number(itemProps.quantity) || 0,
        unitPrice: Math.round(Number(itemProps.unitPrice) * 100) || 0,
        amount: 0,
        unit: itemProps.unit || '',
        remark: itemProps.remark || '',
      })
    }

    const data: Record<string, any> = {
      customerId: customerId.value || undefined,
      templateId: form.templateId,
      buyerSnapshot,
      sellerSnapshot,
      summarySnapshot
    }
    if (items.length > 0) data.items = items
    if (editId.value) {
      await updateContract(editId.value, data)
    } else {
      await createContract(data)
    }
    Taro.showToast({ title: editId.value ? '保存成功' : '创建成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack({ delta: editId.value ? 2 : 1 }), 1500)
  } catch { /*  */ }
}

const onPreview = () => {
  // 编辑模式下调用合同预览接口下载 PDF
  if (editId.value) {
    const pdfUrl = `${TARO_APP_API_BASE}/sales/contracts/${editId.value}/preview`
    Taro.downloadFile({
      url: pdfUrl,
      header: { Authorization: `Bearer ${getToken()}` },
      success(res) {
        if (res.statusCode === 200) {
          Taro.openDocument({ filePath: res.tempFilePath, fileType: 'pdf', showMenu: true })
        } else {
          Taro.showToast({ title: '预览失败', icon: 'none' })
        }
      },
      fail: () => Taro.showToast({ title: '下载失败', icon: 'none' }),
    })
    return
  }
  Taro.showToast({ title: '请先保存合同再预览', icon: 'none' })
}

// ========== 日期选择器 ==========
const showDatePopup = ref(false)
/** 当前正在编辑的日期字段 key */
let currentDateKey = ''

const now = new Date()
const currentYear = now.getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate()
const days = computed(() => {
  const y = years[pickerValue.value[0]]
  const m = months[pickerValue.value[1]]
  return Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1)
})
const pickerValue = ref([2, now.getMonth(), now.getDate() - 1])

/** 判断字段 key 是否为日期类型（包含 Date 或 signingDate 等） */
function isDateField(key: string): boolean {
  return key.includes('Date') || key.includes('date') || key.includes('time') || key.includes('Time')
}

function onOpenDatePicker(key: string) {
  currentDateKey = key
  // 如果已有值，尝试解析并定位 picker
  const existing = formData[key]
  if (existing && /^\d{4}-\d{2}-\d{2}$/.test(existing)) {
    const parts = existing.split('-')
    const y = Number(parts[0])
    const m = Number(parts[1]) - 1
    const d = Number(parts[2]) - 1
    const yi = years.indexOf(y)
    const mi = m // 0-based
    const di = d // 0-based
    pickerValue.value = [yi >= 0 ? yi : 2, mi >= 0 && mi < 12 ? mi : 0, di >= 0 ? di : 0]
  }
  showDatePopup.value = true
}

function onDateConfirm() {
  const y = years[pickerValue.value[0]]
  const m = months[pickerValue.value[1]]
  const d = days.value[pickerValue.value[2]]
  const dateStr = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
  formData[currentDateKey] = dateStr
  showDatePopup.value = false
}

function onPickerChange(e: any) {
  pickerValue.value = e.detail.value
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
  margin-bottom: 32rpx;
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

/* 日期选择弹窗 */
.ct-date-popup {
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
}

.ct-date-picker-body {
  height: 480rpx;
}

.ct-picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #1A1D24;
}
</style>
