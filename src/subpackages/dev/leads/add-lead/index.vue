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

        <view class="form-row" @tap="openFilter('org', '负责人')">
          <text class="form-label">负责人</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.owner }">{{ form.owner || '请选择' }}</text>
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
          <input class="form-input" v-model="form.phone" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" type="number" />
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
        <view class="btn-save" @tap="onSave"><text class="btn-save-text">保存</text></view>
      </view>
    </scroll-view>

    <FilterPopup v-model="showFilterPopup" :simple="true" :active-type="activeFilterType" :title="activeFilterTitle" :multiple="activeFilterType !== 'leadLevel'" :initial-selected="activeFilterInitial" @confirm="onFilterConfirm" />
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import FilterPopup from '../components/FilterPopup.vue'
import rightArrowIcon from '../../../../assets/dev/rightArror.png'

const showFilterPopup = ref(false)
const activeFilterType = ref('channel')
const activeFilterTitle = ref('')
const activeFilterInitial = ref([])

const form = reactive({
  channel: '',
  owner: '',
  companyName: '',
  industry: '',
  leadLevel: '',
  contact: '',
  phone: '',
  wechat: '',
  whatsapp: '',
  email: '',
  region: '',
  remark: '',
})

const formFieldMap = {
  channel: 'channel',
  owner: 'owner',
  industry: 'industry',
  leadLevel: 'leadLevel',
  region: 'region',
}

const openFilter = (type, title) => {
  activeFilterType.value = type
  activeFilterTitle.value = title
  const fieldKey = Object.keys(formFieldMap).find(k => formFieldMap[k] === type)
  if (fieldKey) {
    activeFilterInitial.value = form[fieldKey] ? [form[fieldKey]] : []
  } else {
    activeFilterInitial.value = []
  }
  showFilterPopup.value = true
}

const onFilterConfirm = (result) => {
  const type = result.type
  const fieldKey = Object.keys(formFieldMap).find(k => formFieldMap[k] === type)
  if (fieldKey) {
    form[fieldKey] = result.selected.length > 0 ? result.selected[0] : ''
  }
}

const goBack = () => {
  uni.navigateBack()
}

const onSave = () => {
  uni.navigateBack()
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
  background: #FFFFFF;
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
.btn-cancel {
  background: #effdf7;
}
.btn-save-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #FFFFFF;
}
</style>
