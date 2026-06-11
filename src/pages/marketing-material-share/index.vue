<template>
  <view class="ms-page">
    <!-- 加载中 -->
    <view v-if="loading" class="ms-status">
      <view class="ms-spinner" />
      <text class="ms-status-text">加载中...</text>
    </view>

    <!-- 错误 -->
    <view v-else-if="errorMsg" class="ms-status">
      <view class="ms-error-icon">!</view>
      <text class="ms-status-text ms-error-text">{{ errorMsg }}</text>
    </view>

    <!-- 内容 -->
    <template v-else-if="detail">
      <!-- 头部卡片 -->
      <view class="ms-card">
        <text class="ms-title">{{ detail.name || '-' }}</text>
        <view class="ms-divider" />

        <!-- video 视频 -->
        <template v-if="detail.materialType === 'video'">
          <video
            v-if="videoUrl"
            class="ms-video"
            :src="videoUrl"
            :poster="detail.coverUrl"
            controls
            show-play-btn
            object-fit="contain"
          />
        </template>

        <!-- 图片类（poster/article） -->
        <image v-else-if="detail.coverUrl" class="ms-cover-img" :src="detail.coverUrl" @tap="previewImage" />

        <!-- 文件链接（document/h5） -->
        <template v-if="detail.files && detail.files.length > 0">
          <view v-for="f in detail.files" :key="f.id" class="ms-file-row">
            <view class="ms-link-icon" />
            <text class="ms-file-name" @tap="openFile(f.fileUrl)">{{ f.fileName }}</text>
          </view>
        </template>

        <!-- 描述文字 -->
        <view v-if="detail.summary" class="ms-summary">
          <text class="ms-summary-text">{{ detail.summary }}</text>
        </view>

        <!-- 富文本内容 -->
        <view v-if="detail.contentHtml" class="ms-html-body">
          <rich-text :nodes="detail.contentHtml" />
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getMaterialSharePreview } from '@/api/automation'

const loading = ref(true)
const errorMsg = ref('')
const detail = ref<Record<string, any> | null>(null)

const videoUrl = computed(() => {
  if (!detail.value) return ''
  const files = detail.value.files || []
  const video = files.find((f: any) => f.fileRole === 'video')
  return video?.fileUrl || ''
})

function previewImage() {
  const url = detail.value?.coverUrl
  if (url) {
    Taro.previewImage({ urls: [url], current: url })
  }
}

function openFile(url: string) {
  if (!url) return
  if (/\.(png|jpg|jpeg|gif|webp|bmp)(\?|$)/i.test(url)) {
    Taro.previewImage({ urls: [url], current: url })
    return
  }
  const docMatch = url.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf|keynote|numbers|pages)(\?|$)/i)
  if (docMatch) {
    // H5 环境直接 window.open 交给浏览器打开，避免 CORS 跨域问题
    // Taro.downloadFile 在 H5 中使用 XMLHttpRequest，会被浏览器 CORS 策略拦截
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
    return
  }
  Taro.setClipboardData({ data: url })
  Taro.showToast({ title: '链接已复制', icon: 'none' })
}

onMounted(async () => {
  const instance = Taro.getCurrentInstance()
  const traceCode = instance.router?.params?.traceCode || ''

  if (!traceCode) {
    errorMsg.value = '缺少访问凭证'
    loading.value = false
    return
  }

  try {
    const res = await getMaterialSharePreview(traceCode)
    detail.value = res.material as Record<string, any>
  } catch {
    errorMsg.value = '内容加载失败，链接可能已过期'
  } finally {
    loading.value = false
  }
})
</script>

<style>
.ms-page {
  min-height: 100vh;
  background: #F5F7F9;
}

/* 状态容器 */
.ms-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 24px;
  padding: 40px;
  box-sizing: border-box;
}

.ms-status-text {
  font-size: 28px;
  color: #999;
}

.ms-error-text {
  color: #e74c3c;
}

.ms-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top-color: #37ae7e;
  border-radius: 50%;
  animation: ms-spin 0.8s linear infinite;
}

@keyframes ms-spin {
  to { transform: rotate(360deg); }
}

.ms-error-icon {
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

/* 卡片 */
.ms-card {
  background: #FFFFFF;
  margin: 24rpx 20rpx;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.ms-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}

.ms-divider {
  height: 2rpx;
  background: #E9E9E9;
}

.ms-video {
  width: 100%;
  border-radius: 8rpx;
}

.ms-cover-img {
  border-radius: 8rpx;
}

.ms-file-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.ms-file-name {
  font-size: 28rpx;
  color: #37AE7E;
}

.ms-summary {
  padding-top: 8rpx;
}

.ms-summary-text {
  font-size: 28rpx;
  color: #1A1D24;
  line-height: 44rpx;
}

.ms-html-body {
  font-size: 28rpx;
  color: #1A1D24;
  line-height: 44rpx;
}
</style>
