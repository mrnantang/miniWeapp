<template>
  <view class="ac-page">
    <view class="ac-nav-bar">
      <view class="ac-nav-back" @tap="goBack">
        <image class="ac-nav-back-icon" :src="iconBack" mode="aspectFit" />
      </view>
      <text class="ac-nav-title">新增客户</text>
      <view class="ac-nav-right" />
    </view>

    <scroll-view class="ac-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="ac-card">
        <text class="ac-card-title">基础信息</text>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">客户名称</text>
          <text class="ac-required">*</text>
          <input class="ac-input" v-model="form.customerName" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-dept-row" @tap="showDuplicatePopup = true">
          <view class="ac-dept-input">
            <text class="ac-dept-placeholder">客户查重</text>
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">联系人</text>
          <text class="ac-required">*</text>
          <input class="ac-input" v-model="form.contact" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">联系人职位</text>
          <text class="ac-required">*</text>
          <input class="ac-input" v-model="form.contactTitle" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
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
          <text class="ac-required">*</text>
          <input class="ac-input" v-model="form.brand" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">数量</text>
          <input class="ac-input" v-model="form.quantity" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="showTypePopup = true">
          <text class="ac-label">类型</text>
          <text class="ac-required">*</text>
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
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">联系电话</text>
          <text class="ac-required">*</text>
          <input class="ac-input" v-model="form.phone" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" type="number" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">微信号</text>
          <input class="ac-input" v-model="form.wechat" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">WhatsApp</text>
          <input class="ac-input" v-model="form.whatsapp" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
        <view class="ac-divider" />
        <view class="ac-field">
          <text class="ac-label">邮箱</text>
          <input class="ac-input" v-model="form.email" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
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
          <input class="ac-input" v-model="form.address" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:28rpx" />
        </view>
      </view>

      <view class="ac-card">
        <text class="ac-card-title">系统信息</text>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('company')">
          <text class="ac-label">公司</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.company }">{{ form.company || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('dept')">
          <text class="ac-label">来源部门</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.dept }">{{ form.dept || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="showCollaboratorPopup = true">
          <text class="ac-label">协作人</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.collaborator }">{{ form.collaborator || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
        <view class="ac-divider" />
        <view class="ac-field" @tap="openPicker('owner')">
          <text class="ac-label">负责人</text>
          <text class="ac-required">*</text>
          <view class="ac-value-row">
            <text class="ac-value" :class="{ 'ac-value--set': form.owner }">{{ form.owner || '请选择' }}</text>
            <image class="ac-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
        </view>
      </view>
    </scroll-view>

    <nut-popup v-model:visible="showLevelPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
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

    <nut-popup v-model:visible="showCategoryPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
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

    <nut-popup v-model:visible="showProjectTypePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
      <view class="ac-popup">
        <view class="ac-popup-header">
          <text class="ac-popup-cancel" @tap="showProjectTypePopup = false">取消</text>
          <text class="ac-popup-title">项目类型</text>
          <text class="ac-popup-confirm" @tap="confirmProjectType">确认</text>
        </view>
        <view class="ac-popup-body">
          <view v-for="item in projectTypeOptions" :key="item" class="ac-popup-row" @tap="toggleSelect('projectType', item)">
            <text class="ac-popup-label" :class="{ 'ac-popup-label--set': selectedProjectType === item }">{{ item }}</text>
            <view class="ac-checkbox" :class="{ 'ac-checkbox--checked': selectedProjectType === item }">
              <view v-if="selectedProjectType === item" class="ac-checkbox-dot" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showTypePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
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

    <nut-popup v-model:visible="showCollaboratorPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000">
      <view class="ac-org-popup">
        <view class="ac-popup-header">
          <text class="ac-popup-cancel" @tap="showCollaboratorPopup = false">取消</text>
          <text class="ac-popup-title">协作人</text>
          <text class="ac-popup-confirm" @tap="confirmCollaborator">确认</text>
        </view>
        <view class="ac-org-body">
          <view class="ac-org-sidebar">
            <view class="ac-org-sidebar-item ac-org-sidebar-item--active">
              <text class="ac-org-sidebar-text ac-org-sidebar-text--active">公司/部门/员工</text>
            </view>
          </view>
          <view class="ac-org-content">
            <scroll-view scroll-y :enhanced="true" :show-scrollbar="false" class="ac-org-scroll">
              <text class="ac-org-section-title">公司</text>
              <view class="ac-org-tag-row">
                <view v-for="c in orgData.companies" :key="c.name" class="ac-org-tag" :class="{ 'ac-org-tag--active': orgSelected.includes(c.name) }" @tap="toggleOrg(c.name)">
                  <text class="ac-org-tag-text" :class="{ 'ac-org-tag-text--active': orgSelected.includes(c.name) }">{{ c.name }}</text>
                </view>
              </view>
              <text class="ac-org-section-title">部门</text>
              <view class="ac-org-tag-row">
                <view v-for="d in orgData.depts" :key="d.name" class="ac-org-tag" :class="{ 'ac-org-tag--active': orgSelected.includes(d.name) }" @tap="toggleOrg(d.name)">
                  <text class="ac-org-tag-text" :class="{ 'ac-org-tag-text--active': orgSelected.includes(d.name) }">{{ d.name }}</text>
                </view>
              </view>
              <text class="ac-org-section-title">子部门</text>
              <view class="ac-org-tag-row">
                <view v-for="s in orgData.subDepts" :key="s.name" class="ac-org-tag" :class="{ 'ac-org-tag--active': orgSelected.includes(s.name) }" @tap="toggleOrg(s.name)">
                  <text class="ac-org-tag-text" :class="{ 'ac-org-tag-text--active': orgSelected.includes(s.name) }">{{ s.name }}</text>
                </view>
              </view>
              <text class="ac-org-section-title">员工</text>
              <view class="ac-org-tag-row">
                <view v-for="e in orgData.employees" :key="e.name" class="ac-org-tag" :class="{ 'ac-org-tag--active': orgSelected.includes(e.name) }" @tap="toggleOrg(e.name)">
                  <text class="ac-org-tag-text" :class="{ 'ac-org-tag-text--active': orgSelected.includes(e.name) }">{{ e.name }}</text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="ac-org-footer">
          <view class="ac-org-footer-btn ac-org-footer-btn--clear" @tap="clearOrgSelected">
            <text class="ac-org-footer-clear-text">清空选择</text>
          </view>
          <view class="ac-org-footer-btn ac-org-footer-btn--confirm" @tap="confirmOrg">
            <text class="ac-org-footer-confirm-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <DuplicateCheckPopup v-model="showDuplicatePopup" />

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
import DuplicateCheckPopup from '../components/DuplicateCheckPopup.vue'

const form = reactive({
  customerName: '',
  contact: '',
  contactTitle: '',
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
  phone: '',
  wechat: '',
  whatsapp: '',
  email: '',
  region: '',
  address: '',
  company: '',
  dept: '',
  owner: '',
  collaborator: '',
})

const showLevelPopup = ref(false)
const showCategoryPopup = ref(false)
const showProjectTypePopup = ref(false)
const showTypePopup = ref(false)
const showCollaboratorPopup = ref(false)
const showDuplicatePopup = ref(false)

const selectedLevel = ref('')
const selectedCategory = ref('')
const selectedProjectType = ref('')
const selectedType = ref('')

const levelOptions = ['A级客户', 'B级客户', 'C级客户', 'D级客户']
const categoryOptions = ['客户', '设备商', '粉末商', '行业朋友']
const projectTypeOptions = ['新线', '旧线']
const typeOptions = ['自动喷粉枪', '手动喷粉枪']

const orgData = {
  companies: [
    { name: '德贝尔总公司' },
    { name: '江苏扬州办事处' },
    { name: '江苏苏州办事处' },
    { name: '江苏徐州办事处' },
  ],
  depts: [
    { name: '销售总部' },
    { name: '开发总部' },
    { name: '财务总部' },
    { name: '外贸总部' },
  ],
  subDepts: [
    { name: '销售一部' },
    { name: '销售二部' },
  ],
  employees: [
    { name: '张传送' },
    { name: '李治廷' },
    { name: '仇茂茂' },
    { name: '李聪' },
    { name: '屈伊' },
    { name: '陈子奕' },
  ],
}

const orgSelected = ref(['德贝尔总公司', '销售总部', '销售一部', '张传送'])

const toggleSelect = (field, value) => {
  const refMap = { level: selectedLevel, category: selectedCategory, projectType: selectedProjectType, type: selectedType }
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

const toggleOrg = (name) => {
  const idx = orgSelected.value.indexOf(name)
  if (idx >= 0) {
    orgSelected.value.splice(idx, 1)
  } else {
    orgSelected.value.push(name)
  }
}

const clearOrgSelected = () => {
  orgSelected.value = []
}

const confirmOrg = () => {
  form.collaborator = orgSelected.value.join('、')
  showCollaboratorPopup.value = false
}

const confirmCollaborator = () => {
  form.collaborator = orgSelected.value.join('、')
  showCollaboratorPopup.value = false
}

const openPicker = (field) => {
}

const goBack = () => {
  Taro.navigateBack()
}

const onSave = () => {
  Taro.showToast({ title: '保存成功', icon: 'none' })
  Taro.navigateBack()
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

.ac-org-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx 0 0;
}

.ac-org-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.ac-org-sidebar {
  width: 200rpx;
  flex-shrink: 0;
  background: #F6F7FB;
}

.ac-org-sidebar-item {
  display: flex;
  align-items: center;
  padding: 12rpx 40rpx;
}

.ac-org-sidebar-item--active {
  background: #FFFFFF;
}

.ac-org-sidebar-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #62687D;
}

.ac-org-sidebar-text--active {
  color: #37AE7E;
}

.ac-org-content {
  flex: 1;
  padding: 24rpx;
}

.ac-org-scroll {
  height: 100%;
}

.ac-org-section-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
  display: block;
  margin-bottom: 16rpx;
}

.ac-org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.ac-org-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 20rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  height: 60rpx;
}

.ac-org-tag--active {
  background: #EDFAF5;
}

.ac-org-tag-text {
  font-size: 26rpx;
  color: #62687D;
}

.ac-org-tag-text--active {
  color: #37AE7E;
}

.ac-org-footer {
  display: flex;
  gap: 28rpx;
  padding: 20rpx 40rpx 48rpx;
  flex-shrink: 0;
}

.ac-org-footer-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ac-org-footer-btn--clear {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.ac-org-footer-btn--confirm {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
}

.ac-org-footer-clear-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
}

.ac-org-footer-confirm-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
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
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
  color: #FFFFFF;
}
</style>
