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
        <text class="ms-title">{{ detail.summary || '-' }}</text>
        <view class="ms-divider" />

        <!-- video 视频 -->
        <template v-if="detail.materialType === 'video'">
          <view>
            <video
            v-if="videoUrl"
            class="ms-video"
            :src="videoUrl"
            :poster="videoUrl"
            controls
            show-play-btn
          />
          </view>
        </template>

        <!-- H5 链接 -->
        <template v-if="detail.materialType === 'h5' && detail.h5Url">
          <view class="ms-h5-row" @tap="openUrl(detail.h5Url)">
            <text class="ms-h5-text">{{ detail.h5Url }}</text>
          </view>
        </template>

        <!-- 图片类 -->
        <template v-if="imageUrls.length > 0">
          <image
            v-for="url in imageUrls"
            :key="url"
            class="ms-cover-img"
            :src="url"
            mode="widthFix"
            @tap="previewImage(url)"
          />
        </template>

        <!-- 文档/链接文件 -->
        <template v-if="docFiles.length > 0">
          <view v-for="f in docFiles" :key="f.url" class="ms-file-row">
            <text class="ms-file-name" @tap="openFile(f.url)">{{ f.fileName || '附件' }}</text>
          </view>
        </template>

        <!-- 描述文字 -->
        <view v-if="detail.summary && detail.materialType !== 'video'" class="ms-summary">
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
  const vf = detail.value.videoFiles || []
  return vf[0]?.url || ''
})

const imageUrls = computed(() => {
  if (!detail.value) return []
  const imgs = detail.value.imageFiles || detail.value.posterFiles || []
  return imgs.filter((f: any) => f.url).map((f: any) => f.url)
})

const docFiles = computed(() => {
  if (!detail.value) return []
  const docs = detail.value.documentFiles || detail.value.files || []
  return docs.filter((f: any) => f.url || f.fileUrl).map((f: any) => ({
    url: f.url || f.fileUrl || '',
    fileName: f.fileName || '附件',
  }))
})

function previewImage(url: string) {
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
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
    return
  }
  Taro.setClipboardData({ data: url })
  Taro.showToast({ title: '链接已复制', icon: 'none' })
}

function openUrl(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank')
  }
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
  display: block;
  width: 60%;
  max-height: 480rpx;
  border-radius: 8rpx;
}

.ms-cover-img {
  border-radius: 8rpx;
  width: 100%;
}

/* H5 链接 */
.ms-h5-row {
  padding: 24rpx;
  background: #F6F7FB;
  border-radius: 8rpx;
}

.ms-h5-text {
  font-size: 28rpx;
  color: #37AE7E;
  word-break: break-all;
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
