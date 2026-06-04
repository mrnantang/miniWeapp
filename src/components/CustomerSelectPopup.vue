<template>
  <nut-popup v-model:visible="visible" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2100" portal-disable safe-area-inset-bottom>
    <view class="customer-popup">
      <view class="customer-header">
        <text class="customer-header-btn" @tap="visible = false">取消</text>
        <text class="customer-header-title">{{ title }}</text>
        <text class="customer-header-btn customer-header-confirm" @tap="visible = false">确认</text>
      </view>
      <scroll-view class="customer-list" scroll-y>
        <view v-if="loading" class="customer-loading">加载中...</view>
        <view v-else-if="list.length === 0" class="customer-empty">暂无关联客户</view>
        <template v-else v-for="item in list" :key="item.id">
          <view class="customer-row" @tap="onSelect(item)">
            <text class="customer-name">{{ item.name }}</text>
          </view>
          <view class="customer-divider" />
        </template>
      </scroll-view>
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getRelatedCustomers } from '@/api/expense'
import type { CustomerItem } from '@/api/customer'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '选择关联客户' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', customer: CustomerItem): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const loading = ref(false)
const list = ref<CustomerItem[]>([])

async function fetchList() {
  if (list.value.length > 0 || loading.value) return
  loading.value = true
  try {
    list.value = await getRelatedCustomers()
  } catch {
    // 错误已在 request 层统一处理
  } finally {
    loading.value = false
  }
}

function onSelect(customer: CustomerItem) {
  emit('select', customer)
  visible.value = false
}

// 弹窗打开时自动加载客户列表
watch(() => props.modelValue, (val) => {
  if (val) fetchList()
})
</script>

<style>
.customer-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
}

.customer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
  flex-shrink: 0;
}

.customer-header-btn {
  font-size: 28rpx;
  color: #9292A5;
}

.customer-header-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.customer-header-confirm {
  color: #37AE7E;
}

.customer-list {
  flex: 1;
  padding: 0 40rpx;
  overflow-y: auto;
}

.customer-loading,
.customer-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  font-size: 28rpx;
  color: #9292A5;
}

.customer-row {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
}

.customer-name {
  font-size: 30rpx;
  color: #1A1D24;
}

.customer-divider {
  height: 1rpx;
  background: #F4F4F4;
}
</style>
