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

      <!-- 产品明细卡片 -->
      <view v-if="hasItemFields" class="ct-card">
        <view class="q-section-head">
          <text class="q-section-title">产品明细</text>
          <view class="q-add-row" @tap="onAddProduct">
            <image class="q-add-icon" :src="iconPlus" mode="aspectFit" />
            <text class="q-add-text">添加产品</text>
          </view>
        </view>
        <view class="ct-divider" />
        <scroll-view class="q-table-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
          <view class="q-table">
            <view class="q-tr q-tr--head">
              <view class="q-th" style="width:72rpx">序号</view>
              <view class="q-th" style="width:280rpx">产品名称</view>
              <view class="q-th" style="width:200rpx">品牌</view>
              <view class="q-th" style="width:200rpx">型号</view>
              <view class="q-th" style="width:160rpx">单位</view>
              <view class="q-th" style="width:120rpx">数量</view>
              <view class="q-th" style="width:140rpx">单价</view>
              <view class="q-th" style="width:140rpx">小计</view>
              <view class="q-th" style="width:82rpx">操作</view>
            </view>
            <view v-for="(item, idx) in form.products" :key="idx" class="q-tr">
              <view class="q-td" style="width:72rpx">{{ padIdx(idx + 1) }}</view>
              <view class="q-td" style="width:280rpx">{{ item.productName }}</view>
              <view class="q-td" style="width:200rpx">{{ item.brandName || '-' }}</view>
              <view class="q-td" style="width:200rpx">{{ item.model || '-' }}</view>
              <view class="q-td" style="width:160rpx">{{ item.unit || '-' }}</view>
              <view class="q-td" style="width:120rpx">{{ item.quantity }}</view>
              <view class="q-td" style="width:140rpx">￥{{ item.unitPrice.toLocaleString() }}</view>
              <view class="q-td q-td--bold" style="width:140rpx">￥{{ item.amount.toLocaleString() }}</view>
              <view class="q-td" style="width:82rpx">
                <image class="q-delete-icon" :src="iconDelete" mode="aspectFit" @tap="removeProduct(idx)" />
              </view>
            </view>
            <view v-if="form.products.length === 0" class="q-tr">
              <view class="q-td" style="width:100%;border:0;justify-content:center;color:#BBBEC2">暂无产品，请点击上方"添加产品"</view>
            </view>
          </view>
        </scroll-view>
        <view class="ct-divider" />
        <view class="q-total-row">
          <text class="q-total-label">产品总价</text>
          <text class="q-total-value">￥{{ totalProductAmount.toLocaleString() }}</text>
          <text class="q-total-unit">元</text>
        </view>
      </view>

      <!-- 付款方式卡片 -->
      <view v-if="hasPaymentFields" class="ct-card">
        <text class="ct-label ct-label--title">付款方式</text>
        <view class="ct-divider" />

        <!-- 付款方式（文本输入） -->
        <view class="ct-field">
          <text class="ct-label">付款方式</text>
          <input class="ct-input" v-model="formData['payment.method']" placeholder="请输入"
            placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="ct-divider" />

        <!-- 支付方式（下拉选择：全款支付 / 分期支付） -->
        <view class="ct-field" @tap="showPayTypePopup = true">
          <text class="ct-label">支付方式</text>
          <view class="ct-field-right">
            <text :class="paymentType === 'installment' ? 'ct-value' : 'ct-placeholder'">
              {{ paymentType === 'installment' ? '分期支付' : '全款支付' }}
            </text>
            <image class="ct-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ct-divider" />

        <!-- 分付周期（仅分期支付时显示） -->
        <view v-if="paymentType === 'installment'" class="ct-field">
          <text class="ct-label">分付周期</text>
          <input class="ct-input" type="number" v-model.number="installmentCount" placeholder="请输入"
            placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>

        <!-- 分期阶段卡片（仅分期支付时显示） -->
        <template v-if="paymentType === 'installment'">
          <view v-for="phase in paymentPhases" :key="phase.key" class="ct-pay-phase">
            <text class="ct-pay-phase-label">{{ phase.label }}</text>
            <view class="ct-pay-phase-body">
              <view v-for="f in phase.fields" :key="f.key" class="ct-field">
                <text class="ct-label">{{ phaseFieldShortLabel(f) }}</text>
                <view class="ct-field-right">
                  <input class="ct-input" v-model="formData[f.key]" :placeholder="phaseFieldPlaceholder(f)"
                    placeholder-style="color:#BBBEC2;font-size:30rpx" />
                  <text v-if="phaseFieldUnit(f)" class="ct-suffix">{{ phaseFieldUnit(f) }}</text>
                </view>
              </view>
            </view>
          </view>
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

    <!-- 产品选择弹窗 -->
    <nut-popup v-model:visible="showProductPopup" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2100" portal-disable
      safe-area-inset-bottom>
      <view class="q-popup">
        <view class="q-popup-header">
          <text class="ct-pay-cancel" @tap="showProductPopup = false">取消</text>
          <text class="q-popup-title">添加产品</text>
          <text class="q-popup-confirm" @tap="showProductPopup = false">确认</text>
        </view>
        <view class="q-prod-search">
          <input class="q-prod-search-input" v-model="prodKeyword" placeholder="输入产品名称"
            placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <scroll-view class="q-popup-body" scroll-y="true" :enhanced="true" :show-scrollbar="false"
          style="box-sizing: border-box;">
          <view v-if="prodLoading" class="q-popup-tip">加载中...</view>
          <view v-else-if="filteredProducts.length === 0" class="q-popup-tip">暂无产品</view>
          <template v-else v-for="item in filteredProducts" :key="item.id">
            <view class="q-prod-item">
              <view class="q-prod-info">
                <text class="q-prod-name">{{ item.name }}</text>
                <text class="q-prod-price">￥{{ (item.priceAmount || item.price || 0).toLocaleString() }}</text>
              </view>
              <view class="q-prod-stepper">
                <view class="q-prod-step-btn" @tap="onProdQtyChange(item, -1)"><text class="q-prod-step-icon">−</text></view>
                <text class="q-prod-step-value">{{ item._qty || 0 }}</text>
                <view class="q-prod-step-btn q-prod-step-btn--plus" @tap="onProdQtyChange(item, 1)"><text class="q-prod-step-icon">+</text></view>
              </view>
            </view>
            <view class="ct-divider" />
          </template>
        </scroll-view>
      </view>
    </nut-popup>

    <!-- 支付方式选择弹窗 -->
    <nut-popup v-model:visible="showPayTypePopup" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100" portal-disable safe-area-inset-bottom>
      <view class="q-popup">
        <view class="q-popup-header">
          <text class="ct-pay-cancel" @tap="showPayTypePopup = false">取消</text>
          <text class="q-popup-title">选择支付方式</text>
          <text class="q-popup-confirm" @tap="showPayTypePopup = false">确定</text>
        </view>
        <view class="ct-pay-body">
          <view v-for="opt in payTypeOptions" :key="opt.value" class="ct-pay-row" @tap="onSelectPayType(opt.value)">
            <text class="ct-pay-row-text">{{ opt.label }}</text>
            <view class="ct-pay-checkbox" :class="{ 'ct-pay-checkbox--checked': paymentType === opt.value }">
              <view v-if="paymentType === opt.value" class="ct-pay-checkbox-dot" />
            </view>
          </view>
        </view>
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
import iconPlus from '@/assets/dev/icon-add.png'
import iconDelete from '@/assets/dev/delete.png'
import { get } from '@/utils/request'

// 固定字段
const form = reactive({
  templateId: 0,
  templateName: '',
  templateNo: '',
  products: [] as Array<{
    productId?: number
    productName: string
    brandName?: string
    model?: string
    unit?: string
    quantity: number
    unitPrice: number   // 前端展示用「元」
    amount: number      // 前端展示用「元」
    remark?: string
  }>,
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
    // 从 items 反填 form.products（后端返回分，前端展示元：除以100）
    const itemArr = res.items || []
    if (itemArr.length > 0) {
      form.products = itemArr.map((it: any) => ({
        productId: it.productId,
        productName: it.productName || '',
        brandName: it.brandName || '',
        model: it.model || '',
        unit: it.unit || '',
        quantity: it.quantity || 0,
        unitPrice: it.unitPrice ? it.unitPrice / 100 : 0,   // 分→元
        amount: it.amount ? it.amount / 100 : 0,            // 分→元
        remark: it.remark || '',
      }))
    }
    for (const f of tokenSchema.value) {
      if (f.category === 'item') continue
      if (f.category === 'payment') continue
      formData[f.key] = all[f.key] ?? ''
    }
    // 编辑模式：回显 payment 字段
    for (const f of tokenSchema.value) {
      if (f.category !== 'payment') continue
      formData[f.key] = all[f.key] ?? f.defaultValue ?? ''
    }
    // 如果已有分期字段数据，则恢复分期支付状态
    const hasInstallmentData = Object.keys(formData).some(k => k.startsWith('payment.after') && formData[k])
    if (hasInstallmentData) {
      paymentType.value = 'installment'
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

// 产品弹窗
const showProductPopup = ref(false)
const prodLoading = ref(false)
const prodKeyword = ref('')
const allProducts = ref<any[]>([])

const filteredProducts = computed(() => {
  let list = allProducts.value
  if (prodKeyword.value) {
    list = list.filter(p => (p.name || '').includes(prodKeyword.value))
  }
  return list
})

// 按 category 分组（排除 item 类——产品用表格卡片展示）
const fieldGroups = computed(() => {
  const groups: Array<{ category: string; fields: ContractTokenField[] }> = []
  const seen = new Set<string>()
  for (const f of tokenSchema.value) {
    if (f.category === 'item') continue
    if (f.category === 'payment') continue
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

// 是否有 item 产品字段
const hasItemFields = computed(() => tokenSchema.value.some(f => f.category === 'item'))

// ========== 付款方式 ==========
const hasPaymentFields = computed(() => tokenSchema.value.some(f => f.category === 'payment'))

// 支付方式：全款支付 full / 分期支付 installment
const paymentType = ref<'full' | 'installment'>('full')
// 分付周期（仅分期支付时有效）
const installmentCount = ref(4)

const showPayTypePopup = ref(false)
const payTypeOptions = [
  { label: '全款支付', value: 'full' as const },
  { label: '分期支付', value: 'installment' as const },
]

function onSelectPayType(val: 'full' | 'installment') {
  paymentType.value = val
  if (val === 'full') {
    // 切换到全款支付时，清空分期字段数据
    for (const k of Object.keys(formData)) {
      if (k.startsWith('payment.after')) delete formData[k]
    }
  }
}

const paymentPhases = computed(() => {
  // 全款支付不显示分期
  if (paymentType.value !== 'installment') return []

  const phaseOrder = ['afterSigning', 'afterPacking', 'afterInstallation', 'afterAcceptance']
  const phaseLabels = ['一期', '二期', '三期', '四期']
  const paymentFields = tokenSchema.value.filter(f => f.category === 'payment' && f.key !== 'payment.method')

  const phases: Array<{ key: string; label: string; fields: ContractTokenField[] }> = []
  for (let i = 0; i < Math.min(installmentCount.value, phaseOrder.length); i++) {
    const phaseKey = phaseOrder[i]
    const phaseFields = paymentFields.filter(f => f.key.startsWith(`payment.${phaseKey}.`))
    if (phaseFields.length > 0) {
      phases.push({ key: phaseKey, label: phaseLabels[i], fields: phaseFields })
    }
  }
  return phases
})

function phaseFieldShortLabel(f: ContractTokenField): string {
  if (f.key.includes('.ratio')) return '支付比例'
  if (f.key.includes('.amountLower')) return '支付金额'
  if (f.key.includes('.amountUpper')) return '支付金额(大写)'
  if (f.key.includes('.receivableNode')) return '应收款节点'
  return f.label
}

function phaseFieldUnit(f: ContractTokenField): string {
  if (f.key.includes('.ratio')) return '%'
  if (f.key.includes('.amountLower')) return '元'
  return ''
}

function phaseFieldPlaceholder(f: ContractTokenField): string {
  if (f.key.includes('.receivableNode')) return '请选择'
  return '请输入'
}

// 产品表的总价
const totalProductAmount = computed(() => {
  return form.products.reduce((s, p) => s + (p.amount || 0), 0)
})

// ========== 产品明细 ==========
function padIdx(n: number): string {
  return n < 10 ? '0' + n : String(n)
}

async function onAddProduct() {
  showProductPopup.value = true
  if (allProducts.value.length > 0) return
  prodLoading.value = true
  try {
    const allRes = await get<{ items: any[] }>('/product/products', { page: 1, pageSize: 200, status: 'published' })
    allProducts.value = (allRes.items || []).map((p: any) => ({ ...p, _qty: 0 }))
  } catch {
    allProducts.value = []
  }
  finally { prodLoading.value = false }
}

function onProdQtyChange(item: any, delta: number) {
  const qty = (item._qty || 0) + delta
  if (qty < 0) return
  item._qty = qty
  if (qty === 0) {
    const idx = form.products.findIndex(p => p.productId === item.id)
    if (idx >= 0) form.products.splice(idx, 1)
  } else {
    const price = item.priceAmount || item.price || 0
    const existing = form.products.find(p => p.productId === item.id)
    if (existing) {
      existing.quantity = qty
      existing.unitPrice = price
      existing.amount = qty * price
    } else {
      form.products.push({
        productId: item.id,
        productName: item.name,
        brandName: item.brand || item.brandName || '',
        model: item.model || item.modelName || '',
        unit: item.unit || '',
        quantity: qty,
        unitPrice: price,
        amount: qty * price,
        remark: '',
      })
    }
  }
}

function removeProduct(idx: number) {
  form.products.splice(idx, 1)
}

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
  form.products = []
  paymentType.value = 'full'
  installmentCount.value = 4
  Object.keys(formData).forEach(k => delete formData[k])
  try {
    const detail = await getContractTemplateDetail(selectedTemplateId.value)
    form.templateId = detail.id
    form.templateName = detail.name
    form.templateNo = detail.templateNo
    tokenSchema.value = detail.tokenSchema || []
    templateContentHtml.value = detail.contentHtml || ''
    // 初始化 formData 默认值（跳过 item/payment 类字段——由专属卡片管理）
    for (const f of detail.tokenSchema || []) {
      if (f.category === 'item') continue
      if (f.category === 'payment') continue
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
    // 按 category 分组到对应 snapshot
    // 注意：token key 带前缀（如 buyer.party、seller.fullName、item.productName），
    // 接口要求 snapshot 对象的 key 不带前缀，item 类由 form.products 提供
    const buyerSnapshot: Record<string, string> = {}
    const sellerSnapshot: Record<string, string> = {}
    const summarySnapshot: Record<string, string> = {}

    for (const f of tokenSchema.value) {
      const val = formData[f.key] || ''
      if (f.key.startsWith('buyer.')) {
        buyerSnapshot[f.key.replace('buyer.', '')] = val
      } else if (f.key.startsWith('seller.')) {
        sellerSnapshot[f.key.replace('seller.', '')] = val
      } else if (f.key.startsWith('item.')) {
        // item 字段由 form.products 提供，不在 formData 中
        continue
      } else {
        summarySnapshot[f.key] = val
      }
    }

    // 从 form.products 构建 items 数组（前端展示元，后端存储分：乘以100）
    const items: Record<string, any>[] = form.products.map(p => ({
      productId: p.productId,
      productName: p.productName,
      brandName: p.brandName || '',
      model: p.model || '',
      quantity: p.quantity,
      unitPrice: Math.round((p.unitPrice || 0) * 100),   // 元→分
      amount: Math.round((p.amount || 0) * 100),          // 元→分
      unit: p.unit || '',
      remark: p.remark || '',
    }))

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

/* ========== 产品明细表格 ========== */
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
  min-width: 1394rpx;
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

.q-td:last-child,
.q-th:last-child {
  border-right: none;
}

.q-tr:last-child .q-th,
.q-tr:last-child .q-td {
  border-bottom: none;
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

/* ========== 产品选择弹窗 ========== */
.q-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
}

.q-popup-body {
  flex: 1;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.q-prod-search {
  padding: 0 40rpx 20rpx;
}

.q-prod-search-input {
  width: 100%;
  height: 72rpx;
  background: #F6F7FB;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #1A1D24;
  box-sizing: border-box;
}

.q-prod-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
}

.q-prod-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.q-prod-name {
  font-size: 30rpx;
  color: #1A1D24;
}

.q-prod-price {
  font-size: 26rpx;
  color: #EB3F29;
}

.q-prod-stepper {
  display: flex;
  align-items: center;
}

.q-prod-step-btn {
  width: 48rpx;
  height: 48rpx;
  border: 1rpx solid #D9D9D9;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
}

.q-prod-step-btn--plus {
  background: #37AE7E;
  border-color: #37AE7E;
}

.q-prod-step-icon {
  font-size: 28rpx;
  color: #1A1D24;
}

.q-prod-step-btn--plus .q-prod-step-icon {
  color: #FFFFFF;
}

.q-prod-step-value {
  width: 64rpx;
  text-align: center;
  font-size: 28rpx;
  color: #1A1D24;
}

/* ========== 付款阶段卡片 ========== */
.ct-pay-phase {
  display: flex;
  gap: 14px;
  background: #FBFBFB;
  border-radius: 8rpx;
  padding: 14px;
}

.ct-pay-phase-label {
  font-size: 30rpx;
  font-weight: 500;
  color: #23252C;
  width: 128rpx;
  flex-shrink: 0;
}

.ct-pay-phase-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
</style>
