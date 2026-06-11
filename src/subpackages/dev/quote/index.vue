<template>
  <view v-if="isEdit"  class="q-page" >
    <view class="q-nav-bar">
      <view class="q-nav-back" @tap="goBack">
        <image class="q-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="q-nav-title">{{ editId ? '编辑报价' : '我要报价' }}</text>
      <view class="q-nav-right" />
    </view>

    <view style="display:flex;flex-direction:column;flex:1">
      <scroll-view class="q-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
        <view class="q-card">
          <view class="q-field" @tap="onSelectTemplate">
            <text class="q-field-label">报价模板</text>
            <view class="q-field-right">
              <text :class="form.templateName ? 'q-field-value' : 'q-field-placeholder'">{{ form.templateName || '请选择模板'
                }}</text>
              <image class="q-arrow" :src="rightArrow" mode="aspectFit" />
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">模板编号</text>
            <text class="q-field-value">{{ form.templateNo || '-' }}</text>
          </view>
        </view>

        <view class="q-card">
          <view class="q-field" @tap="onSelectBuyer">
            <text class="q-field-label">需方信息</text>
            <view class="q-field-right">
              <text :class="form.customerName ? 'q-field-value' : 'q-field-placeholder'">{{ form.customerName || '请选择客户'
                }}</text>
              <image class="q-arrow" :src="rightArrow" mode="aspectFit" />
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">联系人</text>
            <input class="q-input" v-model="form.contactName" placeholder="请输入"
              placeholder-style="color:#BBBEC2;font-size:28rpx" />
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">手机号</text>
            <input class="q-input" v-model="form.phone" placeholder="请输入"
              placeholder-style="color:#BBBEC2;font-size:28rpx"/>
          </view>
        </view>

        <view class="q-card">
          <view class="q-field">
            <text class="q-field-label" style="color:#1A1D24;font-size: 32rpx;">报价单号</text>
            <text class="q-field-placeholder">自动生成，无需输入</text>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">报价名称</text>
            <input class="q-input" v-model="form.name" placeholder="请输入"
              placeholder-style="color:#BBBEC2;font-size:28rpx" />
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">报价时效</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.validity" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <text class="q-suffix">月</text>
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">保修时限</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.warranty" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <text class="q-suffix">年</text>
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">交货期限</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.delivery" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <text class="q-suffix">天</text>
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">签约完成后付款金额</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.payAfterSign" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <text class="q-suffix">元</text>
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">货物打包后付款金额</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.payAfterPack" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <text class="q-suffix">元</text>
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">安装调试后付款金额</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.payAfterInstall" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <text class="q-suffix">元</text>
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">验收完成后付款金额</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.payAfterCheck" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" />
              <text class="q-suffix">元</text>
            </view>
          </view>
        </view>

        <view class="q-card">
          <view class="q-field" @tap="onSelectOpportunity">
            <text class="q-field-label" style="color:#1A1D24;font-size: 32rpx;">关联商机</text>
            <view class="q-field-right">
              <text :class="form.opportunityName ? 'q-field-value' : 'q-field-placeholder'">{{ form.opportunityName ||
                '请选择商机' }}</text>
              <image class="q-arrow" :src="rightArrow" mode="aspectFit" />
            </view>
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
          <scroll-view class="q-table-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
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
              <view v-for="(item, idx) in form.products" :key="idx" class="q-tr">
                <view class="q-td" style="width:72rpx">{{ padIdx(idx + 1) }}</view>
                <view class="q-td" style="width:280rpx">{{ item.productName }}</view>
                <view class="q-td" style="width:318rpx">{{ item.modelName || '-' }}</view>
                <view class="q-td" style="width:160rpx">-</view>
                <view class="q-td" style="width:160rpx">{{ item.quantity }}</view>
                <view class="q-td" style="width:160rpx">-</view>
                <view class="q-td" style="width:160rpx">-</view>
                <view class="q-td" style="width:118rpx">￥{{ item.unitPrice.toLocaleString() }}</view>
                <view class="q-td q-td--bold" style="width:120rpx">￥{{ item.amount.toLocaleString() }}</view>
                <view class="q-td" style="width:82rpx">
                  <image class="q-delete-icon" :src="iconDelete" mode="aspectFit" @tap="removeProduct(idx)" />
                </view>
              </view>
              <view v-if="form.products.length === 0" class="q-tr">
                <view class="q-td" style="width:100%;border:0;justify-content:center;color:#BBBEC2">暂无产品，请点击上方"添加产品"
                </view>
              </view>
            </view>
          </scroll-view>
          <view class="q-divider" />
          <view class="q-total-row">
            <text class="q-total-label">产品总价</text>
            <text class="q-total-value">{{ totalProductAmount }}</text>
            <text class="q-total-unit">元</text>
          </view>
        </view>

        <view class="q-card">
          <view class="q-field">
            <text class="q-field-label">产品总额</text>
            <text class="q-field-value q-field-value--amount">￥{{ totalProductAmountRaw.toLocaleString() }}</text>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">税点</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.taxRate" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" type="digit" />
              <text class="q-suffix">%</text>
            </view>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">税额</text>
            <text class="q-field-value q-field-value--amount">￥{{ taxAmountRaw.toLocaleString() }}</text>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">应收总额</text>
            <text class="q-field-value q-field-value--total">￥{{ totalReceivableRaw.toLocaleString() }}</text>
          </view>
          <view class="q-divider" />
          <view class="q-field">
            <text class="q-field-label">优惠后总价</text>
            <view class="q-field-row">
              <input class="q-input" v-model="form.discountedTotal" placeholder="请输入"
                placeholder-style="color:#BBBEC2;font-size:28rpx" type="digit" />
              <text class="q-suffix">元</text>
            </view>
          </view>
        </view>
      </scroll-view>
    

    </view>
   
      <!-- 模板选择弹窗 -->
    <nut-popup v-model:visible="showTemplatePopup" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2100" portal-disable
      safe-area-inset-bottom>
      <view class="q-popup">
        <view class="q-popup-header">
          <text class="q-popup-cancel" @tap="showTemplatePopup = false">取消</text>
          <text class="q-popup-title">选择报价模板</text>
          <text class="q-popup-confirm" @tap="showTemplatePopup = false">确认</text>
        </view>
        <scroll-view class="q-popup-body" scroll-y :enhanced="true" :show-scrollbar="false">
          <view v-if="templateLoading" class="q-popup-tip">加载中...</view>
          <view v-else-if="templateList.length === 0" class="q-popup-tip">暂无模板</view>
          <template v-else v-for="item in templateList" :key="item.id">
            <view class="q-sel-item" @tap="onTemplateSelect(item)">
              <view class="q-sel-info">
                <text class="q-sel-name">{{ item.name }}</text>
                <text class="q-sel-no">{{ item.templateNo }}</text>
              </view>
              <view class="q-sel-radio" :class="{ 'q-sel-radio--checked': form.templateId === item.id }">
                <view v-if="form.templateId === item.id" class="q-sel-radio-dot" />
              </view>
            </view>
            <view class="q-divider" />
          </template>
        </scroll-view>
      </view>
    </nut-popup>

    <!-- 客户选择弹窗 -->
   
      <nut-popup v-model:visible="showCustomerPopup" position="bottom"
        :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2100" portal-disable
        safe-area-inset-bottom>
        <view class="q-popup">
          <view class="q-popup-header">
            <text class="q-popup-cancel" @tap="showCustomerPopup = false">取消</text>
            <text class="q-popup-title">选择客户</text>
            <text class="q-popup-confirm" @tap="showCustomerPopup = false">确认</text>
          </view>
          <scroll-view class="q-popup-body" scroll-y :enhanced="true" :show-scrollbar="false">
            <view v-if="customerLoading" class="q-popup-tip">加载中...</view>
            <view v-else-if="customerList.length === 0" class="q-popup-tip">暂无客户</view>
            <template v-else v-for="item in customerList" :key="item.id">
              <view class="q-sel-item" @tap="onCustomerSelect(item)">
                <view class="q-sel-info">
                  <text class="q-sel-name">{{ item.name }}</text>
                </view>
                <view class="q-sel-radio" :class="{ 'q-sel-radio--checked': form.customerId === item.id }">
                  <view v-if="form.customerId === item.id" class="q-sel-radio-dot" />
                </view>
              </view>
              <view class="q-divider" />
            </template>
          </scroll-view>
        </view>
      </nut-popup>
    <!-- 商机选择弹窗 -->
    <nut-popup v-model:visible="showOppPopup" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2100" portal-disable
      safe-area-inset-bottom>
      <view class="q-popup">
        <view class="q-popup-header">
          <text class="q-popup-cancel" @tap="showOppPopup = false">取消</text>
          <text class="q-popup-title">选择商机</text>
          <text class="q-popup-confirm" @tap="showOppPopup = false">确认</text>
        </view>
        <scroll-view class="q-popup-body" scroll-y :enhanced="true" :show-scrollbar="false">
          <view v-if="oppLoading" class="q-popup-tip">加载中...</view>
          <view v-else-if="oppList.length === 0" class="q-popup-tip">暂无商机</view>
          <template v-else v-for="item in oppList" :key="item.id">
            <view class="q-sel-item" @tap="onOppSelect(item)">
              <view class="q-sel-info">
                <text class="q-sel-name">{{ item.opportunityName || item.name || item.requiredProductLabel || '-'
                  }}</text>
                <text class="q-sel-no">{{ item.opportunityNo || item.statusLabel || '-' }}</text>
              </view>
              <view class="q-sel-radio" :class="{ 'q-sel-radio--checked': form.opportunityId === item.id }">
                <view v-if="form.opportunityId === item.id" class="q-sel-radio-dot" />
              </view>
            </view>
            <view class="q-divider" />
          </template>
        </scroll-view>
      </view>
    </nut-popup>

    <!-- 产品选择弹窗 -->
    <nut-popup v-model:visible="showProductPopup" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2100" portal-disable
      safe-area-inset-bottom>
      <view class="q-popup">
        <view class="q-popup-header">
          <text class="q-popup-cancel" @tap="showProductPopup = false">取消</text>
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
                <text class="q-prod-price">￥{{ item.price ? item.price.toLocaleString() : '0' }}</text>
              </view>
              <view class="q-prod-stepper">
                <view class="q-prod-step-btn" @tap="onProdQtyChange(item, -1)"><text class="q-prod-step-icon">−</text>
                </view>
                <text class="q-prod-step-value">{{ item._qty || 0 }}</text>
                <view class="q-prod-step-btn q-prod-step-btn--plus" @tap="onProdQtyChange(item, 1)"><text
                    class="q-prod-step-icon">+</text></view>
              </view>
            </view>
            <view class="q-divider" />
          </template>
        </scroll-view>

      </view>
    </nut-popup>

    <view class="q-actions">
      <view class="q-btn q-btn--preview" @tap="onPreview">预览</view>
      <view class="q-btn q-btn--submit" @tap="onSubmit">提交报价单</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { createQuotation, updateQuotation, getQuotationDetail } from '@/api/quote'
import { getCustomerList, getCustomerOpportunities, type CustomerItem } from '@/api/customer'
import { get } from '@/utils/request'
import iconBack from '@/assets/dev/icon-back.png'
import rightArrow from '@/assets/dev/rightArror.png'
import iconPlus from '@/assets/dev/icon-add.png'
import iconDelete from '@/assets/dev/delete.png'

const form = ref({
  name: '',
  contactName: '',
  phone: '',
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
  opportunityId: 0,
  opportunityName: '',
  opportunityNo: '',
  taxRate: '',
  discountedTotal: '',
  templateId: 0,
  templateName: '',
  templateNo: '',
  customerId: 0,
  customerName: '',
  products: [] as Array<{
    productId?: number
    productName: string
    modelName?: string
    quantity: number
    unitPrice: number
    amount: number
  }>,
})

const editId = ref(0)
const isEdit = ref(false)

// 编辑模式下加载详情数据填充表单
async function loadEditData(id: number) {
  try {
    const res = await getQuotationDetail(id) as Record<string, any>
    const buyer = res.buyerSnapshot || {}
    const summary = res.summarySnapshot || {}
    const terms = res.paymentTerms || {}
    form.value = {
      ...form.value,
      name: res.name || '',
      templateId: res.templateId || 0,
      templateName: res.templateName || '',
      templateNo: res.templateNo || '',
      customerId: res.customerId || 0,
      customerName: buyer.customerName || '',
       opportunityId: res?.opportunityId || 0,
      opportunityName: res.opportunityName || '',
      contactName: buyer.contactName  || '',
      phone: buyer?.phone  || '', 
      validity: summary.validity || '',
      warranty: summary.warranty || '',
      delivery: summary.delivery || '',
      taxRate: summary.taxRate || '',
       discountedTotal: summary.discountedTotal || '',
      payAfterSign: terms.payAfterSign || '',
      payAfterPack: terms.payAfterPack || '',
      payAfterInstall: terms.payAfterInstall || '',
      payAfterCheck: terms.payAfterCheck || '',
      products: (res.items || []).map((item: any) => ({
        productId: item.productId,
        productName: item.productName || '',
        modelName: item.modelName || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        amount: item.amount || 0,
      })),
    }
    isEdit.value = true
  } catch { /* 加载失败不显示 */ }
}

onMounted(() => {
  const instance = Taro.getCurrentInstance()
  const params = instance.router?.params || {}
  const id = Number(params.id)
  if (id) {
    editId.value = id
    loadEditData(id)
  } else if (params.isEdit === 'true') {
    isEdit.value = true
  }
})

// 模板选择弹窗
const showTemplatePopup = ref(false)
const templateLoading = ref(false)
const templateList = ref<Array<{ id: number; name: string; templateNo: string }>>([])

async function onSelectTemplate() {
  showTemplatePopup.value = true
  if (templateList.value.length > 0) return
  templateLoading.value = true
  try {
    const res = await get<{ items: Array<{ id: number; name: string; templateNo: string }> }>('/quotation-templates')
    templateList.value = res.items || []
  } catch { /*  */ }
  finally { templateLoading.value = false }
}

function onTemplateSelect(item: { id: number; name: string; templateNo: string }) {
  form.value.templateId = item.id
  form.value.templateName = item.name
  form.value.templateNo = item.templateNo || ''
  showTemplatePopup.value = false
}

// 客户选择弹窗
const showCustomerPopup = ref(false)
const customerLoading = ref(false)
const customerList = ref<CustomerItem[]>([])

async function onSelectBuyer() {
  showCustomerPopup.value = true
  if (customerList.value.length > 0) return
  customerLoading.value = true
  try {
    const res = await getCustomerList({ page: 1, pageSize: 100 })
    customerList.value = res.items || []
  } catch { /*  */ }
  finally { customerLoading.value = false }
}

function onCustomerSelect(item: CustomerItem) {
  form.value.customerId = item.id
  form.value.customerName = item.name
  form.value.contactName = item.contactName || form.value.contactName
  showCustomerPopup.value = false
}

// 商机弹窗
const showOppPopup = ref(false)
const oppLoading = ref(false)
const oppList = ref<any[]>([])

async function onSelectOpportunity() {
  if (!form.value.customerId) {
    Taro.showToast({ title: '请先选择需方客户', icon: 'none' })
    return
  }
  showOppPopup.value = true
  if (oppList.value.length > 0) return
  oppLoading.value = true
  try {
    oppList.value = await getCustomerOpportunities(form.value.customerId) || []
  } catch { /*  */ }
  finally { oppLoading.value = false }
}

function onOppSelect(item: any) {
  form.value.opportunityId = item.id
  form.value.opportunityName = item.opportunityName || item.name || ''
  form.value.opportunityNo = item.opportunityNo || ''
  showOppPopup.value = false
}

// 产品弹窗
const showProductPopup = ref(false)
const prodLoading = ref(false)
const prodKeyword = ref('')
const prodType = ref(0)
const allProducts = ref<Array<{ id: number; name: string; price: number; _qty: number }>>([])

const filteredProducts = computed(() => {
  let list = allProducts.value
  if (prodType.value) {
    // 按类型筛选（如果后端支持分类字段）
  }
  if (prodKeyword.value) {
    list = list.filter(p => p.name.includes(prodKeyword.value))
  }
  return list
})

async function onAddProduct() {
  showProductPopup.value = true
  if (allProducts.value.length > 0) return
  prodLoading.value = true
  // 获取所有产品
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
    // 从列表中移除
    const idx = form.value.products.findIndex(p => p.productId === item.id)
    if (idx >= 0) form.value.products.splice(idx, 1)
  } else {
    const price = item.price || 0
    const existing = form.value.products.find(p => p.productId === item.id)
    if (existing) {
      existing.quantity = qty
      existing.unitPrice = price
      existing.amount = qty * price
    } else {
      form.value.products.push({
        productId: item.id,
        productName: item.name,
        quantity: qty,
        unitPrice: price,
        amount: qty * price,
      })
    }
  }
}

function removeProduct(idx: number) {
  form.value.products.splice(idx, 1)
}

function padIdx(n: number): string {
  return n < 10 ? '0' + n : String(n)
}

const totalProductAmount = computed(() => {
  const sum = form.value.products.reduce((s, p) => s + (p.amount || 0), 0)
  return sum.toLocaleString()
})

const totalProductAmountRaw = computed(() => form.value.products.reduce((s, p) => s + (p.amount || 0), 0))

const taxAmountRaw = computed(() => {
  const total = totalProductAmountRaw.value
  const rate = Number(form.value.taxRate) || 0
  return Math.round(total * rate / 100)
})

const totalReceivableRaw = computed(() => totalProductAmountRaw.value + taxAmountRaw.value)

const discountedTotalRaw = computed(() => {
  const total = totalProductAmountRaw.value
  // 优惠后总价 = 产品总额 + 税额（简化计算，后续可加折扣字段）
  return total + taxAmountRaw.value
})

const goBack = () => Taro.navigateBack()

async function onSubmit() {
  if (!form.value.name) { Taro.showToast({ title: '请输入报价名称', icon: 'none' }); return }

  try {
    const data = {
      name: form.value.name,
      templateId: form.value.templateId || undefined,
      customerId: form.value.customerId || undefined,
      opportunityId: form.value.opportunityId || undefined,
      items: form.value.products.map(p => ({
        productId: p.productId,
        productName: p.productName,
        modelName: p.modelName,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        amount: p.amount,
      })),
      summarySnapshot: {
        validity: form.value.validity,
        warranty: form.value.warranty,
        delivery: form.value.delivery,
        taxRate: form.value.taxRate,
        taxAmount: taxAmountRaw.value,
        totalProductAmount: totalProductAmountRaw.value,
        totalReceivable: totalReceivableRaw.value,
        discountedTotal: discountedTotalRaw.value,
      },
      paymentTerms: {
        payAfterSign: form.value.payAfterSign,
        payAfterPack: form.value.payAfterPack,
        payAfterInstall: form.value.payAfterInstall,
        payAfterCheck: form.value.payAfterCheck,
      },
      buyerSnapshot: {
        contactName: form.value.contactName,
        phone: form.value.phone,
      },
    }
    if (editId.value) {
      await updateQuotation(editId.value, data)
    } else {
      await createQuotation(data)
    }
    Taro.showToast({ title: editId.value ? '保存成功' : '提交成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack({ delta: editId.value ? 2 : 1 }), 1500)
  } catch {
    // 错误已在 request 层处理
  }
}
const onPreview = () => Taro.showToast({ title: '预览', icon: 'none' })
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
  background: linear-gradient(270deg, rgba(102, 220, 166, 1) 0%, rgba(88, 188, 150, 1) 100%);
  color: #FFFFFF;
}

/* 弹窗通用 */
.q-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
}

.q-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
  flex-shrink: 0;
}

.q-popup-cancel {
  font-size: 28rpx;
  color: #9292A5;
}

.q-popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.q-popup-confirm {
  font-size: 28rpx;
  color: #37AE7E;
}

.q-popup-body {
  flex: 1;
  padding: 0 40rpx;
  box-sizing: border-box
}

.q-popup-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  font-size: 28rpx;
  color: #9292A5;
}

/* 选择项 */
.q-sel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}

.q-sel-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.q-sel-name {
  font-size: 30rpx;
  color: #1A1D24;
}

.q-sel-no {
  font-size: 24rpx;
  color: #9292A5;
}

.q-sel-radio {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.q-sel-radio--checked {
  border-color: #37AE7E;
}

.q-sel-radio-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #37AE7E;
}

/* 产品弹窗 */
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

.q-prod-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx 24rpx;
}

.q-prod-type-text {
  font-size: 28rpx;
  color: #BBBEC2;
}

.q-prod-type-text--set {
  color: #1A1D24;
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

.q-input--total {
  font-size: 36rpx;
  font-weight: 700;
  color: #EB3F29;
}
</style>
