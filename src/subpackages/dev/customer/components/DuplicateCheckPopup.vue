<template>
  <nut-popup v-model:visible="visible" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1074rpx' }" :z-index="2000" safe-area-inset-bottom>
    <view class="dcp-popup">
      <view class="dcp-header">
        <view class="dcp-header-side" />
        <text class="dcp-header-title">客户查重</text>
        <view class="dcp-header-side dcp-header-close" @tap="close">
          <image class="dcp-close-icon" :src="iconClose" mode="aspectFit" />
        </view>
      </view>

      <view class="dcp-input-row">
        <input
          class="dcp-input"
          v-model="keyword"
          placeholder="请输入需要查重的数据"
          placeholder-style="color:#BBBEC2;font-size:30rpx"
          @confirm="onSearch"
        />
        <image class="dcp-search-icon" :src="iconSearch" mode="aspectFit" @tap="onSearch" />
      </view>

      <view class="dcp-body">
        <view v-if="state === 'empty'" class="dcp-empty">
          <image class="dcp-empty-img" :src="iconEmptySearch" mode="aspectFit" />
          <text class="dcp-empty-text">暂无数据</text>
        </view>

        <view v-if="state === 'tooMany'" class="dcp-empty">
          <image class="dcp-empty-img" :src="iconTooMany" mode="aspectFit" />
          <view class="dcp-empty-text-wrap">
            <text class="dcp-empty-text">查询结果数量太多</text>
            <text class="dcp-empty-text">请填写更详细德查询数据</text>
          </view>
        </view>

        <scroll-view v-if="state === 'results'" class="dcp-results" scroll-y :enhanced="true" :show-scrollbar="false">
          <view
            v-for="item in results"
            :key="item.id"
            class="dcp-card"
          >
            <text class="dcp-card-name">
              <text v-if="item.before" class="dcp-card-name--normal">{{ item.before }}</text>
              <text class="dcp-card-name--hl">{{ keyword }}</text>
              <text v-if="item.after" class="dcp-card-name--bold">{{ item.after }}</text>
            </text>
            <view class="dcp-card-row">
              <text class="dcp-card-label">负责人：</text>
              <text class="dcp-card-value">{{ item.manager }}</text>
            </view>
            <view class="dcp-card-row">
              <text class="dcp-card-label">联系电话：</text>
              <text class="dcp-card-value">{{ item.phone }}</text>
            </view>
            <view class="dcp-card-row">
              <text class="dcp-card-label">创建时间：</text>
              <text class="dcp-card-value">{{ item.createTime }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </nut-popup>
</template>

<script setup>
import { ref, watch } from 'vue'
import iconClose from '@/assets/dev/icon-close.png'
import iconSearch from '@/assets/dev/icon-search.png'
import iconEmptySearch from '@/assets/dev/icon-empty-search.png'
import iconTooMany from '@/assets/dev/icon-too-many.png'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
watch(() => props.modelValue, (v) => {
  visible.value = v
  if (v) {
    keyword.value = ''
    state.value = 'empty'
    results.value = []
  }
})
watch(visible, (v) => emit('update:modelValue', v))

const keyword = ref('')
const state = ref('empty')
const results = ref([])

const mockSearchData = [
  { id: 1, name: '金山重工股份有限公司', manager: '张松', phone: '15899209987', createTime: '2024/01/23 10:12' },
  { id: 2, name: '金山重工有限公司', manager: '张松', phone: '15899209987', createTime: '2024/01/23 10:12' },
  { id: 3, name: '金山集团', manager: '张松', phone: '15899209987', createTime: '2024/01/23 10:12' },
]

const onSearch = () => {
  const kw = keyword.value.trim()
  if (!kw) {
    state.value = 'empty'
    results.value = []
    return
  }
  if (kw.length < 4) {
    state.value = 'tooMany'
    results.value = []
    return
  }
  const filtered = mockSearchData.filter((item) => item.name.includes(kw))
  if (filtered.length === 0) {
    state.value = 'empty'
    results.value = []
    return
  }
  results.value = filtered.map((item) => {
    const idx = item.name.indexOf(kw)
    return {
      ...item,
      before: idx > 0 ? item.name.slice(0, idx) : '',
      after: item.name.slice(idx + kw.length),
    }
  })
  state.value = 'results'
}

const close = () => {
  visible.value = false
}
</script>

<style>
.dcp-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.dcp-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 40rpx;
}
.dcp-header-side {
  width: 44rpx;
  height: 44rpx;
}
.dcp-header-close {
  display: flex;
  align-items: center;
  justify-content: center;
}
.dcp-close-icon {
  width: 28rpx;
  height: 28rpx;
}
.dcp-header-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}
.dcp-input-row {
  display: flex;
  align-items: center;
  margin: 0 40rpx;
  height: 72rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 0 20rpx;
}
.dcp-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}
.dcp-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.dcp-body {
  flex: 1;
  margin: 24rpx 40rpx 0;
  overflow: hidden;
}
.dcp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120rpx;
  gap: 40rpx;
}
.dcp-empty-img {
  width: 140rpx;
  height: 130rpx;
}
.dcp-empty-text-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.dcp-empty-text {
  font-size: 32rpx;
  color: #9CA5B1;
  text-align: center;
  line-height: 44rpx;
}
.dcp-results {
  height: 100%;
}
.dcp-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 16rpx;
}
.dcp-card-name {
  font-size: 28rpx;
  line-height: 1.4;
}
.dcp-card-name--normal {
  color: #1A1D24;
  font-weight: 400;
}
.dcp-card-name--hl {
  color: #37AE7E;
  font-weight: 600;
}
.dcp-card-name--bold {
  color: #1A1D24;
  font-weight: 600;
}
.dcp-card-row {
  display: flex;
  align-items: center;
}
.dcp-card-label {
  font-size: 28rpx;
  color: #62687D;
}
.dcp-card-value {
  font-size: 28rpx;
  color: #1A1D24;
}
</style>
