<template>
  <view class="md-page">
    <navBar title="素材详情" />
    <scroll-view class="md-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <!-- 加载中 -->
      <view v-if="loading" class="md-empty">
        <text class="md-empty-text">加载中...</text>
      </view>

      <!-- 素材不存在 -->
      <view v-else-if="!detail" class="md-empty">
        <text class="md-empty-text">素材不存在</text>
      </view>

      <!-- 有内容时按类型渲染 -->
      <template v-else>
        <!-- 头部卡片：标题 -->
        <view class="md-card">
          <text class="md-title">{{ detail.name || '-' }}</text>
          <view class="md-divider" />

          <!-- ============ article 图文 ============ -->
          <template v-if="detail.materialType === 'article'">
            <view class="md-cover-wrap" @tap="previewCover">
              <image class="md-cover-img" :src="detail.coverUrl" mode="widthFix" />
              <view class="md-cover-mask" />
              <image class="md-cover-arrow" :src="iconArrow" mode="aspectFit" />
            </view>
            <view v-if="detail.contentHtml" class="md-html-body">
              <rich-text :nodes="detail.contentHtml" />
            </view>
          </template>

          <!-- ============ poster 海报 ============ -->
          <template v-else-if="detail.materialType === 'poster'">
            <image class="md-poster-img" :src="detail.coverUrl" mode="widthFix" @tap="previewCover" />
          </template>

          <!-- ============ video 视频 ============ -->
          <template v-else-if="detail.materialType === 'video'">
            <video
              v-if="videoUrl"
              class="md-video"
              :src="videoUrl"
              :poster="detail.coverUrl"
              controls
              show-play-btn
              object-fit="contain"
            />
          </template>

          <!-- ============ document 文档 ============ -->
          <template v-else-if="detail.materialType === 'document'">
            <!-- 文件链接 -->
            <template v-if="detail.files && detail.files.length > 0">
              <view v-for="f in detail.files" :key="f.id" class="md-file-row">
                <view class="md-file-wrap">
                  <text class="md-file-name" @tap="previewFile(f.fileUrl)">{{ f.fileName }}</text>
                </view>
              </view>
              <view class="md-divider" />
            </template>
            <!-- 封面图 -->
            <image v-if="detail.coverUrl" class="md-poster-img" :src="detail.coverUrl" mode="widthFix" @tap="previewCover" />
  
          </template>

          <!-- ============ h5 H5 ============ -->
          <template v-else-if="detail.materialType === 'h5'">
            <template v-if="detail.files && detail.files.length > 0">
              <view v-for="f in detail.files" :key="f.id" class="md-file-row">
                <view class="md-file-wrap">
                  <text class="md-file-name" @tap="previewFile(f.fileUrl)">{{ f.fileName }}</text>
                </view>
              </view>
            </template>
            <view v-else-if="detail.h5Url" class="md-file-row">
              <view class="md-file-wrap">
                <text class="md-file-name" @tap="openH5Url">查看H5页面</text>
              </view>
            </view>
          </template>

          <!-- 默认兜底 -->
          <template v-else>
            <image v-if="detail.coverUrl" class="md-poster-img" :src="detail.coverUrl" mode="widthFix" />
            <view v-if="detail.contentHtml" class="md-html-body">
              <rich-text :nodes="detail.contentHtml" />
            </view>
            <view v-if="detail.files && detail.files.length > 0" class="md-file-row">
              <view v-for="f in detail.files" :key="f.id" class="md-file-wrap">
                <text class="md-file-name" @tap="previewFile(f.fileUrl)">{{ f.fileName }}</text>
              </view>
            </view>
          </template>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import navBar from '@/components/NavBar.vue'
import { getMaterialDetail } from '@/api/material'
import iconArrow from '@/assets/dev/rightArror.png'

const loading = ref(true)
const detail = ref<Record<string, any> | null>(null)

/** 视频素材：从 files 中提取视频 URL */
const videoUrl = computed(() => {
  if (!detail.value) return ''
  const files = detail.value.files || []
  const video = files.find((f: any) =>
    f.mimeType?.startsWith('video/') || /\.(mp4|mov|avi|webm)(\?|$)/i.test(f.fileUrl || '')
  )
  return video?.fileUrl || ''
})

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  const companyId = Number(instance.router?.params?.companyId)
  if (!id || !companyId) {
    loading.value = false
    return
  }
  try {
    detail.value = await getMaterialDetail(id, companyId) as Record<string, any>
  } catch {
    detail.value = null
  } finally {
    loading.value = false
  }
}

function previewCover() {
  if (detail.value?.coverUrl) {
    Taro.previewImage({
      urls: [detail.value.coverUrl],
      current: detail.value.coverUrl,
    })
  }
}

function previewFile(url: string) {
  if (!url) return
  // 图片直接预览
  if (/\.(png|jpg|jpeg|gif|webp|bmp)(\?|$)/i.test(url)) {
    Taro.previewImage({ urls: [url], current: url })
    return
  }
  // PDF 下载后打开
  if (/\.pdf(\?|$)/i.test(url)) {
    Taro.downloadFile({
      url,
      success(res) {
        if (res.statusCode === 200) {
          Taro.openDocument({ filePath: res.tempFilePath, fileType: 'pdf', showMenu: true })
        } else {
          Taro.showToast({ title: '打开失败', icon: 'none' })
        }
      },
      fail: () => Taro.showToast({ title: '下载失败', icon: 'none' }),
    })
    return
  }
  // 其他类型复制链接
  Taro.setClipboardData({ data: url })
  Taro.showToast({ title: '链接已复制', icon: 'none' })
}

function openH5Url() {
  if (detail.value?.h5Url) {
    Taro.setClipboardData({ data: detail.value.h5Url })
    Taro.showToast({ title: 'H5链接已复制', icon: 'none' })
  }
}

fetchDetail()
</script>

<style>
.md-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.md-scroll {
  padding: 24rpx 20rpx;
  box-sizing: border-box;
}

/* 卡片 */
.md-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

/* 标题 */
.md-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
  line-height: 48rpx;
}

/* 分割线 */
.md-divider {
  height: 2rpx;
  background: #E9E9E9;
}

/* 封面图容器（带遮罩） — article/video 用 */
.md-cover-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8rpx;
}

.md-cover-img {
  width: 100%;
  display: block;
}

.md-cover-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.49), transparent);
  pointer-events: none;
}

.md-cover-arrow {
  position: absolute;
  right: 24rpx;
  top: 50%;
  width: 48rpx;
  height: 48rpx;
}

/* 海报大图 */
.md-poster-img {
  width: 100%;
  display: block;
  border-radius: 8rpx;
}

/* 播放图标 */
.md-play-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 80rpx;
  color: rgba(255,255,255,0.9);
}

/* 文件链接行 */
.md-file-row {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.md-file-wrap {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

/* 链图标（CSS 模拟） */
.md-link-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
  position: relative;
  border-left: 3rpx solid #37AE7E;
  border-bottom: 3rpx solid #37AE7E;
  margin-right: 2rpx;
  transform: rotate(45deg);
  margin-top: -4rpx;
}

.md-file-name {
  font-size: 28rpx;
  color: #37AE7E;
  line-height: 40rpx;
}

/* 描述文字 */
.md-summary {
  padding-top: 8rpx;
}

.md-summary-text {
  font-size: 28rpx;
  color: #1A1D24;
  line-height: 44rpx;
}

/* 富文本内容 */
.md-html-body {
  font-size: 28rpx;
  color: #1A1D24;
  line-height: 44rpx;
}

/* 空状态 */
.md-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.md-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}
</style>
