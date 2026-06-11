<template>
  <nut-popup v-model:visible="visible" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2200" portal-disable safe-area-inset-bottom>
    <view class="filter-popup">
      <view class="filter-header">
        <text class="filter-header-title">{{ title }}</text>
      </view>
      <view class="filter-body">
        <scroll-view class="filter-content" scroll-y="true" :enhanced="true" :show-scrollbar="false">
          <view class="region-section">
            <view class="region-breadcrumb">
              <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': drillLevel === 0 }" @tap="backTo(0)">{{ drillProvince ? drillProvince.name : '请选择省份' }}</text>
              <text v-if="drillLevel >= 1" class="region-breadcrumb-sep">/</text>
              <text v-if="drillLevel >= 1" class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': drillLevel === 1 }" @tap="backTo(1)">{{ drillCity ? drillCity.name : '请选择城市' }}</text>
              <text v-if="drillLevel >= 2 && selectedCode" class="region-breadcrumb-sep">/</text>
              <text v-if="drillLevel >= 2 && selectedName" class="region-breadcrumb-item region-breadcrumb-item--active">{{ selectedName }}</text>
            </view>
            <view v-if="loading" class="region-loading"><text class="region-loading-text">加载中...</text></view>
            <view v-else class="org-tag-row">
              <view v-for="item in currentItems" :key="item.code" class="org-tag" :class="{ 'org-tag--active': isSelected(item) }" @tap="onTap(item)">
                <text class="org-tag-text" :class="{ 'org-tag-text--active': isSelected(item) }">{{ item.name }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="filter-footer">
        <view class="filter-footer-btn filter-footer-clear" @tap="visible = false">
          <text class="filter-footer-clear-text">取消</text>
        </view>
        <view class="filter-footer-btn filter-footer-submit" @tap="onConfirm">
          <text class="filter-footer-submit-text">确认</text>
        </view>
      </view>
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getRegionTree } from '@/api/platform'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title:     { type: String, default: '选择省市区' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', payload: { provinceCode: string; cityCode: string; districtCode: string; regionPath: string }): void
}>()

const visible = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })

const loading = ref(false)
const tree = ref<any[]>([])
const drillLevel = ref(0)
const drillProvince = ref<any>(null)
const drillCity = ref<any>(null)
const selectedCode = ref('')
const selectedName = ref('')

const currentItems = computed(() => {
  if (drillLevel.value === 0) return tree.value
  if (drillLevel.value === 1 && drillProvince.value) return drillProvince.value.children || []
  if (drillLevel.value === 2 && drillCity.value) return drillCity.value.children || []
  return []
})

const regionPath = computed(() => {
  const parts: string[] = []
  if (drillProvince.value) parts.push(drillProvince.value.name)
  if (drillCity.value) parts.push(drillCity.value.name)
  if (selectedName.value) parts.push(selectedName.value)
  return parts.join('/')
})

function isSelected(item: any): boolean {
  if (drillLevel.value === 0) return drillProvince.value?.code === item.code
  if (drillLevel.value === 1) return drillCity.value?.code === item.code
  return selectedCode.value === item.code
}

async function fetchTree() {
  if (tree.value.length > 0 || loading.value) return
  loading.value = true
  try {
    const res = await getRegionTree()
    tree.value = res.items || []
  } catch { /*  */ }
  finally { loading.value = false }
}

function onTap(item: any) {
  if (item.level === 1) {
    drillProvince.value = item
    drillCity.value = null
    drillLevel.value = 1
    selectedCode.value = ''
    selectedName.value = ''
  } else if (item.level === 2) {
    drillCity.value = item
    drillLevel.value = 2
    selectedCode.value = ''
    selectedName.value = ''
  } else if (item.level === 3) {
    selectedCode.value = item.code
    selectedName.value = item.name
  }
}

function backTo(level: number) {
  if (level === 0) {
    drillProvince.value = null; drillCity.value = null; drillLevel.value = 0
  } else if (level === 1) {
    drillCity.value = null; drillLevel.value = 1
  }
  selectedCode.value = ''
  selectedName.value = ''
}

function onConfirm() {
  if (!selectedCode.value) return
  emit('confirm', {
    provinceCode: drillProvince.value?.code || '',
    cityCode: drillCity.value?.code || '',
    districtCode: selectedCode.value,
    regionPath: regionPath.value,
  })
  visible.value = false
}

watch(() => props.modelValue, (val) => {
  if (val) {
    drillLevel.value = 0
    drillProvince.value = null
    drillCity.value = null
    selectedCode.value = ''
    selectedName.value = ''
    fetchTree()
  }
})
</script>

<style>
.filter-popup {
  display: flex; flex-direction: column; height: 100%;
}
.filter-header {
  display: flex; justify-content: center; align-items: center; padding: 24rpx 40rpx; position: relative;
}
.filter-header-title {
  flex: 1; text-align: center; font-size: 32rpx; font-weight: bold; color: #1A1D24;
}
.filter-body {
  display: flex; flex: 1; overflow: hidden;
}
.filter-content {
  flex: 1; background: #FFFFFF; padding: 24rpx;
}
.region-section {
  padding: 0;
}
.region-breadcrumb {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8rpx; margin-bottom: 24rpx; padding: 16rpx 0;
}
.region-breadcrumb-item {
  font-size: 26rpx; color: #62687D;
}
.region-breadcrumb-item--active {
  color: #37AE7E; font-weight: 500;
}
.region-breadcrumb-sep {
  font-size: 26rpx; color: #BBBEC2;
}
.region-loading {
  display: flex; justify-content: center; padding: 40rpx 0;
}
.region-loading-text {
  font-size: 26rpx; color: #9292A5;
}
.org-tag-row {
  display: flex; flex-wrap: wrap; gap: 24rpx; margin-bottom: 24rpx;
}
.org-tag {
  width: calc(50% - 12rpx); padding: 12rpx 10rpx; background: #F6F7FB; border-radius: 6rpx;
  text-align: center; box-sizing: border-box; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.org-tag--active {
  background: #EDFAF5;
}
.org-tag-text {
  font-size: 26rpx; color: #62687D;
}
.org-tag-text--active {
  color: #37AE7E;
}
.filter-footer {
  display: flex; gap: 28rpx; padding: 20rpx 40rpx 0;
}
.filter-footer-btn {
  flex: 1; height: 76rpx; border-radius: 8rpx; display: flex; align-items: center; justify-content: center;
}
.filter-footer-clear {
  background: #EFFDF7; border: 2rpx solid #5CC79C;
}
.filter-footer-clear-text {
  font-size: 32rpx; font-weight: 500; color: #5CC79C;
}
.filter-footer-submit {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
}
.filter-footer-submit-text {
  font-size: 32rpx; font-weight: 500; color: #FFFFFF;
}
</style>
