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
              <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': drillStack.length === 0 }" @tap="backTo(0)">{{ drillStack.length > 0 ? drillStack[0].name : '请选择公司' }}</text>
              <template v-for="(node, idx) in drillStack.slice(1)" :key="getKey(node)">
                <text class="region-breadcrumb-sep">/</text>
                <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': idx + 1 === drillStack.length - 1 }" @tap="backTo(idx + 1)">{{ node.name }}</text>
              </template>
              <template v-if="selectedName">
                <text class="region-breadcrumb-sep">/</text>
                <text class="region-breadcrumb-item region-breadcrumb-item--active">{{ selectedName }}</text>
              </template>
            </view>
            <view v-if="loading" class="region-loading"><text class="region-loading-text">加载中...</text></view>
            <view v-else class="org-tag-row">
              <view v-for="item in currentItems" :key="getKey(item)" class="org-tag" :class="{ 'org-tag--active': isSelected(item) }" @tap="onTap(item)">
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
import { getUserCascader } from '@/api/system'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title:     { type: String, default: '选择负责人' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', payload: { userId: number; userName: string }): void
}>()

const visible = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })

const loading = ref(false)
const tree = ref<any[]>([])
const drillStack = ref<any[]>([])
const selectedId = ref(0)
const selectedName = ref('')

const currentItems = computed(() => {
  if (drillStack.value.length === 0) return tree.value
  return drillStack.value[drillStack.value.length - 1].children || []
})

function getKey(node: any): string {
  if (node.nodeType === 'user') return `u-${node.userId}`
  if (node.nodeType === 'department') return `d-${node.departmentId || node.name}`
  return `c-${node.companyId || node.name}`
}

function isSelected(item: any): boolean {
  return selectedId.value > 0 && item.nodeType === 'user' && item.userId === selectedId.value
}

async function fetchTree() {
  if (tree.value.length > 0 || loading.value) return
  loading.value = true
  try {
    const res = await getUserCascader({ permissionCode: 'lead.create' })
    tree.value = res.items || []
  } catch { /*  */ }
  finally { loading.value = false }
}

function onTap(item: any) {
  if (item.nodeType === 'user') {
    if (selectedId.value === item.userId) {
      selectedId.value = 0
      selectedName.value = ''
    } else {
      selectedId.value = item.userId
      selectedName.value = item.name
    }
  } else {
    drillStack.value.push(item)
    selectedId.value = 0
    selectedName.value = ''
  }
}

function backTo(index: number) {
  drillStack.value = drillStack.value.slice(0, index)
  selectedId.value = 0
  selectedName.value = ''
}

function onConfirm() {
  if (selectedId.value <= 0) return
  emit('confirm', { userId: selectedId.value, userName: selectedName.value })
  visible.value = false
}

watch(() => props.modelValue, (val) => {
  if (val) {
    drillStack.value = []
    selectedId.value = 0
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
