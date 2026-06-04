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
              <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': deptDrillStack.length === 0 }" @tap="deptBackTo(0)">{{ deptDrillStack.length > 0 ? deptDrillStack[0].name : '请选择公司' }}</text>
              <template v-for="(node, idx) in deptDrillStack.slice(1)" :key="getDeptNodeKey(node)">
                <text class="region-breadcrumb-sep">/</text>
                <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': idx + 1 === deptDrillStack.length - 1 }" @tap="deptBackTo(idx + 1)">{{ node.name }}</text>
              </template>
              <template v-if="selectedDeptName">
                <text class="region-breadcrumb-sep">/</text>
                <text class="region-breadcrumb-item region-breadcrumb-item--active">{{ selectedDeptName }}</text>
              </template>
            </view>
            <view v-if="deptLoading" class="region-loading"><text class="region-loading-text">加载中...</text></view>
            <view v-else class="org-tag-row">
              <view v-for="item in currentDeptItems" :key="getDeptNodeKey(item)" class="org-tag" :class="{ 'org-tag--active': isDeptSelected(item) }" @tap="onDeptTap(item)">
                <text class="org-tag-text" :class="{ 'org-tag-text--active': isDeptSelected(item) }">{{ item.name }}</text>
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
import { getCompanyTree, type CompanyDepartmentTreeNode } from '@/api/system'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '选择部门' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', payload: { id: number; name: string }): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const deptLoading = ref(false)
const deptTree = ref<CompanyDepartmentTreeNode[]>([])
const deptDrillStack = ref<CompanyDepartmentTreeNode[]>([])
const selectedDeptId = ref(0)
const selectedDeptName = ref('')

const currentDeptItems = computed(() => {
  if (deptDrillStack.value.length === 0) return deptTree.value
  const last = deptDrillStack.value[deptDrillStack.value.length - 1]
  return last.children || []
})

function getDeptNodeKey(node: CompanyDepartmentTreeNode): string {
  return `d-${node.id}_${node.name}`
}

function isDeptSelected(node: any): boolean {
  return selectedDeptId.value > 0 && selectedDeptId.value === node.departmentId
}

async function fetchDeptTree() {
  if (deptTree.value.length > 0 || deptLoading.value) return
  deptLoading.value = true
  try {
    const res = await getCompanyTree()
    deptTree.value = res.items || []
  } catch { /* 已在 request 层处理 */ }
  finally { deptLoading.value = false }
}

function onDeptTap(node) {
  // 有 children → 下钻（公司、部门等非叶子节点）；无 children → 选中（叶子部门）
  if (node.children && node.children.length > 0) {
    deptDrillStack.value.push(node)
    selectedDeptId.value = 0
    selectedDeptName.value = ''
  } else {
    if (selectedDeptId.value === node.departmentId) {
      selectedDeptId.value = 0
      selectedDeptName.value = ''
    } else {
      selectedDeptId.value = node.departmentId
      selectedDeptName.value = node.name
    }
  }
}

function deptBackTo(index: number) {
  deptDrillStack.value = deptDrillStack.value.slice(0, index)
  selectedDeptId.value = 0
  selectedDeptName.value = ''
}

function onConfirm() {
  if (selectedDeptId.value <= 0) return
  emit('confirm', { id: selectedDeptId.value, name: selectedDeptName.value })
  visible.value = false
}

// 弹窗打开时自动加载部门树并重置状态
watch(() => props.modelValue, (val) => {
  if (val) {
    deptDrillStack.value = []
    selectedDeptId.value = 0
    selectedDeptName.value = ''
    fetchDeptTree()
  }
})
</script>

<style>
.filter-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filter-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 40rpx;
  position: relative;
}

.filter-header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.filter-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.filter-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24rpx;
}

.filter-footer {
  display: flex;
  gap: 28rpx;
  padding: 20rpx 40rpx;
}

.filter-footer-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-footer-clear {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.filter-footer-clear-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
}

.filter-footer-submit {
  background: linear-gradient(270deg, rgba(102, 220, 166, 1) 0%, rgba(88, 188, 150, 1) 100%);
}

.filter-footer-submit-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}

.region-section {
  display: flex;
  flex-direction: column;
}

.region-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4rpx;
  margin-bottom: 24rpx;
}

.region-breadcrumb-item {
  font-size: 28rpx;
  color: #9292A5;
}

.region-breadcrumb-item--active {
  color: #37AE7E;
  font-weight: 500;
}

.region-breadcrumb-sep {
  font-size: 28rpx;
  color: #9292A5;
  margin: 0 4rpx;
}

.region-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.region-loading-text {
  font-size: 26rpx;
  color: #9292A5;
}

.org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.org-tag {
  width: 208rpx;
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  box-sizing: border-box;
  text-align: center;
}

.org-tag--active {
  background: #EDFAF5;
}

.org-tag-text {
  font-size: 26rpx;
  color: #62687D;
}

.org-tag-text--active {
  color: #37AE7E;
}
</style>
