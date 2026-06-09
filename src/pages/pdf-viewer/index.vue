<template>
  <view class="pdf-page">
    <!-- 加载中 -->
    <view v-if="loading" class="pdf-status">
      <view class="pdf-spinner" />
      <text class="pdf-status-text">加载中...</text>
    </view>

    <!-- 错误 -->
    <view v-else-if="errorMsg" class="pdf-status">
      <view class="pdf-error-icon">!</view>
      <text class="pdf-status-text pdf-error-text">{{ errorMsg }}</text>
      <view class="pdf-retry-btn" @tap="goBack">返回</view>
    </view>

    <!-- 无内容 -->
    <view v-else-if="!htmlContent" class="pdf-status">
      <text class="pdf-status-text">暂无合同内容</text>
    </view>

    <!-- HTML 渲染（合同预览） -->
    <view v-else class="pdf-html">
      <view class="pdf-header">
        <text class="pdf-title">{{ title }}</text>
      </view>
      <rich-text class="pdf-html-body" :nodes="htmlContent" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getContractSharePreview } from '@/api/contract'

const loading = ref(true)
const errorMsg = ref('')
const title = ref('')
const htmlContent = ref('')

onMounted(async () => {
  const instance = Taro.getCurrentInstance()
  const token = instance.router?.params?.token || ''

  if (!token) {
    errorMsg.value = '缺少访问凭证'
    loading.value = false
    return
  }

  try {
    const res = await getContractSharePreview(token) as Record<string, any>
    title.value = res.name || res.contractName || res.title || '合同文档'
    if (res.renderedHtml) {
      htmlContent.value = res.renderedHtml
    } else {
      errorMsg.value = '暂无合同内容'
    }
  } catch {
    errorMsg.value = '文档加载失败，链接可能已过期'
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  Taro.navigateBack().catch(() => {
    if (typeof window !== 'undefined') {
      window.close()
    }
  })
}
</script>

<style>
.pdf-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 状态容器 */
.pdf-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 24px;
  padding: 40px;
  box-sizing: border-box;
}

.pdf-status-text {
  font-size: 28px;
  color: #999;
}

.pdf-error-text {
  color: #e74c3c;
}

/* 加载动画 */
.pdf-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top-color: #37ae7e;
  border-radius: 50%;
  animation: pdf-spin 0.8s linear infinite;
}

@keyframes pdf-spin {
  to { transform: rotate(360deg); }
}

/* 错误图标 */
.pdf-error-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e74c3c;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
}

/* 返回按钮 */
.pdf-retry-btn {
  padding: 12px 48px;
  background: #37ae7e;
  color: #fff;
  border-radius: 8px;
  font-size: 28px;
}

/* 头部 */
.pdf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.pdf-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1d24;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pdf-page-info {
  font-size: 24px;
  color: #999;
  flex-shrink: 0;
  margin-left: 16px;
}

/* 滚动区 */
.pdf-scroll {
  height: calc(100vh - 77px);
}

/* HTML 渲染 */
.pdf-html {
  background: #fff;
  min-height: 100vh;
}

.pdf-html-body {
  padding: 24px;
  font-size: 28px;
  line-height: 1.8;
  color: #1a1d24;
}

/* 单页图片 */
.pdf-page-item {
  background: #fff;
  margin: 16px 12px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.pdf-page-img {
  width: 100%;
  display: block;
}

.pdf-page-num {
  display: block;
  text-align: center;
  padding: 12px;
  font-size: 24px;
  color: #bbb;
}
</style>
