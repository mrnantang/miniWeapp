<template>
  <view class="add-lead-page">
    <scroll-view class="page-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="form-card">
        <view class="form-row">
          <text class="form-label">线索编号</text>
          <text class="form-value form-value--disabled">无需输入自动生成</text>
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="openFilter('channel', '渠道来源')">
          <text class="form-label">渠道来源</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.channel }">{{ form.channel || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="openFilter('userCascader', '负责人')">
          <text class="form-label">负责人</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.ownerUserName }">{{ form.ownerUserName || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">企业名称</text>
          <input class="form-input" v-model="form.companyName" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="openFilter('industry', '行业类型')">
          <text class="form-label">行业类型</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.industry }">{{ form.industry || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="openFilter('leadLevel', '线索等级')">
          <text class="form-label">线索等级</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.leadLevel }">{{ form.leadLevel || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">联系人</text>
          <input class="form-input" v-model="form.contact" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">联系电话</text>
          <input class="form-input" v-model="form.phone" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">微信号</text>
          <input class="form-input" v-model="form.wechat" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">WhatsApp</text>
          <input class="form-input" v-model="form.whatsapp" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">邮箱</text>
          <input class="form-input" v-model="form.email" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="openFilter('region', '省/市/区')">
          <text class="form-label">省/市/区</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.region }">{{ form.region || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">备注</text>
          <input class="form-input" v-model="form.remark" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
      </view>

      <view class="btn-row">
        <view class="btn-cancel" @tap="goBack"><text class="btn-cancel-text">取消</text></view>
        <view class="btn-save" :class="{ 'btn-save--loading': saving }" @tap="onSave">
          <text class="btn-save-text">{{ saving ? '保存中...' : '保存' }}</text>
        </view>
      </view>
    </scroll-view>

    <FilterPopup v-model="showFilterPopup" :simple="true" :active-type="activeFilterType" :title="activeFilterTitle" :multiple="false" :initial-selected="activeFilterInitial" @confirm="onFilterConfirm" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import FilterPopup from '../components/FilterPopup.vue'
import { createLead, type CreateLeadRequest } from '@/api/lead'
import rightArrowIcon from '@/assets/dev/rightArror.png'

const showFilterPopup = ref(false)
const activeFilterType = ref('channel')
const activeFilterTitle = ref('')
const activeFilterInitial = ref<string[]>([])
const saving = ref(false)

const form = reactive({
  channel: '',
  ownerUserName: '',
  ownerUserId: undefined as number | undefined,
  companyName: '',
  industry: '',
  leadLevel: '',
  contact: '',
  phone: '',
  wechat: '',
  whatsapp: '',
  email: '',
  region: '',
  regionProvinceCode: '',
  regionCityCode: '',
  regionDistrictCode: '',
  remark: '',
})

const fieldTypeMap: Record<string, string> = {
  channel: 'channel',
  owner: 'userCascader',
  industry: 'industry',
  leadLevel: 'leadLevel',
  region: 'region',
}

// FilterPopup 中文值 → API 英文码映射
const channelCodeMap: Record<string, string> = {
  '抖音平台': 'douyin',
  '百度平台': 'baidu',
  '腾讯广告': 'wechat_mp',
  '小红书': 'xiaohongshu',
}

const leadLevelMap: Record<string, string> = {
  'A级线索': 'A',
  'B级线索': 'B',
  'C级线索': 'C',
  'D级线索': 'D',
}

// FilterPopup 中文行业 → API 英文编码映射（与 OpenAPI customerIndustry 枚举对齐）
const industryMap: Record<string, string> = {
  '电气行业': 'electrical',
  '管道行业': 'pipeline',
  '卷涂行业': 'coil_coating',
  '家居行业': 'home',
  '家具行业': 'furniture',
  '交通行业': 'transportation',
  '行业类别': 'industry_category',
  '铝材行业': 'aluminum',
  '体育用品': 'sports_goods',
  '五金行业': 'hardware',
  '消防器材': 'fire_equipment',
  '新能源行业': 'new_energy',
  '重工行业': 'heavy_industry',
  '其他行业': 'other',
}

const openFilter = (type: string, title: string) => {
  activeFilterType.value = type
  activeFilterTitle.value = title

  if (type === 'region') {
    activeFilterInitial.value = form.regionDistrictCode ? [form.regionDistrictCode] : []
  } else if (type === 'userCascader') {
    activeFilterInitial.value = form.ownerUserId ? [String(form.ownerUserId)] : []
  } else {
    const fieldKey = Object.keys(fieldTypeMap).find(k => fieldTypeMap[k] === type)
    if (fieldKey) {
      activeFilterInitial.value = form[fieldKey] ? [form[fieldKey]] : []
    } else {
      activeFilterInitial.value = []
    }
  }

  showFilterPopup.value = true
}

const onFilterConfirm = (result: { type: string; selected: string[]; regionCodes?: { provinceCode: string; cityCode: string; districtCode: string }; regionPath?: string; userCascaderPath?: string; userId?: number; userName?: string }) => {
  if (result.type === 'region') {
    form.region = result.regionPath || (result.selected.length > 0 ? result.selected[0] : '')
    if (result.regionCodes) {
      form.regionProvinceCode = result.regionCodes.provinceCode
      form.regionCityCode = result.regionCodes.cityCode
      form.regionDistrictCode = result.regionCodes.districtCode
    }
  } else if (result.type === 'userCascader') {
    form.ownerUserName = result.userName || ''
    // form.ownerUserId = result.userId
    form.ownerUserId = 5
  } else {
    const fieldKey = Object.keys(fieldTypeMap).find(k => fieldTypeMap[k] === result.type)
    if (fieldKey) {
      form[fieldKey] = result.selected.length > 0 ? result.selected[0] : ''
    }
  }
  showFilterPopup.value = false
}

const goBack = () => {
  Taro.navigateBack()
}

const onSave = async () => {
  if (!form.companyName) {
    Taro.showToast({ title: '请输入企业名称', icon: 'none' })
    return
  }
  if (saving.value) return

  saving.value = true
  try {
    const data: CreateLeadRequest = {
      customerName: form.companyName,
      contactName: form.contact || undefined,
      phone: form.phone || undefined,
      wechat: form.wechat || undefined,
      whatsapp: form.whatsapp || undefined,
      email: form.email || undefined,
      remark: form.remark || undefined,
    }
    if (form.ownerUserId) data.ownerUserId = form.ownerUserId
    if (form.ownerUserName) data.ownerUserName = form.ownerUserName

    if (form.channel) {
      data.channelCode = channelCodeMap[form.channel] || form.channel
    }
    if (form.industry) {
      data.customerIndustry = industryMap[form.industry] || form.industry
    }
    if (form.leadLevel) {
      data.leadLevel = leadLevelMap[form.leadLevel] || form.leadLevel
    }
    if (form.regionProvinceCode) data.provinceCode = form.regionProvinceCode
    if (form.regionCityCode) data.cityCode = form.regionCityCode
    if (form.regionDistrictCode) data.districtCode = form.regionDistrictCode

    await createLead(data)
    Taro.showToast({ title: '新增成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  } catch (e) {
    Taro.showToast({ title: (e as Error).message || '保存失败', icon: 'none' })
  } finally {
    saving.value = false
  }
}
</script>

<style>
.add-lead-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 40rpx;
  background: #FFFFFF;
  position: relative;
}
.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-back-icon {
  width: 40rpx;
  height: 40rpx;
}
.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}
.nav-capsule {
  width: 174rpx;
  height: 64rpx;
}
.form-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 24rpx 40rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}

.form-label {
  font-size: 30rpx;
  color: #505361;
  flex-shrink: 0;
  margin-right: 12rpx;
}

.form-value {
  font-size: 30rpx;
  color: #BBBEC2;
  text-align: right;
}
.form-value--set {
  color: #1A1D24;
}
.form-value--disabled {
  color: #BBBEC2;
}

.form-value-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  justify-content: flex-end;
}

.form-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}
.form-divider {
  height: 1rpx;
  background: #F4F4F4;
  margin: 0;
}

.form-input {
  flex: 1;
  text-align: right;
  font-size: 30rpx;
  color: #1A1D24;
  height: 44rpx;
  line-height: 44rpx;
}

.btn-row {
  display: flex;
  gap: 40rpx;
  padding: 0 40rpx;
  margin-bottom: 80rpx;
}

.btn-cancel,
.btn-save {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: #effdf7;
  border: 2rpx solid #37AE7E;
}
.btn-cancel-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #37AE7E;
}

.btn-save {
  background: #37AE7E;
}
.btn-save--loading {
  opacity: 0.7;
}
.btn-save-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #FFFFFF;
}
</style>
