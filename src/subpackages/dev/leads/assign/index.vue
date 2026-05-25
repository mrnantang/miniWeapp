<template>
  <view class="ac-page">
    <view class="ac-nav-bar">
      <view class="ac-nav-back" @tap="goBack">
        <image class="ac-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="ac-nav-title">创建客户与商机</text>
      <view class="ac-nav-right" />
    </view>

    <scroll-view class="ac-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="ac-card">
        <text class="ac-card-title">基础信息</text>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">客户名称</text>
          <text class="ac-required">*</text>
          <input class="ac-input" v-model="form.customerName" placeholder="请输入"
            placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-dept-row" @tap="showDuplicatePopup = true">
          <view class="ac-dept-input">
            <text class="ac-dept-placeholder">客户查重</text>
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('industry')">
          <text class="ac-label">客户行业</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.industry }">{{ form.industry || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('product')">
          <text class="ac-label">客户工件</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.product }">{{ form.product || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="showCategoryPopup = true">
          <text class="ac-label">客户类别</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.category }">{{ form.category || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="showProjectTypePopup = true">
          <text class="ac-label">项目类型</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.projectType }">{{ form.projectType || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="showLevelPopup = true">
          <text class="ac-label">客户等级</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.level }">{{ form.level || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('otherBrand')">
          <text class="ac-label">是否使用其他品牌喷粉枪</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.otherBrand }">{{ form.otherBrand || '是' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">品牌</text>
          <input class="ac-input" v-model="form.brand" placeholder="请输入"
            placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">数量</text>
          <input class="ac-input" v-model="form.quantity" placeholder="请输入"
            placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="showTypePopup = true">
          <text class="ac-label">类型</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.type }">{{ form.type || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
      </view>

      <view class="ac-card">
        <view class="ac-contact-header">
          <text class="ac-card-title">联系方式</text>
          <view class="ac-radio-group">
            <view class="ac-radio" @tap="form.customerType = 'domestic'">
              <view class="ac-radio-circle" :class="{ 'ac-radio-circle--active': form.customerType === 'domestic' }">
                <view v-if="form.customerType === 'domestic'" class="ac-radio-dot" />
              </view>
              <text class="ac-radio-label">国内客户</text>
            </view>
            <view class="ac-radio" @tap="form.customerType = 'overseas'">
              <view class="ac-radio-circle" :class="{ 'ac-radio-circle--active': form.customerType === 'overseas' }">
                <view v-if="form.customerType === 'overseas'" class="ac-radio-dot" />
              </view>
              <text class="ac-radio-label">海外客户</text>
            </view>
          </view>
        </view>
        <template v-for="(contact, ci) in form.contacts" :key="contact.id">
          <view v-if="ci > 0" class="ac-divider" />
          <view class="ac-contact-title-row">
            <text class="ac-contact-group-title">联系人{{ ci + 1 }}</text>
            <image v-if="form.contacts.length > 1" class="ac-delete-icon" :src="iconDelete" mode="aspectFit" @tap="removeContact(ci)" />
          </view>
          <view class="ac-field">
            <text class="ac-label">联系人</text>
            <input class="ac-input" v-model="contact.name" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
          </view>
          <view class="ac-field">
            <text class="ac-label">联系人职位</text>
            <input class="ac-input" v-model="contact.position" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
          </view>
          <view class="ac-phone-wrapper">
            <view v-for="(phone, pi) in contact.phones" :key="pi">
              <view v-if="pi > 0" class="ac-divider" />
              <view class="ac-field">
                <text class="ac-label">联系电话{{ pi + 1 }}</text>
                <input class="ac-input" v-model="contact.phones[pi]" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" type="number" />
                <image v-if="contact.phones.length > 2" class="ac-delete-icon" :src="iconDelete" mode="aspectFit" @tap="removePhone(ci, pi)" />
              </view>
            </view>
            <view class="ac-add-row" @tap="addPhone(ci)">
              <image class="ac-add-icon" :src="iconPlus" mode="aspectFit" />
              <text class="ac-add-text">添加联系电话</text>
            </view>
          </view>
          <view class="ac-field">
            <text class="ac-label">微信号</text>
            <input class="ac-input" v-model="contact.wechat" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
          </view>
          <view class="ac-field">
            <text class="ac-label">WhatsApp</text>
            <input class="ac-input" v-model="contact.whatsapp" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
          </view>
          <view class="ac-field">
            <text class="ac-label">邮箱</text>
            <input class="ac-input" v-model="contact.email" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
          </view>
        </template>

        <view class="ac-divider" />
        <view class="ac-add-row" @tap="addContact">
          <image class="ac-add-icon" :src="iconPlus" mode="aspectFit" />
          <text class="ac-add-text">添加联系人</text>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('region')">
          <text class="ac-label">省/市/区</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.region }">{{ form.region || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">地址</text>
          <text class="ac-required">*</text>
          <input class="ac-input" v-model="form.address" placeholder="请输入"
            placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
      </view>

      <view class="ac-card">
        <text class="ac-card-title">系统信息</text>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('collaborator')">
          <text class="ac-label">协作人</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.collaboratorUserName }">{{ form.collaboratorUserName || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
      </view>
      
      <view class="ac-card">
        <text class="ac-card-title">商机信息</text>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('expectedDealDate')">
          <text class="ac-label">预计成交日期</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.expectedDealDate }">{{ form.expectedDealDate || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">预计销售金额</text>
          <input class="ac-input" v-model="form.expectedAmount" placeholder="请选择" placeholder-style="color:#BBBEC2;font-size:28rpx" type="digit" />
          <text class="ac-label">元</text>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('requiredProduct')">
          <text class="ac-label">需求产品</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.requiredProduct }">{{ form.requiredProduct || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
      </view>
    </scroll-view>

    <nut-popup v-model:visible="showLevelPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }"
      :z-index="2000">
      <view class="ac-popup">
        <view class="ac-popup-header">
          <text class="ac-popup-cancel" @tap="showLevelPopup = false">取消</text>
          <text class="ac-popup-title">客户等级</text>
          <text class="ac-popup-confirm" @tap="confirmLevel">确认</text>
        </view>
        <view class="ac-popup-body">
          <view v-for="item in levelOptions" :key="item" class="ac-popup-row" @tap="toggleSelect('level', item)">
            <text class="ac-popup-label" :class="{ 'ac-popup-label--set': selectedLevel === item }">{{ item }}</text>
            <view class="ac-checkbox" :class="{ 'ac-checkbox--checked': selectedLevel === item }">
              <view v-if="selectedLevel === item" class="ac-checkbox-dot" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showCategoryPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }"
      :z-index="2000">
      <view class="ac-popup">
        <view class="ac-popup-header">
          <text class="ac-popup-cancel" @tap="showCategoryPopup = false">取消</text>
          <text class="ac-popup-title">客户类别</text>
          <text class="ac-popup-confirm" @tap="confirmCategory">确认</text>
        </view>
        <view class="ac-popup-body">
          <view v-for="item in categoryOptions" :key="item" class="ac-popup-row" @tap="toggleSelect('category', item)">
            <text class="ac-popup-label" :class="{ 'ac-popup-label--set': selectedCategory === item }">{{ item }}</text>
            <view class="ac-checkbox" :class="{ 'ac-checkbox--checked': selectedCategory === item }">
              <view v-if="selectedCategory === item" class="ac-checkbox-dot" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showProjectTypePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }"
      :z-index="2000">
      <view class="ac-popup">
        <view class="ac-popup-header">
          <text class="ac-popup-cancel" @tap="showProjectTypePopup = false">取消</text>
          <text class="ac-popup-title">项目类型</text>
          <text class="ac-popup-confirm" @tap="confirmProjectType">确认</text>
        </view>
        <view class="ac-popup-body">
          <view v-for="item in projectTypeOptions" :key="item" class="ac-popup-row"
            @tap="toggleSelect('projectType', item)">
            <text class="ac-popup-label" :class="{ 'ac-popup-label--set': selectedProjectType === item }">{{ item
            }}</text>
            <view class="ac-checkbox" :class="{ 'ac-checkbox--checked': selectedProjectType === item }">
              <view v-if="selectedProjectType === item" class="ac-checkbox-dot" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showTypePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }"
      :z-index="2000">
      <view class="ac-popup">
        <view class="ac-popup-header">
          <text class="ac-popup-cancel" @tap="showTypePopup = false">取消</text>
          <text class="ac-popup-title">类型</text>
          <text class="ac-popup-confirm" @tap="confirmType">确认</text>
        </view>
        <view class="ac-popup-body">
          <view v-for="item in typeOptions" :key="item" class="ac-popup-row" @tap="toggleSelect('type', item)">
            <text class="ac-popup-label" :class="{ 'ac-popup-label--set': selectedType === item }">{{ item }}</text>
            <view class="ac-checkbox" :class="{ 'ac-checkbox--checked': selectedType === item }">
              <view v-if="selectedType === item" class="ac-checkbox-dot" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showOtherBrandPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }"
      :z-index="2000">
      <view class="ac-popup">
        <view class="ac-popup-header">
          <text class="ac-popup-cancel" @tap="showOtherBrandPopup = false">取消</text>
          <text class="ac-popup-title">是否使用其他品牌喷粉枪</text>
          <text class="ac-popup-confirm" @tap="confirmOtherBrand">确认</text>
        </view>
        <view class="ac-popup-body">
          <view v-for="item in otherBrandOptions" :key="item" class="ac-popup-row" @tap="toggleSelect('otherBrand', item)">
            <text class="ac-popup-label" :class="{ 'ac-popup-label--set': selectedOtherBrand === item }">{{ item }}</text>
            <view class="ac-checkbox" :class="{ 'ac-checkbox--checked': selectedOtherBrand === item }">
              <view v-if="selectedOtherBrand === item" class="ac-checkbox-dot" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <DuplicateCheckPopup v-model="showDuplicatePopup" :customer-name="form.customerName" />

    <FilterPopup v-model="showFilterPopup" :simple="true" :active-type="activeFilterType" :title="activeFilterTitle" :multiple="false" :initial-selected="activeFilterInitial" @confirm="onFilterConfirm" />

    <view class="ac-actions">
      <view class="ac-btn ac-btn--cancel" @tap="goBack">取消</view>
      <view class="ac-btn ac-btn--save" @tap="onSave">保存</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import iconBack from '@/assets/dev/icon-back.png'
import rightArrow from '@/assets/dev/rightArror.png'
import iconDelete from '@/assets/dev/delete.png'
import iconPlus from '@/assets/dev/plus.png'
import FilterPopup from '../components/FilterPopup.vue'
import DuplicateCheckPopup from '../components/DuplicateCheckPopup.vue'
import { createCustomer } from '@/api/customer'

const instance = Taro.getCurrentInstance()
const sourceLeadId = instance.router?.params?.id ? parseInt(String(instance.router.params.id)) : undefined

let contactIdSeq = 3

const form = reactive({
  customerName: '',
  industry: '',
  product: '',
  category: '',
  projectType: '',
  level: '',
  otherBrand: '是',
  brand: '',
  quantity: '',
  type: '',
  customerType: 'domestic',
  contacts: [
    { id: 1, name: '', position: '', phones: ['', ''], wechat: '', whatsapp: '', email: '' },
    { id: 2, name: '', position: '', phones: ['', ''], wechat: '', whatsapp: '', email: '' },
  ],
  region: '',
  regionProvinceCode: '',
  regionCityCode: '',
  regionDistrictCode: '',
  address: '',
  expectedDealDate: '',
  expectedAmount: '',
  requiredProduct: '',
  collaboratorUserName: '',
  collaboratorUserId: undefined,
})

const showLevelPopup = ref(false)
const showCategoryPopup = ref(false)
const showProjectTypePopup = ref(false)
const showTypePopup = ref(false)
const showOtherBrandPopup = ref(false)
const showDuplicatePopup = ref(false)
const showFilterPopup = ref(false)
const activeFilterType = ref('')
const activeFilterTitle = ref('')
const activeFilterInitial = ref([])

const selectedLevel = ref('')
const selectedCategory = ref('')
const selectedProjectType = ref('')
const selectedType = ref('')
const selectedOtherBrand = ref('')

const levelOptions = ['A级客户', 'B级客户', 'C级客户', 'D级客户']
const categoryOptions = ['客户', '设备商', '粉末商', '行业朋友']
const projectTypeOptions = ['新线', '旧线']
const typeOptions = ['自动喷粉枪', '手动喷粉枪']
const otherBrandOptions = ['是', '否']

const toggleSelect = (field, value) => {
  const refMap = { level: selectedLevel, category: selectedCategory, projectType: selectedProjectType, type: selectedType, otherBrand: selectedOtherBrand }
  const sel = refMap[field]
  sel.value = sel.value === value ? '' : value
}

const confirmLevel = () => {
  form.level = selectedLevel.value
  showLevelPopup.value = false
}

const confirmCategory = () => {
  form.category = selectedCategory.value
  showCategoryPopup.value = false
}

const confirmProjectType = () => {
  form.projectType = selectedProjectType.value
  showProjectTypePopup.value = false
}

const confirmType = () => {
  form.type = selectedType.value
  showTypePopup.value = false
}

const confirmOtherBrand = () => {
  form.otherBrand = selectedOtherBrand.value
  showOtherBrandPopup.value = false
}

const addPhone = (ci) => {
  form.contacts[ci].phones.push('')
}

const addContact = () => {
  form.contacts.push({
    id: contactIdSeq++,
    name: '',
    position: '',
    phones: ['', ''],
    wechat: '',
    whatsapp: '',
    email: '',
  })
}

const removePhone = (ci, pi) => {
  if (form.contacts[ci].phones.length <= 2) return
  form.contacts[ci].phones.splice(pi, 1)
}

const removeContact = (ci) => {
  if (form.contacts.length <= 1) return
  form.contacts.splice(ci, 1)
}

const openPicker = (field) => {
  if (field === 'region') {
    activeFilterType.value = 'region'
    activeFilterTitle.value = '省/市/区'
    activeFilterInitial.value = form.regionDistrictCode ? [form.regionDistrictCode] : []
    showFilterPopup.value = true
  } else if (field === 'industry') {
    activeFilterType.value = 'industry'
    activeFilterTitle.value = '客户行业'
    activeFilterInitial.value = form.industry ? [form.industry] : []
    showFilterPopup.value = true
  } else if (field === 'collaborator') {
    activeFilterType.value = 'userCascader'
    activeFilterTitle.value = '协作人'
    activeFilterInitial.value = form.collaboratorUserId ? [String(form.collaboratorUserId)] : []
    showFilterPopup.value = true
  } else if (field === 'otherBrand') {
    selectedOtherBrand.value = form.otherBrand
    showOtherBrandPopup.value = true
  }
}

const onFilterConfirm = (result) => {
  if (result.type === 'region') {
    form.region = result.regionPath || ''
    if (result.regionCodes) {
      form.regionProvinceCode = result.regionCodes.provinceCode
      form.regionCityCode = result.regionCodes.cityCode
      form.regionDistrictCode = result.regionCodes.districtCode
    }
  } else if (result.type === 'industry') {
    form.industry = result.selected.length > 0 ? result.selected[0] : ''
  } else if (result.type === 'userCascader') {
    form.collaboratorUserName = result.userName || ''
    form.collaboratorUserId = result.userId
  }
  showFilterPopup.value = false
}

const goBack = () => {
  Taro.navigateBack()
}

const categoryMap = { '客户': 'customer', '设备商': 'equipment_supplier', '粉末商': 'powder_supplier', '行业朋友': 'industry_friend' }
const projectTypeMap = { '新线': 'new_line', '旧线': 'old_line' }
const levelMap = { 'A级客户': 'A', 'B级客户': 'B', 'C级客户': 'C', 'D级客户': 'D' }
const industryMap = { '电气行业': 'electrical', '管道行业': 'pipeline', '卷涂行业': 'coil_coating', '家居行业': 'home', '家具行业': 'furniture', '交通行业': 'transportation', '行业类别': 'industry_category', '铝材行业': 'aluminum', '体育用品': 'sports_goods', '五金行业': 'hardware', '消防器材': 'fire_equipment', '新能源行业': 'new_energy', '重工行业': 'heavy_industry', '其他行业': 'other' }

const onSave = async () => {
  if (!form.customerName) {
    Taro.showToast({ title: '请输入客户名称', icon: 'none' })
    return
  }

  const body = {}
  body.name = form.customerName
  if (form.industry) body.industry = industryMap[form.industry] || form.industry
  if (form.product) body.workpiece = form.product
  if (form.category) body.category = categoryMap[form.category] || form.category
  if (form.projectType) body.projectType = projectTypeMap[form.projectType] || form.projectType
  if (form.level) body.level = levelMap[form.level] || form.level
  if (form.otherBrand === '是') {
    body.usesOtherBrandGun = true
  } else if (form.otherBrand === '否') {
    body.usesOtherBrandGun = false
  }
  if (form.brand) body.otherBrandGunBrand = form.brand
  if (form.quantity) body.otherBrandGunQty = parseInt(form.quantity)
  if (form.type) body.otherBrandGunType = form.type
  if (form.customerType) body.customerType = form.customerType

  const contacts = form.contacts
    .filter(c => c.name || c.phones.some(p => p))
    .map(c => {
      const contact = {}
      if (c.name) contact.name = c.name
      if (c.position) contact.position = c.position
      const phones = c.phones.filter(p => p).map(p => ({ phone: String(p) }))
      if (phones.length) contact.phones = phones
      if (c.wechat) contact.wechat = c.wechat
      if (c.whatsapp) contact.whatsapp = c.whatsapp
      if (c.email) contact.email = c.email
      return contact
    })
  if (contacts.length) body.contacts = contacts

  if (form.regionProvinceCode) body.provinceCode = form.regionProvinceCode
  if (form.regionCityCode) body.cityCode = form.regionCityCode
  if (form.regionDistrictCode) body.districtCode = form.regionDistrictCode
  if (form.address) body.address = form.address
  if (sourceLeadId) body.sourceLeadId = sourceLeadId
  if (form.collaboratorUserId) body.collaboratorUserIds = [form.collaboratorUserId]

  try {
    await createCustomer(body)
    Taro.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  } catch (e) {
    Taro.showToast({ title: e.message || '保存失败', icon: 'none' })
  }
}
</script>

<style>
.ac-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.ac-nav-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 153rpx;
  padding: 4rpx 40rpx 22rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #EDEEF0;
}

.ac-nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.ac-nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}

.ac-nav-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #1A1D24;
}

.ac-nav-right {
  width: 60rpx;
}

.ac-scroll {
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.ac-card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.ac-card-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #23252C;
}

.ac-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.ac-field {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.ac-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.ac-required {
  font-size: 28rpx;
  color: #F53F3F;
  flex-shrink: 0;
}

.ac-input {
  flex: 1;
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  border: none;
  outline: none;
  background: transparent;
}

.ac-value-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-left: auto;
}

.ac-value {
  font-size: 28rpx;
  color: #BBBEC2;
  text-align: right;
}

.ac-value--set {
  color: #1A1D24;
}

.ac-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.ac-dept-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.ac-dept-input {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 16rpx;
  background: #EDFAF5;
  border: 1rpx solid #B0DFCC;
  border-radius: 4rpx;
  width: 100%;
  box-sizing: border-box;
}

.ac-dept-placeholder {
  font-size: 28rpx;
  color: #37AE7E;
  text-align: center;
}

.ac-contact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ac-contact-group-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
}

.ac-contact-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ac-delete-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.ac-add-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.ac-add-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 8rpx 0;
}

.ac-add-text {
  font-size: 24rpx;
  color: #37AE7E;
}

.ac-radio-group {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.ac-radio {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.ac-radio-circle {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 2rpx solid #E5E6EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.ac-radio-circle--active {
  border-color: #37AE7E;
}

.ac-radio-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #37AE7E;
}

.ac-radio-label {
  font-size: 28rpx;
  color: #1A1D24;
}

.ac-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48rpx;
  padding: 40rpx 0;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
}

.ac-popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  width: 670rpx;
}

.ac-popup-cancel {
  font-size: 34rpx;
  color: #828593;
  flex-shrink: 0;
}

.ac-popup-title {
  flex: 1;
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.ac-popup-confirm {
  font-size: 34rpx;
  color: #37AE7E;
  flex-shrink: 0;
}

.ac-popup-body {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 48rpx;
  padding: 0 40rpx;
}

.ac-popup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
}

.ac-popup-label {
  font-size: 32rpx;
  color: #1A1D24;
}

.ac-popup-label--set {
  font-weight: 500;
}

.ac-checkbox {
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

.ac-checkbox--checked {
  background: #37AE7E;
  border-color: #37AE7E;
}

.ac-checkbox-dot {
  width: 18rpx;
  height: 14rpx;
  border-left: 4rpx solid #FFFFFF;
  border-bottom: 4rpx solid #FFFFFF;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

.ac-actions {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #FFFFFF;
}

.ac-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.ac-btn--cancel {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  color: #5CC79C;
}

.ac-btn--save {
  background: linear-gradient(270deg, rgba(102, 220, 166, 1) 0%, rgba(88, 188, 150, 1) 100%);
  color: #FFFFFF;
}

.ac-phone-wrapper {
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
